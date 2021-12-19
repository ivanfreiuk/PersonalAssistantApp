using PersonalAssistant.DataAccess.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace PersonalAssistant.Services.Interfaces
{
    public interface IAssignmentTypeService
    {
        public Task<AssignmentType> GetAssignmentTypeAsync(int id);

        public Task<IEnumerable<AssignmentType>> GetAssignmentTypesAsync();

        public Task AddAssignmentTypeAsync(AssignmentType assignmentType);

        public Task UpdateAssignmentTypeAsync(int id, AssignmentType assignmentType);

        public Task DeleteAssignmentTypeAsync(int id);
    }
}
