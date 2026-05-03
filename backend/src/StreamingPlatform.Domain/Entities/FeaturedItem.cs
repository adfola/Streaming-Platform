namespace StreamingPlatform.Domain.Entities;

public class FeaturedItem
{
    public Guid Id { get; set; }
    public Guid ContentId { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime FeaturedAt { get; set; } = DateTime.UtcNow;
    public DateTime? ExpiresAt { get; set; }
    public bool IsActive { get; set; } = true;

    // Navigation properties
    public ServiceContent? Content { get; set; }
}
