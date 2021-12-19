using System;

namespace PersonalAssistant.Api.ViewModels.Message
{
    public class MessageUpdateRequest
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int? RoomId { get; set; }
        public string Type { get; set; }
        public DateTime? EditedAt { get; set; }
        public string EditedBy { get; set; }
        public string Text { get; set; }
    }
}
