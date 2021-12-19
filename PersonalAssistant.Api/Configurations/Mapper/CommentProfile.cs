using AutoMapper;
using PersonalAssistant.Api.ViewModels.Comment;
using PersonalAssistant.DataAccess.Entities;

namespace PersonalAssistant.Api.Configurations.Mapper
{
    public class CommentProfile: Profile
    {
        public CommentProfile()
        {
            CreateMap<CommentCreationRequest, Comment>();

            CreateMap<CommentUpdateRequest, Comment>();

            CreateMap<Comment, CommentResponse>();
        }
    }
}
