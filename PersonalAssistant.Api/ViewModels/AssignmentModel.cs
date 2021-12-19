using System;

namespace PersonalAssistant.Api.ViewModels
{
    public class AssignmentModel
    {
        public int Id { get; set; }

        public int AssignmentTypeId { get; set; }

        public int UserId { get; set; }

        public string TopicName { get; set; }

        public int PageQuantity { get; set; }

        public DateTime PreferredDeadline { get; set; }

        public string Details { get; set; }
    }
}
