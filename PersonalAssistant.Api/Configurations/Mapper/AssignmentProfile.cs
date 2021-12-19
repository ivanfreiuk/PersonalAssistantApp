using AutoMapper;
using PersonalAssistant.Api.ViewModels.Assignment;
using PersonalAssistant.DataAccess.Entities;
using System;

namespace PersonalAssistant.Api.Configurations.Mapper
{
    public class AssignmentProfile : Profile
    {
        public AssignmentProfile()
        {
            CreateMap<AssignmentCreationRequest, Assignment>()
                .ForMember(a => a.CreationDate, opt => opt.MapFrom(dist => DateTime.Now));

            CreateMap<AssignmentUpdateRequest, Assignment>();

            CreateMap<Assignment, AssignmentResponse>();
        }
    }
}
