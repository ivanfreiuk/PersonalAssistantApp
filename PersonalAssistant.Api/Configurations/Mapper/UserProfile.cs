using AutoMapper;
using PersonalAssistant.Api.ViewModels.User;
using PersonalAssistant.DataAccess.Identity;

namespace PersonalAssistant.Api.Configurations.Mapper
{
    public class UserProfile: Profile
    {
        public UserProfile()
        {
            CreateMap<User, UserModel>();

            CreateMap<UserModel, User>();

            CreateMap<UserRegisterRequest, User>()
                .ForMember(u=> u.UserName, opt=>opt.MapFrom(urm=>urm.Email));

            CreateMap<User, UserResponse>();
        }
    }
}
