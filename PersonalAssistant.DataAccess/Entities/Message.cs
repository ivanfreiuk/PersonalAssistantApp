using System;
using PersonalAssistant.DataAccess.Identity;

namespace PersonalAssistant.DataAccess.Entities
{
    public class Message
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public User Sender { get; set; }
        public int? RoomId { get; set; }
        public Room Room { get; set; }
        public string Type { get; set; }
        public string Category { get; set; } //CometChat.CATEGORY_MESSAGE,//CometChat.MESSAGE_TYPE.CUSTOM,//CometChat.CATEGORY_ACTION,//CometChat.CATEGORY_CALL,
        public DateTime? SentAt { get; set; }
        public DateTime? EditedAt { get; set; }
        public int EditedBy { get; set; }
        public DateTime? DeletedAt { get; set; }
        public int DeletedBy { get; set; }
        public string Text { get; set; } // TODO separate class
        public int? ParentMessageId { get; set; }
    }
}
