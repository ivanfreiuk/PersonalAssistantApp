using AutoMapper;
using PersonalAssistant.Api.ViewModels.Conversation;
using PersonalAssistant.DataAccess.Entities;

namespace PersonalAssistant.Api.Configurations.Mapper
{
    public class ConversationProfile : Profile
    {
        public ConversationProfile()
        {
            CreateMap<Conversation, ConversationResponse>();
        }
    }
}
