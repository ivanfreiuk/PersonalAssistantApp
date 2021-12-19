using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using PersonalAssistant.Services.Interfaces;
using PersonalAssistant.DataAccess.Entities;

namespace PersonalAssistant.Api.Controllers
{
    [Route("api/files")]
    [ApiController]
    public class FileController : ControllerBase
    {
        private const string DefaultBlobContainerName = "personal-assistant-container";
        private readonly IBlobService _blobService;
        private readonly IFileService _fileService;

        public FileController(IBlobService blobService, IFileService fileService)
        {
            _blobService = blobService;
            _fileService = fileService;
        }

        [HttpPost]
        public async Task<IActionResult> UploadFile(IFormFile file)
        {
            if (file.Length <= 0)
            {
                return BadRequest();
            }

            var blobUrl = await _blobService.UploadFileBlobAsync(DefaultBlobContainerName, Guid.NewGuid().ToString(),
                file.OpenReadStream(), file.ContentType);

            var fileToAdd = new File
            {
                FileName = file.FileName,
                FileUrl = blobUrl.AbsoluteUri,
                CreationDate = DateTime.Now
            };


            await _fileService.AddFileAsync(fileToAdd);

            return Ok(fileToAdd);
        }

        [HttpPost("multiple")]
        public async Task<IActionResult> UploadFiles(IFormFileCollection files)
        {
            if (files.Any(file => file.Length <= 0))
            {
                return BadRequest();
            }

            var filesToAdd = new List<File>();
            foreach (var file in files)
            {
                var blobUrl = await _blobService.UploadFileBlobAsync(DefaultBlobContainerName, Guid.NewGuid().ToString(),
                    file.OpenReadStream(), file.ContentType);

                var fileToAdd = new File
                {
                    FileName = file.FileName,
                    FileUrl = blobUrl.AbsoluteUri,
                    CreationDate = DateTime.Now
                };

                filesToAdd.Add(fileToAdd);
            }

            await _fileService.AddFilesAsync(filesToAdd);

            return Ok(filesToAdd);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteFile(int id)
        {
            var file = await _fileService.GetFileAsync(id);

            if (file==null)
            {
                return NotFound();
            }

            await _blobService.DeleteFileBlobAsync(file.FileUrl);

            await _fileService.DeleteFileAsync(id);

            return Ok();
        }
    }
}
