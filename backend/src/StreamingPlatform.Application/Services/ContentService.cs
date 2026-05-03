using AutoMapper;
using StreamingPlatform.Application.Interfaces;
using StreamingPlatform.Contracts.Content;
using StreamingPlatform.Domain.Entities;

namespace StreamingPlatform.Application.Services;

public class ContentService : IContentService
{
    private readonly IContentRepository _contentRepository;
    private readonly IMapper _mapper;

    public ContentService(IContentRepository contentRepository, IMapper mapper)
    {
        _contentRepository = contentRepository;
        _mapper = mapper;
    }

    public async Task<List<ServiceContentDto>> GetFeaturedAsync()
    {
        var featured = await _contentRepository.GetFeaturedAsync();
        return _mapper.Map<List<ServiceContentDto>>(featured);
    }

    public async Task<List<ServiceContentDto>> GetLiveNowAsync()
    {
        var liveContent = await _contentRepository.GetLiveNowAsync();
        return _mapper.Map<List<ServiceContentDto>>(liveContent);
    }

    public async Task<List<ServiceContentDto>> GetByCategory(Guid categoryId)
    {
        var content = await _contentRepository.GetByCategoryIdAsync(categoryId);
        return _mapper.Map<List<ServiceContentDto>>(content);
    }

    public async Task<ServiceContentDto?> GetByIdAsync(Guid contentId)
    {
        var content = await _contentRepository.GetByIdAsync(contentId);
        return content == null ? null : _mapper.Map<ServiceContentDto>(content);
    }

    public async Task<ServiceContentDto> CreateAsync(ServiceContentDto dto)
    {
        var content = _mapper.Map<ServiceContent>(dto);
        content.Id = Guid.NewGuid();
        content.CreatedAt = DateTime.UtcNow;

        var created = await _contentRepository.CreateAsync(content);
        return _mapper.Map<ServiceContentDto>(created);
    }

    public async Task<ServiceContentDto> UpdateAsync(Guid contentId, ServiceContentDto dto)
    {
        var content = await _contentRepository.GetByIdAsync(contentId);
        if (content == null)
            throw new KeyNotFoundException($"Content with id {contentId} not found");

        _mapper.Map(dto, content);
        content.UpdatedAt = DateTime.UtcNow;

        var updated = await _contentRepository.UpdateAsync(content);
        return _mapper.Map<ServiceContentDto>(updated);
    }

    public async Task DeleteAsync(Guid contentId)
    {
        await _contentRepository.DeleteAsync(contentId);
    }
}
