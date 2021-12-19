using System.Collections.Generic;
using System.Threading.Tasks;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.Services.Models;

namespace PersonalAssistant.Services.Interfaces
{
    public interface IConversationService
    {
        public Task<IEnumerable<Conversation>> GetConversationsByFilterCriteriaAsync(ConversationFilterCriteria filterCriteria);
    }
}
