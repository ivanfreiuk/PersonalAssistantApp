namespace PersonalAssistant.Services.Models
{
    public class AssignmentFilterCriteria
    {
        public int? DisciplineId { get; set; }

        public int? AssignmentTypeId { get; set; }

        public int? CreatorId { get; set; }

        public int? ExecutorId { get; set; }

        public string TopicName { get; set; }
    }
}
