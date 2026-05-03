using StreamingPlatform.Application.Interfaces;
using StreamingPlatform.Contracts.Auth;
using StreamingPlatform.Domain.Entities;

namespace StreamingPlatform.Application.Services;

public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly ITokenService _tokenService;
    private readonly PasswordHasher _passwordHasher;

    public AuthService(IUserRepository userRepository, ITokenService tokenService, PasswordHasher passwordHasher)
    {
        _userRepository = userRepository;
        _tokenService = tokenService;
        _passwordHasher = passwordHasher;
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userRepository.GetByEmailAsync(request.Email);
        if (user == null || !_passwordHasher.VerifyPassword(request.Password, user.PasswordHash))
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Invalid email or password"
            };
        }

        if (!user.IsActive)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "User account is inactive"
            };
        }

        user.LastLoginAt = DateTime.UtcNow;
        await _userRepository.UpdateAsync(user);

        var token = _tokenService.GenerateToken(user);

        return new AuthResponse
        {
            Success = true,
            Message = "Login successful",
            Token = token,
            User = MapToUserDto(user)
        };
    }

    public async Task<AuthResponse> SignupAsync(SignupRequest request)
    {
        // Check if user already exists
        var existingUser = await _userRepository.GetByEmailAsync(request.Email);
        if (existingUser != null)
        {
            return new AuthResponse
            {
                Success = false,
                Message = "Email already registered"
            };
        }

        // Generate username from email
        var username = request.Email.Split('@')[0].ToLower();
        var existingUsername = await _userRepository.GetByUsernameAsync(username);
        if (existingUsername != null)
        {
            username = username + Guid.NewGuid().ToString().Substring(0, 5);
        }

        // Create new user
        var newUser = new User
        {
            Id = Guid.NewGuid(),
            Email = request.Email,
            Username = username,
            DisplayName = request.FullName,
            PasswordHash = _passwordHasher.HashPassword(request.Password),
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        await _userRepository.CreateAsync(newUser);

        var token = _tokenService.GenerateToken(newUser);

        return new AuthResponse
        {
            Success = true,
            Message = "Signup successful",
            Token = token,
            User = MapToUserDto(newUser)
        };
    }

    public async Task<UserDto?> GetUserByIdAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        return user == null ? null : MapToUserDto(user);
    }

    private static UserDto MapToUserDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            DisplayName = user.DisplayName,
            AvatarUrl = user.AvatarUrl,
            Role = user.Role.ToString()
        };
    }
}
