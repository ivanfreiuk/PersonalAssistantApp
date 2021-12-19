using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PersonalAssistant.Api.ViewModels.Message;
using PersonalAssistant.Services.Interfaces;
using PersonalAssistant.Services.Models;

namespace PersonalAssistant.Api.Controllers
{
    [Route("api/messages")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private readonly IMessageService _messageService;
        private readonly IMapper _mapper;

        public MessageController(IMessageService messageService, IMapper mapper)
        {
            _messageService = messageService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetMessages(int roomId)
        {
            var messages = await _messageService.GetMessagesByRoomIdAsync(roomId);

            var response = _mapper.Map<IEnumerable<MessageResponse>>(messages);

            return Ok(response);
        }

        [HttpPost("filter")]
        public async Task<IActionResult> GetMessages([FromBody] MessageFilterCriteria filterCriteria)
        {
            var messages = await _messageService.GetMessagesByFilterCriteriaAsync(filterCriteria);

            var response = _mapper.Map<IEnumerable<MessageResponse>>(messages);

            return Ok(response);
        }
    }
}
