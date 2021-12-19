using System.Collections.Generic;
using System.Threading.Tasks;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.Services.Models;

namespace PersonalAssistant.Services.Interfaces
{
    public interface IRoomService
    {
        public Task<Room> GetRoomAsync(int id);
        
        public Task<IEnumerable<Room>> GetRoomsByUserIdAsync(int userId);

        public Task<IEnumerable<Room>> GetRoomsAsync(RoomFilterCriteria filterCriteria);

        public Task<IEnumerable<UserRoom>> GetRoomMembersAsync(RoomMemberFilterCriteria filterCriteria);

        public Task AddRoomAsync(Room room);

        public Task AddMemberAsync(UserRoom member);

        public Task AddMembersAsync(IEnumerable<UserRoom> members);

        public Task RemoveMemberAsync(int roomId, int userId);

        public Task UpdateRoomAsync(int id, Room room);

        public Task DeleteRoomAsync(int id);
    }
}
