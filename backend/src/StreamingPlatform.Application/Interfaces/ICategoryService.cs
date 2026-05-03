using StreamingPlatform.Contracts.Content;

namespace StreamingPlatform.Application.Interfaces;

public interface ICategoryService
{
    Task<List<CategoryResponse>> GetAllAsync();
    Task<CategoryResponse?> GetByIdAsync(Guid categoryId);
    Task<CategoryResponse?> GetBySlugAsync(string slug);
    Task<CategoryResponse> CreateAsync(CategoryResponse dto);
    Task<CategoryResponse> UpdateAsync(Guid categoryId, CategoryResponse dto);
    Task DeleteAsync(Guid categoryId);
}
