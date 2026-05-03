using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StreamingPlatform.Application.Interfaces;
using StreamingPlatform.Contracts.Content;

namespace StreamingPlatform.Api.Controllers;

[ApiController]
[Route("v1/content")]
public class ContentController : ControllerBase
{
    private readonly IContentService _contentService;

    public ContentController(IContentService contentService)
    {
        _contentService = contentService;
    }

    /// <summary>
    /// Get featured content
    /// </summary>
    [HttpGet("featured")]
    [ProducesResponseType(typeof(List<ServiceContentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetFeatured()
    {
        var content = await _contentService.GetFeaturedAsync();
        return Ok(content);
    }

    /// <summary>
    /// Get all live streams
    /// </summary>
    [HttpGet("live-now")]
    [ProducesResponseType(typeof(List<ServiceContentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetLiveNow()
    {
        var content = await _contentService.GetLiveNowAsync();
        return Ok(content);
    }

    /// <summary>
    /// Get content by category
    /// </summary>
    [HttpGet("category/{categoryId}")]
    [ProducesResponseType(typeof(List<ServiceContentDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetByCategory(Guid categoryId)
    {
        var content = await _contentService.GetByCategory(categoryId);
        return Ok(content);
    }

    /// <summary>
    /// Get content by ID
    /// </summary>
    [HttpGet("{id}")]
    [ProducesResponseType(typeof(ServiceContentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(Guid id)
    {
        var content = await _contentService.GetByIdAsync(id);
        if (content == null)
            return NotFound();

        return Ok(content);
    }

    /// <summary>
    /// Create new content
    /// </summary>
    [HttpPost]
    [Authorize]
    [ProducesResponseType(typeof(ServiceContentDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> Create([FromBody] ServiceContentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        var created = await _contentService.CreateAsync(dto);
        return CreatedAtAction(nameof(GetById), new { id = created.Id }, created);
    }

    /// <summary>
    /// Update content
    /// </summary>
    [HttpPut("{id}")]
    [Authorize]
    [ProducesResponseType(typeof(ServiceContentDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(Guid id, [FromBody] ServiceContentDto dto)
    {
        if (!ModelState.IsValid)
            return BadRequest(ModelState);

        try
        {
            var updated = await _contentService.UpdateAsync(id, dto);
            return Ok(updated);
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }

    /// <summary>
    /// Delete content
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(Guid id)
    {
        try
        {
            await _contentService.DeleteAsync(id);
            return NoContent();
        }
        catch (KeyNotFoundException)
        {
            return NotFound();
        }
    }
}
