using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PersonalAssistant.DataAccess.Context;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.Services.Interfaces;

namespace PersonalAssistant.Services.Services
{
    public class CommentService: ICommentService
    {
        private readonly ApplicationDbContext _context;

        public CommentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Comment> GetCommentAsync(int id)
        {
            return await _context.Comments
                .Include(c => c.User)
                .FirstOrDefaultAsync(c=>c.Id == id);
        }

        public async Task<IEnumerable<Comment>> GetCommentsByAssignmentIdAsync(int assignmentId)
        {
            return await _context.Comments
                .Include(c=>c.User)
                .Where(c => c.AssignmentId == assignmentId).ToListAsync();
        }

        public async Task<IEnumerable<Comment>> GetCommentsAsync()
        {
            return await _context.Comments
                .Include(c => c.User)
                .ToListAsync();
        }

        public async Task AddCommentAsync(Comment comment)
        {
            await _context.Comments.AddAsync(comment);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateCommentAsync(int id, Comment comment)
        {
            var result = await _context.Comments.FindAsync(id);

            if (result is null)
            {
                throw new InvalidOperationException();
            }

            _context.Comments.Update(comment);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteCommentAsync(int id)
        {
            var comment = await _context.Comments.FindAsync(id);

            _context.Comments.Remove(comment);

            await _context.SaveChangesAsync();
        }
    }
}
