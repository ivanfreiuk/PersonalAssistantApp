using System.Collections.Generic;
using System.Threading.Tasks;
using PersonalAssistant.DataAccess.Entities;

namespace PersonalAssistant.Services.Interfaces
{
    public interface IDisciplineService
    {
        public Task<Discipline> GetDisciplineAsync(int id);

        public Task<IEnumerable<Discipline>> GetDisciplinesAsync();

        public Task AddDisciplineAsync(Discipline discipline);

        public Task UpdateDisciplineAsync(int id, Discipline discipline);

        public Task DeleteDisciplineAsync(int id);
    }
}
