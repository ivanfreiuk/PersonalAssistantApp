using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PersonalAssistant.DataAccess.Context;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.DataAccess.Identity;
using PersonalAssistant.Services.Interfaces;
using PersonalAssistant.Services.Models;

namespace PersonalAssistant.Services.Services
{
    public class RoomService : IRoomService
    {
        private readonly ApplicationDbContext _context;

        public RoomService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Room> GetRoomAsync(int id)
        {
            return await _context.Rooms
                .Include(r => r.Owner)
                .Include(r => r.UserRooms)
                .ThenInclude(ur => ur.User)
                .FirstOrDefaultAsync(m => m.Id == id);
        }

        public async Task<IEnumerable<Room>> GetRoomsByUserIdAsync(int userId)
        {
            return await _context.Rooms
                .Include(r => r.Owner)
                .Include(r => r.UserRooms)
                .ThenInclude(ur => ur.User)
                .Where(r => r.UserRooms.Any(ur => ur.UserId == userId))
                .ToListAsync();
        }

        public async Task<IEnumerable<Room>> GetRoomsAsync(RoomFilterCriteria filterCriteria)
        {
            var rooms = await _context.Rooms
                .Include(r => r.UserRooms)
                .ThenInclude(ur => ur.User)
                .Where(r => filterCriteria == null || r.ConversationType == filterCriteria.ConversationType)
                .ToListAsync();

            if (filterCriteria.StartRecord != null && filterCriteria.Limit != null)
            {
                return rooms.Where(r => filterCriteria.SearchKeyword == null || ContainsSearchKeyword(filterCriteria.SearchKeyword, r))
                    .Skip(filterCriteria.StartRecord.Value)
                    .Take(filterCriteria.Limit.Value);
            }

            return rooms.Where(r => filterCriteria.SearchKeyword == null || ContainsSearchKeyword(filterCriteria.SearchKeyword, r));
        }

        public async Task<IEnumerable<UserRoom>> GetRoomMembersAsync(RoomMemberFilterCriteria filterCriteria)
        {
            var roomUsers = _context.UserRooms
                .Include(ur => ur.User)
                .Where(ur => filterCriteria.RoomId == null || ur.RoomId == filterCriteria.RoomId.Value)
                .OrderBy(ur => ur.User.UserName);

            if (filterCriteria.StartRecord != null && filterCriteria.Limit != null)
            {
                return await roomUsers.Skip(filterCriteria.StartRecord.Value)
                    .Take(filterCriteria.Limit.Value)
                    .ToListAsync();
            }

            return await roomUsers.ToListAsync();
        }

        public async Task AddRoomAsync(Room room)
        {
            await _context.Rooms.AddAsync(room);

            await _context.SaveChangesAsync();
        }

        public async Task AddMemberAsync(UserRoom member)
        {
            await _context.UserRooms.AddAsync(member);

            await _context.SaveChangesAsync();
        }

        public async Task AddMembersAsync(IEnumerable<UserRoom> members)
        {
            await _context.UserRooms.AddRangeAsync(members);

            await _context.SaveChangesAsync();
        }

        public async Task RemoveMemberAsync(int roomId, int userId)
        {
            var result = await _context.UserRooms.FirstOrDefaultAsync(ur => ur.RoomId == roomId && ur.UserId == userId);

            if (result is null)
            {
                throw new InvalidOperationException();
            }

            _context.UserRooms.Remove(result);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateRoomAsync(int id, Room room)
        {
            var result = await _context.Rooms.FindAsync(id);

            if (result is null)
            {
                throw new InvalidOperationException();
            }

            _context.Rooms.Update(room);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteRoomAsync(int id)
        {
            var room = await _context.Rooms.FindAsync(id);

            _context.Rooms.Remove(room);

            await _context.SaveChangesAsync();
        }

        private static bool ContainsSearchKeyword(string keyword, Room room)
        {
            keyword = keyword.Trim();
            return room.Name != null && room.Name.Contains(keyword, StringComparison.InvariantCultureIgnoreCase);
        }
    }
}
