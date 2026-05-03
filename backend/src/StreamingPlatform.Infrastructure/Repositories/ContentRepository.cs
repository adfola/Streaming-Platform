using Microsoft.EntityFrameworkCore;
using StreamingPlatform.Application.Interfaces;
using StreamingPlatform.Domain.Entities;
using StreamingPlatform.Infrastructure.Persistence;

namespace StreamingPlatform.Infrastructure.Repositories;

public class ContentRepository : IContentRepository
{
    private readonly AppDbContext _context;

    public ContentRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ServiceContent?> GetByIdAsync(Guid id)
    {
        return await _context.Content
            .Include(c => c.User)
            .Include(c => c.Category)
            .FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<List<ServiceContent>> GetAllAsync()
    {
        return await _context.Content
            .Include(c => c.User)
            .Include(c => c.Category)
            .ToListAsync();
    }

    public async Task<List<ServiceContent>> GetByUserIdAsync(Guid userId)
    {
        return await _context.Content
            .Where(c => c.UserId == userId)
            .Include(c => c.User)
            .Include(c => c.Category)
            .ToListAsync();
    }

    public async Task<List<ServiceContent>> GetByCategoryIdAsync(Guid categoryId)
    {
        return await _context.Content
            .Where(c => c.CategoryId == categoryId)
            .Include(c => c.User)
            .Include(c => c.Category)
            .OrderByDescending(c => c.ViewerCount)
            .ToListAsync();
    }

    public async Task<List<ServiceContent>> GetLiveNowAsync()
    {
        return await _context.Content
            .Where(c => c.IsLive && c.User!.IsActive)
            .Include(c => c.User)
            .Include(c => c.Category)
            .OrderByDescending(c => c.ViewerCount)
            .ToListAsync();
    }

    public async Task<List<ServiceContent>> GetFeaturedAsync()
    {
        return await _context.Content
            .Where(c => c.IsFeatured && (c.IsLive || c.Type == Domain.Enums.ContentType.Video))
            .Include(c => c.User)
            .Include(c => c.Category)
            .OrderByDescending(c => c.CreatedAt)
            .Take(10)
            .ToListAsync();
    }

    public async Task<ServiceContent> CreateAsync(ServiceContent content)
    {
        _context.Content.Add(content);
        await _context.SaveChangesAsync();
        return content;
    }

    public async Task<ServiceContent> UpdateAsync(ServiceContent content)
    {
        _context.Content.Update(content);
        await _context.SaveChangesAsync();
        return content;
    }

    public async Task DeleteAsync(Guid id)
    {
        var content = await GetByIdAsync(id);
        if (content != null)
        {
            _context.Content.Remove(content);
            await _context.SaveChangesAsync();
        }
    }
}
