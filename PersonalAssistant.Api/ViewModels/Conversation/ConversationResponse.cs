using PersonalAssistant.Api.ViewModels.Room;
using PersonalAssistant.Api.ViewModels.Message;
using PersonalAssistant.Api.ViewModels.User;

namespace PersonalAssistant.Api.ViewModels.Conversation
{
    public class ConversationResponse
    {
        public string Name { get; set; }
        public string Icon { get; set; }
        public string ConversationType { get; set; }
        public int? UserId { get; set; }
        public UserResponse User { get; set; }
        public int? RoomId { get; set; }
        public RoomResponse Room { get; set; }
        public MessageResponse LastMessage { get; set; }
    }
}
