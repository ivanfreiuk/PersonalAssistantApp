using System;
using System.Collections.Generic;
using PersonalAssistant.DataAccess.Identity;

namespace PersonalAssistant.DataAccess.Entities
{
    public class Room
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public string ConversationType { get; set; }
        public string RoomType { get; set; }
        public string Password { get; set; }
        public int? OwnerId { get; set; }
        public User Owner { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public IEnumerable<UserRoom> UserRooms { get; set; }
        public IEnumerable<Message> Messages { get; set; }
    }
}
