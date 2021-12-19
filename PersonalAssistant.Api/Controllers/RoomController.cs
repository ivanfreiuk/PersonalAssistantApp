using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PersonalAssistant.Api.ViewModels.Room;
using PersonalAssistant.Api.ViewModels.User;
using PersonalAssistant.DataAccess.Enums;
using PersonalAssistant.Services.Interfaces;
using PersonalAssistant.Services.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace PersonalAssistant.Api.Controllers
{
    [Route("api/rooms")]
    [ApiController]
    public class RoomController : ControllerBase
    {
        private readonly IRoomService _roomService;
        private readonly IMapper _mapper;

        public RoomController(IRoomService roomService, IMapper mapper)
        {
            _roomService = roomService;
            _mapper = mapper;
        }

        [HttpPost("filter")]
        public async Task<IActionResult> GetRooms([FromBody] RoomFilterCriteria filterCriteria)
        {
            var rooms = await _roomService.GetRoomsAsync(filterCriteria);

            var response = _mapper.Map<IEnumerable<RoomResponse>>(rooms).Select(room => 
            { 
                if(room.ConversationType == ConversationType.User.ToString())
                {
                    var conversationWithUser = room.Users.FirstOrDefault(user => user.Id != filterCriteria.LoggedInUserId.Value);
                    room.Name = $"{conversationWithUser?.FirstName} {conversationWithUser?.LastName}";
                }
                room.HasJoined = room.Users.Any(u => u.Id == filterCriteria.LoggedInUserId);
                return room;
            });            

            return Ok(response);
        }

        [HttpPost("members")]
        public async Task<IActionResult> GetRoomMembers([FromBody] RoomMemberFilterCriteria filterCriteria)
        {
            var roomMembers = await _roomService.GetRoomMembersAsync(filterCriteria);

            var response = roomMembers.Select(roomMember =>
            {
                var user = _mapper.Map<UserResponse>(roomMember.User);
                user.Scope = roomMember.Scope;
                return user;
            });

            return Ok(response);
        }
    }
}
