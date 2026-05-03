namespace StreamingPlatform.Contracts.Search;

// ── Request ───────────────────────────────────────────────
public record SearchRequest(
    string Query,
    string? Category = null,
    bool? LiveOnly = null,
    int Page = 1,
    int PageSize = 20
);

// ── Responses ─────────────────────────────────────────────
public record SearchResultItem(
    Guid Id,
    string Type,           // "stream" | "user" | "category"
    string Title,
    string? Subtitle,
    string? ThumbnailUrl,
    string? Category,
    bool IsLive,
    string? ViewerCount
);

public record SearchResponse(
    IEnumerable<SearchResultItem> Results,
    int TotalCount,
    int Page,
    int PageSize,
    bool HasMore
);