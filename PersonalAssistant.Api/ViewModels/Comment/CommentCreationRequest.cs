using System;

namespace PersonalAssistant.Api.ViewModels.Comment
{
    public class CommentCreationRequest
    {
        public int Id { get; set; }

        public int AssignmentId { get; set; }
        
        public int UserId { get; set; }
        
        public string Headline { get; set; }

        public string Content { get; set; }

        public DateTime CreationDate { get; set; }
    }
}
