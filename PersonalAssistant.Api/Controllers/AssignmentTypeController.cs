using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PersonalAssistant.Api.ViewModels.AssignmentType;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.Services.Interfaces;

namespace PersonalAssistant.Api.Controllers
{
    [Route("api/assignment-types")]
    [ApiController]
    public class AssignmentTypeController : ControllerBase
    {
        private readonly IAssignmentTypeService _assignmentTypeService;
        private readonly IMapper _mapper;

        public AssignmentTypeController(IAssignmentTypeService assignmentTypeService, IMapper mapper)
        {
            _assignmentTypeService = assignmentTypeService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssignmentTypes()
        {
            var assignmentTypes = await _assignmentTypeService.GetAssignmentTypesAsync();

            var response = _mapper.Map<IEnumerable<AssignmentTypeResponse>>(assignmentTypes);

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAssignmentType(int id)
        {
            var assignmentType = await _assignmentTypeService.GetAssignmentTypeAsync(id);

            if (assignmentType == null)
            {
                return NotFound();
            }

            var response = _mapper.Map<AssignmentTypeResponse>(assignmentType);

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAssignmentType([FromBody] AssignmentTypeCreationRequest request)
        {
            var assignmentType = _mapper.Map<AssignmentType>(request);

            await _assignmentTypeService.AddAssignmentTypeAsync(assignmentType);

            return Ok(assignmentType.Id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAssignmentType(int id, [FromBody] AssignmentTypeUpdateRequest request)
        {
            var existingAssignmentType = await _assignmentTypeService.GetAssignmentTypeAsync(id);

            if (existingAssignmentType == null)
            {
                return NotFound();
            }

            existingAssignmentType.Name = request.Name;

            await _assignmentTypeService.UpdateAssignmentTypeAsync(id, existingAssignmentType);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssignmentType(int id)
        {
            var existingAssignmentType = await _assignmentTypeService.GetAssignmentTypeAsync(id);

            if (existingAssignmentType == null)
            {
                return NotFound();
            }

            await _assignmentTypeService.DeleteAssignmentTypeAsync(id);

            return Ok();
        }
    }
}
