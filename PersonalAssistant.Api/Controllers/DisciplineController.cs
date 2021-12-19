using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Azure.Storage.Blobs.Models;
using Microsoft.AspNetCore.Mvc;
using PersonalAssistant.Api.ViewModels.Discipline;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.Services.Interfaces;

namespace PersonalAssistant.Api.Controllers
{
    [Route("api/disciplines")]
    [ApiController]
    public class DisciplineController : ControllerBase
    {
        private readonly IDisciplineService _disciplineService;
        private readonly IMapper _mapper;

        public DisciplineController(IDisciplineService disciplineService, IMapper mapper)
        {
            _disciplineService = disciplineService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetDisciplines()
        {
            var disciplines = await _disciplineService.GetDisciplinesAsync();

            var response = _mapper.Map<IEnumerable<DisciplineResponse>>(disciplines);

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetDiscipline(int id)
        {
            var discipline = await _disciplineService.GetDisciplineAsync(id);

            if (discipline == null)
            {
                return NotFound();
            }

            var response = _mapper.Map<DisciplineResponse>(discipline);

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateDiscipline([FromBody] DisciplineCreationRequest request)
        {
            var discipline = _mapper.Map<Discipline>(request);

            await _disciplineService.AddDisciplineAsync(discipline);

            return Ok(discipline.Id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDiscipline(int id, [FromBody] DisciplineCreationRequest request)
        {
            var existingDiscipline = await _disciplineService.GetDisciplineAsync(id);

            if (existingDiscipline == null)
            {
                return NotFound();
            }

            existingDiscipline.Name = request.Name;

            await _disciplineService.UpdateDisciplineAsync(id, existingDiscipline);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDiscipline(int id)
        {
            var existingDiscipline = await _disciplineService.GetDisciplineAsync(id);

            if (existingDiscipline == null)
            {
                return NotFound();
            }

            await _disciplineService.DeleteDisciplineAsync(id);

            return Ok();
        }
    }
}
