using System.Collections.Generic;
using System.Threading.Tasks;
using PersonalAssistant.DataAccess.Entities;

namespace PersonalAssistant.Services.Interfaces
{
    public interface IFileService
    {
        public Task<File> GetFileAsync(int id);

        public Task<IEnumerable<File>> GetAllFilesAsync();
        
        public Task AddFileAsync(File file);

        public Task AddFilesAsync(IEnumerable<File> files);
        
        public Task DeleteFileAsync(int id);
    }
}
