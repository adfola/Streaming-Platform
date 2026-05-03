namespace StreamingPlatform.Contracts.Content;

public class FeaturedResponse
{
    public Guid Id { get; set; }
    public ServiceContentDto? Content { get; set; }
    public int DisplayOrder { get; set; }
    public DateTime FeaturedAt { get; set; }
}
