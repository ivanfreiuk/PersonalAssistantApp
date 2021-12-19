using System;
using PersonalAssistant.DataAccess.Identity;

namespace PersonalAssistant.DataAccess.Entities
{
    public class File
    {
        public int Id { get; set; }

        public int AssignmentId { get; set; }

        public Assignment Assignment { get; set; }

        public int UserId { get; set; }

        public User User { get; set; }

        public string FileName { get; set; }

        public string FileUrl { get; set; }

        public DateTime CreationDate { get; set; }
    }
}
