using StreamingPlatform.Domain.Entities;

namespace StreamingPlatform.Application.Interfaces;

public interface IContentRepository
{
    Task<ServiceContent?> GetByIdAsync(Guid id);
    Task<List<ServiceContent>> GetAllAsync();
    Task<List<ServiceContent>> GetByUserIdAsync(Guid userId);
    Task<List<ServiceContent>> GetByCategoryIdAsync(Guid categoryId);
    Task<List<ServiceContent>> GetLiveNowAsync();
    Task<List<ServiceContent>> GetFeaturedAsync();
    Task<ServiceContent> CreateAsync(ServiceContent content);
    Task<ServiceContent> UpdateAsync(ServiceContent content);
    Task DeleteAsync(Guid id);
}
