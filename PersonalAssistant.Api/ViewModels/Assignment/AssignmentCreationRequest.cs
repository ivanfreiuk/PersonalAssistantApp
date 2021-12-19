using System;

namespace PersonalAssistant.Api.ViewModels.Assignment
{
    public class AssignmentCreationRequest
    {
        public int Id { get; set; }

        public int? DisciplineId { get; set; }
        
        public int? AssignmentTypeId { get; set; }

        public int? CreatorId { get; set; }

        public int? ExecutorId { get; set; }
        
        public string TopicName { get; set; }
        
        public DateTime PreferredDeadline { get; set; }

        public string Details { get; set; }
    }
}
