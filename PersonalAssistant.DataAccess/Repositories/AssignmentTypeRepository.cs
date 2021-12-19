using PersonalAssistant.DataAccess.Context;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.DataAccess.Interfaces;

namespace PersonalAssistant.DataAccess.Repositories
{
    public class AssignmentTypeRepository : BaseRepository<AssignmentType>, IAssignmentTypeRepository
    {
        public AssignmentTypeRepository(ApplicationDbContext context) : base(context)
        {

        }
    }
}
