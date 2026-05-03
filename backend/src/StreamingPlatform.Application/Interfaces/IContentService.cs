using StreamingPlatform.Contracts.Content;

namespace StreamingPlatform.Application.Interfaces;

public interface IContentService
{
    Task<List<ServiceContentDto>> GetFeaturedAsync();
    Task<List<ServiceContentDto>> GetLiveNowAsync();
    Task<List<ServiceContentDto>> GetByCategory(Guid categoryId);
    Task<ServiceContentDto?> GetByIdAsync(Guid contentId);
    Task<ServiceContentDto> CreateAsync(ServiceContentDto dto);
    Task<ServiceContentDto> UpdateAsync(Guid contentId, ServiceContentDto dto);
    Task DeleteAsync(Guid contentId);
}
