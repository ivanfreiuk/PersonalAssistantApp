using System.Collections.Generic;
using System.Threading.Tasks;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.Services.Models;

namespace PersonalAssistant.Services.Interfaces
{
    public interface IMessageService
    {
        public Task<Message> GetMessageAsync(int id);
        
        public Task<IEnumerable<Message>> GetMessagesByRoomIdAsync(int roomId);

        public Task<IEnumerable<Message>> GetMessagesByFilterCriteriaAsync(MessageFilterCriteria filterCriteria);

        public Task AddMessageAsync(Message message);

        public Task UpdateMessageAsync(int id, Message message);

        public Task DeleteMessageAsync(int userId, int messageId);
    }
}
