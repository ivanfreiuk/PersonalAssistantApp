using System;
using PersonalAssistant.Api.ViewModels.AssignmentType;
using PersonalAssistant.Api.ViewModels.Discipline;
using PersonalAssistant.Api.ViewModels.User;

namespace PersonalAssistant.Api.ViewModels.Assignment
{
    public class AssignmentResponse
    {
        public int Id { get; set; }

        public int DisciplineId { get; set; }

        public DisciplineResponse Discipline { get; set; }

        public int AssignmentTypeId { get; set; }

        public AssignmentTypeResponse AssignmentType { get; set; }

        public int CreatorId { get; set; }

        public UserResponse Creator { get; set; }

        public int ExecutorId { get; set; }

        public UserResponse Executor { get; set; }

        public string TopicName { get; set; }

        public int PageQuantity { get; set; }

        public DateTime PreferredDeadline { get; set; }

        public string Details { get; set; }
    }
}
