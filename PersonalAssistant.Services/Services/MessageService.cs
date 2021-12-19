using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PersonalAssistant.DataAccess.Context;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.Services.Interfaces;
using PersonalAssistant.Services.Models;

namespace PersonalAssistant.Services.Services
{
    public class MessageService : IMessageService
    {
        private readonly ApplicationDbContext _context;

        public MessageService(ApplicationDbContext context)
        {
            _context = context;
        } 

        public async Task<Message> GetMessageAsync(int id)
        {
            return await _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Room)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<IEnumerable<Message>> GetMessagesByRoomIdAsync(int roomId)
        {
            return await _context.Messages                
                .Include(m => m.Sender)
                .Include(m => m.Room)
                .Where(m => m.RoomId == roomId)
                .OrderBy(m => m.SentAt)
                .ToListAsync();
        }
        

        public async Task<IEnumerable<Message>> GetMessagesByFilterCriteriaAsync(MessageFilterCriteria filterCriteria)
        {
            var messages = _context.Messages
                .Include(m => m.Sender)
                .Include(m => m.Room)            
                .Where(m => m.RoomId == filterCriteria.RoomId)
                .OrderBy(m => m.SentAt);

            if (filterCriteria.StartRecord != null && filterCriteria.Limit != null)
            {

                return await messages.Skip(filterCriteria.StartRecord.Value)
                    .Take(filterCriteria.Limit.Value)
                    .ToListAsync();
            }

            return await messages.ToListAsync();
        }

        public async Task AddMessageAsync(Message message)
        {
            await _context.Messages.AddAsync(message);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateMessageAsync(int id, Message message)
        {
            var result = await _context.Messages.FindAsync(id);

            if (result is null)
            {
                throw new InvalidOperationException();
            }

            _context.Messages.Update(message);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteMessageAsync(int userId, int messageId)
        {
            var message = await _context.Messages.FindAsync(messageId);

            if (message is null)
            {
                throw new InvalidOperationException();
            }

            message.DeletedAt = DateTime.Now;
            message.DeletedBy = userId;
            _context.Messages.Update(message);

            await _context.SaveChangesAsync();
        }

        private async Task<Room> GetRoomAsync(MessageFilterCriteria filterCriteria)
        {
            if (filterCriteria.LoggedInUserId != null && filterCriteria.RoomId != null)
            {
                return await _context.Rooms
                    .Include(r => r.UserRooms)
                    .Where(r => r.Id == filterCriteria.RoomId)
                    .FirstOrDefaultAsync(r => r.UserRooms.Any(ur => ur.UserId == filterCriteria.LoggedInUserId));
            }

            return null;
        }
    }
}
