using System;
using System.Threading.Tasks;

namespace PersonalAssistant.DataAccess.Interfaces
{
    public interface IUnitOfWork: IDisposable
    {
        public IAssignmentRepository Assignments { get; }

        public IAssignmentTypeRepository AssignmentTypes { get; }

        public Task<int> SaveChangesAsync();
    }
}
