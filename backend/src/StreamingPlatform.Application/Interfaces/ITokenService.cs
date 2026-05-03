using System.Security.Claims;
using StreamingPlatform.Domain.Entities;

namespace StreamingPlatform.Application.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
    ClaimsPrincipal? ValidateToken(string token);
}
