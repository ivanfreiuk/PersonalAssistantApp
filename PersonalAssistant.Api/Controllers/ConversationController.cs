using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PersonalAssistant.Api.ViewModels.Conversation;
using PersonalAssistant.DataAccess.Enums;
using PersonalAssistant.Services.Interfaces;
using PersonalAssistant.Services.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PersonalAssistant.Api.Controllers
{
    [Route("api/conversations")]
    [ApiController]
    public class ConversationController : ControllerBase
    {
        private readonly IMessageService _messageService;
        private readonly IConversationService _conversationService;
        private readonly IMapper _mapper;

        public ConversationController(IMessageService messageService, IConversationService conversationService, IMapper mapper)
        {
            _messageService = messageService;
            _conversationService = conversationService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult> GetConversations([FromBody] ConversationFilterCriteria filterCriteria)
        {
            var conversations = await _conversationService.GetConversationsByFilterCriteriaAsync(filterCriteria);

            var response = _mapper.Map<IEnumerable<ConversationResponse>>(conversations).Select(conversation =>
            {
                if (conversation.ConversationType == ConversationType.User.ToString())
                {
                    var conversationWithUser = conversation.Room.Users.FirstOrDefault(user => user.Id != filterCriteria.LoggedInUserId.Value);
                    conversation.Room.Name = $"{conversationWithUser?.FirstName} {conversationWithUser?.LastName}";
                }

                return conversation;
            });

            return Ok(response);
        }
    }
}
