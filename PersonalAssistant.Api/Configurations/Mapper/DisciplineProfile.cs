using AutoMapper;
using PersonalAssistant.Api.ViewModels.Discipline;
using PersonalAssistant.DataAccess.Entities;

namespace PersonalAssistant.Api.Configurations.Mapper
{
    public class DisciplineProfile: Profile
    {
        public DisciplineProfile()
        {
            CreateMap<DisciplineCreationRequest, Discipline>();

            CreateMap<DisciplineUpdateRequest, Discipline>();

            CreateMap<Discipline, DisciplineResponse>();
        }
    }
}
