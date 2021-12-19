using AutoMapper;
using PersonalAssistant.Api.ViewModels.Room;
using PersonalAssistant.DataAccess.Entities;
using System.Linq;

namespace PersonalAssistant.Api.Configurations.Mapper
{
    public class RoomProfile : Profile
    {
        public RoomProfile()
        {
            CreateMap<RoomCreationRequest, Room>();

            CreateMap<RoomUpdateRequest, Room>();

            CreateMap<Room, RoomResponse>()
                .ForMember(r => r.MembersCount, opt => opt.MapFrom(dist => dist.UserRooms.Count()))
                .ForMember(r => r.Users, opt => opt.MapFrom(dist => dist.UserRooms.Select(ur => ur.User)));
        }
    }
}
