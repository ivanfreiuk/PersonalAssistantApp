using System;
using System.Collections.Generic;
using PersonalAssistant.DataAccess.Identity;

namespace PersonalAssistant.DataAccess.Entities
{
    public class Assignment
    {
        public int Id { get; set; }

        public int? DisciplineId { get; set; }

        public Discipline Discipline { get; set; }

        public int? AssignmentTypeId { get; set; }

        public AssignmentType AssignmentType { get; set; }

        public int? CreatorId { get; set; }

        public User Creator { get; set; }

        public int? ExecutorId { get; set; }

        public User Executor { get; set; }

        public string TopicName { get; set; }

        public DateTime PreferredDeadline { get; set; }

        public DateTime CreationDate { get; set; }

        public string Details { get; set; }

        public IEnumerable<Comment> Comments { get; set; }

        public IEnumerable<File> Files { get; set; }
    }
}
