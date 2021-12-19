using System;
using PersonalAssistant.DataAccess.Context;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.Services.Interfaces;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PersonalAssistant.Services.Models;

namespace PersonalAssistant.Services.Services
{
    public class AssignmentService : IAssignmentService
    {
        private readonly ApplicationDbContext _context;

        public AssignmentService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<Assignment> GetAssignmentAsync(int id)
        {
            return await _context.Assignments
                .Include(a => a.Discipline)
                .Include(a => a.AssignmentType)
                .Include(a => a.Creator)
                .Include(a => a.Executor)
                .FirstOrDefaultAsync(a => a.Id == id);
        }

        public async Task<IEnumerable<Assignment>> GetAssignmentsByCreatorIdAsync(int creatorId)
        {
            return await _context.Assignments
                .Where(a => a.CreatorId == creatorId)
                .Include(a => a.Discipline)
                .Include(a => a.AssignmentType)
                .Include(a => a.Creator)
                .Include(a => a.Executor)
                .OrderByDescending(a => a.CreationDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Assignment>> GetAssignmentsAsync(AssignmentFilterCriteria filterCriteria)
        {
            return await _context.Assignments
                .Where(a => !filterCriteria.DisciplineId.HasValue || a.DisciplineId == filterCriteria.DisciplineId)
                .Where(a => !filterCriteria.AssignmentTypeId.HasValue || a.AssignmentTypeId == filterCriteria.AssignmentTypeId)
                .Where(a => !filterCriteria.CreatorId.HasValue || a.CreatorId == filterCriteria.CreatorId)
                .Where(a => !filterCriteria.ExecutorId.HasValue || a.ExecutorId == filterCriteria.ExecutorId)
                .Where(a => string.IsNullOrWhiteSpace(filterCriteria.TopicName) || a.TopicName.Contains(filterCriteria.TopicName))
                .Include(a => a.Discipline)
                .Include(a => a.AssignmentType)
                .Include(a => a.Creator)
                .Include(a => a.Executor)
                .OrderByDescending(a => a.CreationDate)
                .ToListAsync();
        }

        public async Task<IEnumerable<Assignment>> GetAllAssignmentsAsync()
        {
            return await _context.Assignments
                .Include(a => a.Discipline)
                .Include(a => a.AssignmentType)
                .Include(a => a.Creator)
                .Include(a => a.Executor)
                .OrderByDescending(a => a.CreationDate)
                .ToListAsync();
        }

        public async Task AddAssignmentAsync(Assignment assignment)
        {
            await _context.Assignments.AddAsync(assignment);

            await _context.SaveChangesAsync();
        }

        public async Task UpdateAssignmentAsync(int id, Assignment assignment)
        {
            var result = await _context.Assignments.FindAsync(id);

            if (result is null)
            {
                throw new InvalidOperationException();
            }

            _context.Assignments.Update(assignment);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteAssignmentAsync(int id)
        {
            var assignment = await _context.Assignments.FindAsync(id);

            _context.Assignments.Remove(assignment);

            await _context.SaveChangesAsync();
        }
    }
}
