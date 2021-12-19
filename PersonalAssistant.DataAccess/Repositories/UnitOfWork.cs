using System.Threading.Tasks;
using PersonalAssistant.DataAccess.Context;
using PersonalAssistant.DataAccess.Interfaces;

namespace PersonalAssistant.DataAccess.Repositories
{
    public class UnitOfWork: IUnitOfWork
    {
        private readonly ApplicationDbContext _context;

        public UnitOfWork(ApplicationDbContext context)
        {
            _context = context;
            Assignments = new AssignmentRepository(_context);
            AssignmentTypes = new AssignmentTypeRepository(_context);
        }

        public IAssignmentRepository Assignments { get; }
        public IAssignmentTypeRepository AssignmentTypes { get; }

        public Task<int> SaveChangesAsync()
        {
            return _context.SaveChangesAsync();
        }

        public void Dispose()
        {
            _context.Dispose();
        }
    }
}
