using System;
using PersonalAssistant.DataAccess.Identity;

namespace PersonalAssistant.DataAccess.Entities
{
    public class Comment
    {
        public int Id { get; set; }

        public int AssignmentId { get; set; }

        public Assignment Assignment { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public string Headline { get; set; }

        public string Content { get; set; }

        public DateTime CreationDate { get; set; }
    }
}
