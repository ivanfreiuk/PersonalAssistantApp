using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PersonalAssistant.DataAccess.Context;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.Services.Interfaces;

namespace PersonalAssistant.Services.Services
{
    public class DisciplineService: IDisciplineService
    {
        private readonly ApplicationDbContext _context;

        public DisciplineService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Discipline> GetDisciplineAsync(int id)
        {
            return await _context.Disciplines.FindAsync(id);
        }

        public async Task<IEnumerable<Discipline>> GetDisciplinesAsync()
        {
            return await _context.Disciplines.ToListAsync();
        }

        public async Task AddDisciplineAsync(Discipline discipline)
        {
            await _context.Disciplines.AddAsync(discipline);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateDisciplineAsync(int id, Discipline discipline)
        {
            var result = await _context.Disciplines.FindAsync(id);

            if (result is null)
            {
                throw new InvalidOperationException();
            }

            _context.Disciplines.Update(discipline);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteDisciplineAsync(int id)
        {
            var discipline = await _context.Disciplines.FindAsync(id);

            _context.Disciplines.Remove(discipline);

            await _context.SaveChangesAsync();
        }
    }
}
