using System;

namespace PersonalAssistant.Api.ViewModels.Message
{
    public class MessageCreationRequest
    {
        public int Id { get; set; }
        public int SenderId { get; set; }
        public int? RoomId { get; set; }
        public string Type { get; set; }
        public string Category { get; set; } //CometChat.CATEGORY_MESSAGE,//CometChat.MESSAGE_TYPE.CUSTOM,//CometChat.CATEGORY_ACTION,//CometChat.CATEGORY_CALL,
        public DateTime? SentAt { get; set; }
        public DateTime? EditedAt { get; set; }
        public string EditedBy { get; set; }
        public DateTime? DeletedAt { get; set; }
        public string DeletedBy { get; set; }
        public string Text { get; set; } // TODO separate class
        public int? ParentMessageId { get; set; }
    }
}
