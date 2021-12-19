using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PersonalAssistant.DataAccess.Context;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.DataAccess.Enums;
using PersonalAssistant.Services.Interfaces;
using PersonalAssistant.Services.Models;

namespace PersonalAssistant.Services.Services
{
    public class ConversationService : IConversationService
    {
        private readonly ApplicationDbContext _context;

        public ConversationService(ApplicationDbContext context)
        {
            _context = context;
        }
        
        public async Task<IEnumerable<Conversation>> GetConversationsByFilterCriteriaAsync(ConversationFilterCriteria filterCriteria)
        {
            List<Room> rooms = null;
            var query = _context.Rooms
                .Include(r => r.Messages)
                .Include(r => r.UserRooms)
                .ThenInclude(r => r.User)
                .Where(r => r.Messages.Any())
                .Where(room => filterCriteria.LoggedInUserId == null ||
                               room.UserRooms != null &&
                               room.UserRooms.Any(uc => uc.UserId == filterCriteria.LoggedInUserId.Value));
                //.Select(room => CreateConversation(room, filterCriteria))
                //.OrderByDescending(c => c.LastMessage.SentAt);

            if (filterCriteria.StartRecord != null && filterCriteria.Limit != null)
            {

                rooms = await query.Skip(filterCriteria.StartRecord.Value)
                    .Take(filterCriteria.Limit.Value)
                    .ToListAsync();
            }

            return rooms.Select(room => TMPCreateConversation(room, filterCriteria))
                .OrderByDescending(c => c.LastMessage?.SentAt);
        }

        private Conversation CreateConversation(Room room, ConversationFilterCriteria filterCriteria)
        {
            var conversationWithUser = room.ConversationType == ConversationType.User.ToString() ?
                room.UserRooms.FirstOrDefault(ur => ur.UserId != filterCriteria.LoggedInUserId.Value).User :
                null;
            return new Conversation
            {
                Name = conversationWithUser == null ? room.Name : $"{conversationWithUser.FirstName} {conversationWithUser.LastName}",
                Icon = conversationWithUser == null ? room.Icon : conversationWithUser.Icon,
                ConversationType = room.ConversationType,
                RoomId = room.Id,
                Room = room,
                LastMessage = room.Messages.OrderBy(m => m.SentAt).LastOrDefault()
            };
        }

        private Conversation TMPCreateConversation(Room room, ConversationFilterCriteria filterCriteria)
        {
            var otherUser = room.ConversationType == ConversationType.User.ToString() ?
                room.UserRooms.FirstOrDefault(ur => ur.UserId != filterCriteria.LoggedInUserId.Value).User :
                null;
            return new Conversation
            {
                Name = otherUser == null ? room.Name : $"{otherUser.FirstName} {otherUser.LastName}",
                Icon = otherUser == null ? room.Icon : otherUser.Icon,
                ConversationType = room.ConversationType,
                RoomId = room.Id,
                Room = room,
                UserId = otherUser?.Id,
                User = otherUser,
                LastMessage = room.Messages.OrderBy(m => m.SentAt).LastOrDefault()
            };
        }
    }
}
