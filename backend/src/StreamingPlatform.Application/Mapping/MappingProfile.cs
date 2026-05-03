using AutoMapper;
using StreamingPlatform.Contracts.Content;
using StreamingPlatform.Domain.Entities;

namespace StreamingPlatform.Application.Mapping;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // ServiceContent mappings
        CreateMap<ServiceContent, ServiceContentDto>()
            .ForMember(dest => dest.BroadcasterName, opt => opt.MapFrom(src => src.User!.DisplayName ?? src.User.Username))
            .ForMember(dest => dest.CategoryName, opt => opt.MapFrom(src => src.Category!.Name))
            .ForMember(dest => dest.Type, opt => opt.MapFrom(src => src.Type.ToString()));

        CreateMap<ServiceContentDto, ServiceContent>()
            .ForMember(dest => dest.Type, opt => opt.Ignore());

        // Category mappings
        CreateMap<Category, CategoryResponse>();
        CreateMap<CategoryResponse, Category>();
    }
}
