using System;
using System.Collections.Generic;
using PersonalAssistant.Api.ViewModels.User;

namespace PersonalAssistant.Api.ViewModels.Room
{
    public class RoomResponse
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Icon { get; set; }
        public string ConversationType { get; set; }
        public string RoomType { get; set; }
        public string Password { get; set; }
        public bool? HasJoined { get; set; }
        public int? OwnerId { get; set; }
        public UserResponse Owner { get; set; }
        public int MembersCount { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }
        public IEnumerable<UserResponse> Users { get; set; }
    }
}
