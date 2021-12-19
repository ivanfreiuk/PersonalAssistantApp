using PersonalAssistant.DataAccess.Context;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.DataAccess.Interfaces;

namespace PersonalAssistant.DataAccess.Repositories
{
    public class AssignmentRepository : BaseRepository<Assignment>, IAssignmentRepository
    {
        public AssignmentRepository(ApplicationDbContext context) : base(context)
        {

        }
    }
}
