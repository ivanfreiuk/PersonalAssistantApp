using System;

namespace PersonalAssistant.Api.ViewModels.Room
{
    public class RoomCreationRequest
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public string ConversationType { get; set; }
        public string RoomType { get; set; }
        public string Password { get; set; }
        public int OwnerId { get; set; }
        public DateTime? CreatedAt { get; set; }
    }
}
