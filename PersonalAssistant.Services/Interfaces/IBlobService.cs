using System;
using System.IO;
using System.Threading.Tasks;

namespace PersonalAssistant.Services.Interfaces
{
    public interface IBlobService
    {
        public Task<Uri> UploadFileBlobAsync(string blobContainerName, string fileName, Stream content, string contentType);

        public Task DeleteFileBlobAsync(string fileUrl);
    }
}
