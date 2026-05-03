namespace StreamingPlatform.Contracts.Content;

public class ServiceResponse
{
    public bool Success { get; set; }
    public string Message { get; set; } = string.Empty;
    public object? Data { get; set; }
}

public class ServiceContentDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid CategoryId { get; set; }
    public string Title { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ThumbnailUrl { get; set; }
    public string? StreamUrl { get; set; }
    public string Type { get; set; } = string.Empty;
    public int ViewerCount { get; set; }
    public bool IsLive { get; set; }
    public bool IsFeatured { get; set; }
    public DateTime CreatedAt { get; set; }
    public string? BroadcasterName { get; set; }
    public string? CategoryName { get; set; }
}
