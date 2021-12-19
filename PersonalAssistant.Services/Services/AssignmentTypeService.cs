using System;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.Services.Interfaces;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PersonalAssistant.DataAccess.Context;

namespace PersonalAssistant.Services.Services
{
    public class AssignmentTypeService : IAssignmentTypeService
    {
        private readonly ApplicationDbContext _context;

        public AssignmentTypeService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<AssignmentType> GetAssignmentTypeAsync(int id)
        {
            return await _context.AssignmentTypes.FindAsync(id);
        }

        public async Task<IEnumerable<AssignmentType>> GetAssignmentTypesAsync()
        {
            return await _context.AssignmentTypes.ToListAsync();
        }

        public async Task AddAssignmentTypeAsync(AssignmentType assignmentType)
        {
            await _context.AssignmentTypes.AddAsync(assignmentType);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateAssignmentTypeAsync(int id, AssignmentType assignmentType)
        {
            var result = await _context.AssignmentTypes.FindAsync(id);

            if (result is null)
            {
                throw new InvalidOperationException();
            }

            _context.AssignmentTypes.Update(assignmentType);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAssignmentTypeAsync(int id)
        {
            var assignmentType = await _context.AssignmentTypes.FindAsync(id);

            _context.AssignmentTypes.Remove(assignmentType);

            await _context.SaveChangesAsync();
        }
    }
}
