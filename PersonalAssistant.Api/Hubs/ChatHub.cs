using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using PersonalAssistant.Api.ViewModels.Message;
using PersonalAssistant.Api.ViewModels.Room;
using PersonalAssistant.Api.ViewModels.User;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.DataAccess.Enums;
using PersonalAssistant.DataAccess.Identity;
using PersonalAssistant.Services.Interfaces;

namespace PersonalAssistant.Api.Hubs
{
    public class ChatHub : Hub
    {
        public static readonly ConnectionMapping<string> Connections = new ConnectionMapping<string>();
        private readonly IRoomService _roomService;
        private readonly IMessageService _messageService;
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public ChatHub(IRoomService roomService, IMessageService messageService, UserManager<User> userManager, IMapper mapper)
        {
            _roomService = roomService;
            _messageService = messageService;
            _userManager = userManager;
            _mapper = mapper;
        }
        
        public async Task<MessageResponse> SendMessage(MessageCreationRequest request)
        {
            var message = _mapper.Map<Message>(request);
            await _messageService.AddMessageAsync(message);

            var room = await _roomService.GetRoomAsync(message.RoomId.Value);
            var userIds = room.UserRooms.Select(ur => ur.UserId).ToList();
            var connectionIds = userIds.SelectMany(id => Connections.GetConnections(id.ToString())).ToList();

            var response = _mapper.Map<Message, MessageResponse>(message);
            await Clients.Clients(connectionIds).SendAsync("onReceivedMessage", response);

            return response;
        }

        public async Task<MessageResponse> EditMessage(MessageUpdateRequest request)
        {
            var message = await _messageService.GetMessageAsync(request.Id);
            if (message == null || message.SenderId.ToString() != Context.UserIdentifier)
            {
                return null;
            }

            message.Text = request.Text;
            message.EditedAt = DateTime.Now;
            message.EditedBy = request.SenderId;
            await _messageService.UpdateMessageAsync(message.Id, message);

            var room = await _roomService.GetRoomAsync(message.RoomId.Value);
            var userIds = room.UserRooms.Select(ur => ur.UserId).ToList();
            var connectionIds = userIds.SelectMany(id => Connections.GetConnections(id.ToString())).ToList();

            var response = _mapper.Map<Message, MessageResponse>(message);
            await Clients.Clients(connectionIds).SendAsync("onEditedMessage", response);

            return response;
        }

        public async Task<MessageResponse> RemoveMessage(int messageId)
        {
            try
            {
                var message = await _messageService.GetMessageAsync(messageId);
                if (message == null || message.SenderId.ToString() != Context.UserIdentifier)
                {
                    return null;
                }

                await _messageService.DeleteMessageAsync(int.Parse(Context.UserIdentifier), messageId);
                var room = await _roomService.GetRoomAsync(message.RoomId.Value);
                var userIds = room.UserRooms.Select(ur => ur.UserId).ToList();
                var connectionIds = userIds.SelectMany(id => Connections.GetConnections(id.ToString())).ToList();

                var response = _mapper.Map<Message, MessageResponse>(message);
                await Clients.Clients(connectionIds).SendAsync("onRemovedMessage", response);

                return response;
            }
            catch (Exception)
            {
                return null;
            }
        }

        public async Task<RoomResponse> CreateRoom(RoomCreationRequest request)
        {
            var room = _mapper.Map<Room>(request);
            await _roomService.AddRoomAsync(room);

            var roomMember = new UserRoom { UserId = request.OwnerId, RoomId = room.Id, Scope = RoomScope.Admin.ToString() };            
            await _roomService.AddMemberAsync(roomMember);
            
            var connectionIds = Connections.GetConnections(request.OwnerId.ToString()).ToList();

            var response = _mapper.Map<Room, RoomResponse>(room);
            await Clients.Clients(connectionIds).SendAsync("onRoomCreated", response);

            return response;
        }

        public async Task<IEnumerable<UserResponse>> AddRoomMembers(int roomId, int[] userIds)
        {
            var room = await _roomService.GetRoomAsync(roomId);
            if (room == null)
            {
                return null;
            }
            var roomMembers = userIds.Select(id => new UserRoom { UserId = id, RoomId = roomId, Scope = RoomScope.Participant.ToString() });            
            await _roomService.AddMembersAsync(roomMembers);

            var updatedRoom = await _roomService.GetRoomAsync(roomId);
            var newMembers = updatedRoom.UserRooms.Where(ur => userIds.Contains(ur.UserId)).Select(ur => ur.User);

            var connectionIds = userIds.SelectMany(id => Connections.GetConnections(id.ToString())).ToList();
             
            var response = _mapper.Map<IEnumerable<User>, IEnumerable<UserResponse>>(newMembers);
            await Clients.Clients(connectionIds).SendAsync("onRoomMembersAdded", response);

            return response;
        }

        public async Task<RoomResponse> JoinRoom(int roomId, int userId, string password)
        {
            var room = await _roomService.GetRoomAsync(roomId);
            if (room == null || (room.RoomType == RoomType.Protected.ToString() && room.Password != password))
            {
                return null;
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return null;
            }

            var roomMember = new UserRoom { UserId = userId, RoomId = roomId, Scope = RoomScope.Participant.ToString() };
            await _roomService.AddMemberAsync(roomMember);

            var userIds = room.UserRooms.Select(ur => ur.UserId).ToList();
            var connectionIds = userIds.SelectMany(id => Connections.GetConnections(id.ToString())).ToList();

            var response = _mapper.Map<Room, RoomResponse>(room);
            response.HasJoined = true;
            await Clients.Clients(connectionIds).SendAsync("onRoomMemberJoined", user);

            return response;
        }

        public async Task<UserResponse> RemoveRoomMember(int roomId, int userId)
        {
            var room = await _roomService.GetRoomAsync(roomId);
            if (room == null)
            {
                return null;
            }

            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == userId);
            if (user == null)
            {
                return null;
            }
                        
            await _roomService.RemoveMemberAsync(roomId, userId);
            
            var userIds = room.UserRooms.Select(ur => ur.UserId).ToList();
            var connectionIds = userIds.SelectMany(id => Connections.GetConnections(id.ToString())).ToList();

            var response = _mapper.Map<User, UserResponse>(user);
            await Clients.Clients(connectionIds).SendAsync("onRoomMemberRemoved", user);

            return response;
        }

        public async Task UserOnline()
        {
            try
            {
                await Clients.All.SendAsync("onUserOnline", Context.UserIdentifier);
            }
            catch (Exception)
            {
                return;
            }
        }

        public async Task UserOffline()
        {
            try
            {
                await Clients.All.SendAsync("onUserOffline", Context.UserIdentifier);
            }
            catch (Exception)
            {
                return;
            }
        }

        public override Task OnConnectedAsync()
        {
            Connections.Add(Context.UserIdentifier, Context.ConnectionId);
            return base.OnConnectedAsync();
        }

        public override Task OnDisconnectedAsync(Exception exception)
        {
            Connections.Remove(Context.UserIdentifier, Context.ConnectionId);
            return base.OnDisconnectedAsync(exception);
        }
    }
}
