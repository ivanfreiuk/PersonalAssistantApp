using PersonalAssistant.DataAccess.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;
using PersonalAssistant.Services.Models;

namespace PersonalAssistant.Services.Interfaces
{
    public interface IAssignmentService
    {
        public Task<Assignment> GetAssignmentAsync(int id);

        public Task<IEnumerable<Assignment>> GetAllAssignmentsAsync();

        public Task<IEnumerable<Assignment>> GetAssignmentsByCreatorIdAsync(int userId);

        public Task<IEnumerable<Assignment>> GetAssignmentsAsync(AssignmentFilterCriteria filterCriteria);

        public Task AddAssignmentAsync(Assignment assignment);

        public Task UpdateAssignmentAsync(int id, Assignment assignment);

        public Task DeleteAssignmentAsync(int id);
    }
}
