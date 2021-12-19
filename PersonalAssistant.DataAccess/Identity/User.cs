using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.Identity;
using PersonalAssistant.DataAccess.Entities;

namespace PersonalAssistant.DataAccess.Identity
{
    public class User: IdentityUser<int>
    {
        public int AvatarId { get; set; }

        public File Avatar { get; set; }

        // TODO change to avatar
        public string Icon { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Location { get; set; }

        public DateTime BirthDate { get; set; }

        public string EducationalInstitutionType { get; set; }

        public string EducationalInstitutionName { get; set; }

        public IEnumerable<Assignment> CreatorAssignments { get; set; }

        public IEnumerable<Assignment> ExecutorAssignments { get; set; }

        public IEnumerable<UserRoom> UserRooms { get; set; }

        public IEnumerable<Message> Messages { get; set; }

        // Chat
        public string Status { get; set; }

        public DateTime? LastActiveAt { get; set; }
    }
}
