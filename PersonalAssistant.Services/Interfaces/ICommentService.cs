using System.Collections.Generic;
using System.Threading.Tasks;
using PersonalAssistant.DataAccess.Entities;

namespace PersonalAssistant.Services.Interfaces
{
    public interface ICommentService
    {
        public Task<Comment> GetCommentAsync(int id);

        public Task<IEnumerable<Comment>> GetCommentsByAssignmentIdAsync(int assignmentId);

        public Task<IEnumerable<Comment>> GetCommentsAsync();
        
        public Task AddCommentAsync(Comment comment);

        public Task UpdateCommentAsync(int id, Comment comment);

        public Task DeleteCommentAsync(int id);
    }
}
