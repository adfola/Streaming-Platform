using StreamingPlatform.Contracts.Auth;

namespace StreamingPlatform.Application.Interfaces;

public interface IAuthService
{
    Task<AuthResponse> LoginAsync(LoginRequest request);
    Task<AuthResponse> SignupAsync(SignupRequest request);
    Task<UserDto?> GetUserByIdAsync(Guid userId);
}
