using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using PersonalAssistant.DataAccess.Context;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.Services.Interfaces;

namespace PersonalAssistant.Services.Services
{
    public class FileService: IFileService
    {
        private readonly ApplicationDbContext _context;

        public FileService(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<File> GetFileAsync(int id)
        {
            return await _context.Files.FindAsync(id);
        }

        public async Task<IEnumerable<File>> GetAllFilesAsync()
        {
            return await _context.Files.ToListAsync();
        }

        public async Task AddFileAsync(File file)
        {
            await _context.Files.AddAsync(file);

            await _context.SaveChangesAsync();
        }

        public async Task AddFilesAsync(IEnumerable<File> files)
        {
            await _context.Files.AddRangeAsync(files);

            await _context.SaveChangesAsync();
        }

        public async Task DeleteFileAsync(int id)
        {
            var file = await _context.Files.FindAsync(id);

            _context.Files.Remove(file);

            await _context.SaveChangesAsync();
        }
    }
}
