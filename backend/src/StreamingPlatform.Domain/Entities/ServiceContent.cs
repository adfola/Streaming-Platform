namespace StreamingPlatform.Domain.Entities;

using StreamingPlatform.Domain.Enums;

public class ServiceContent
{
    public Guid Id { get; set; } = Guid.NewGuid();
    public string Title { get; set; } = default!;
    public string Description { get; set; } = default!;
    public string ThumbnailUrl { get; set; } = default!;
    public string StreamUrl { get; set; } = default!;
    public int ViewerCount { get; set; } = 0;
    public bool IsLive { get; set; }
    public bool IsFeatured { get; set; }
    public ContentType Type { get; set; } = ContentType.Live;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime? UpdatedAt { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? EndedAt { get; set; }

    // Foreign keys
    public Guid CategoryId { get; set; }
    public Category Category { get; set; } = default!;

    public Guid UserId { get; set; }
    public User User { get; set; } = default!;
}
