using PersonalAssistant.DataAccess.Identity;

namespace PersonalAssistant.DataAccess.Entities
{
    public class Conversation
    {
        public string Name { get; set; }
        public string Icon { get; set; }
        public string ConversationType { get; set; }        
        public int? RoomId { get; set; }
        public Room Room { get; set; }
        public int? UserId { get; set; }
        public User User { get; set; }
        public Message LastMessage { get; set; }
    }
}
