using AutoMapper;
using PersonalAssistant.Api.ViewModels.AssignmentType;
using PersonalAssistant.DataAccess.Entities;

namespace PersonalAssistant.Api.Configurations.Mapper
{
    public class AssignmentTypeProfile: Profile
    {
        public AssignmentTypeProfile()
        {
            CreateMap<AssignmentTypeCreationRequest, AssignmentType>();

            CreateMap<AssignmentTypeUpdateRequest, AssignmentType>();

            CreateMap<AssignmentType, AssignmentTypeResponse>();
        }
    }
}
