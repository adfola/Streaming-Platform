using AutoMapper;
using StreamingPlatform.Application.Interfaces;
using StreamingPlatform.Contracts.Content;
using StreamingPlatform.Domain.Entities;

namespace StreamingPlatform.Application.Services;

public class CategoryService : ICategoryService
{
    private readonly ICategoryRepository _categoryRepository;
    private readonly IMapper _mapper;

    public CategoryService(ICategoryRepository categoryRepository, IMapper mapper)
    {
        _categoryRepository = categoryRepository;
        _mapper = mapper;
    }

    public async Task<List<CategoryResponse>> GetAllAsync()
    {
        var categories = await _categoryRepository.GetAllAsync();
        return _mapper.Map<List<CategoryResponse>>(categories);
    }

    public async Task<CategoryResponse?> GetByIdAsync(Guid categoryId)
    {
        var category = await _categoryRepository.GetByIdAsync(categoryId);
        return category == null ? null : _mapper.Map<CategoryResponse>(category);
    }

    public async Task<CategoryResponse?> GetBySlugAsync(string slug)
    {
        var category = await _categoryRepository.GetBySlugAsync(slug);
        return category == null ? null : _mapper.Map<CategoryResponse>(category);
    }

    public async Task<CategoryResponse> CreateAsync(CategoryResponse dto)
    {
        var category = new Category
        {
            Id = Guid.NewGuid(),
            Name = dto.Name,
            Slug = dto.Slug.ToLower(),
            Description = dto.Description,
            IconUrl = dto.IconUrl,
            DisplayOrder = dto.DisplayOrder,
            IsActive = true,
            CreatedAt = DateTime.UtcNow
        };

        var created = await _categoryRepository.CreateAsync(category);
        return _mapper.Map<CategoryResponse>(created);
    }

    public async Task<CategoryResponse> UpdateAsync(Guid categoryId, CategoryResponse dto)
    {
        var category = await _categoryRepository.GetByIdAsync(categoryId);
        if (category == null)
            throw new KeyNotFoundException($"Category with id {categoryId} not found");

        category.Name = dto.Name;
        category.Slug = dto.Slug.ToLower();
        category.Description = dto.Description;
        category.IconUrl = dto.IconUrl;
        category.DisplayOrder = dto.DisplayOrder;

        var updated = await _categoryRepository.UpdateAsync(category);
        return _mapper.Map<CategoryResponse>(updated);
    }

    public async Task DeleteAsync(Guid categoryId)
    {
        await _categoryRepository.DeleteAsync(categoryId);
    }
}
