using AutoMapper;
using PersonalAssistant.Api.ViewModels.Message;
using PersonalAssistant.DataAccess.Entities;
using System;

namespace PersonalAssistant.Api.Configurations.Mapper
{
    public class MessageProfile : Profile
    {
        public MessageProfile()
        {
            CreateMap<MessageCreationRequest, Message>()
                .ForMember(m => m.SentAt, opt => opt.MapFrom(dist => DateTime.Now));

            CreateMap<MessageUpdateRequest, Message>();

            CreateMap<Message, MessageResponse>();
        }
    }
}
