using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;
using PersonalAssistant.Api.ViewModels.Assignment;
using PersonalAssistant.Services.Models;

namespace PersonalAssistant.Api.Controllers
{
    [Route("api/assignments")]
    [ApiController]
    public class AssignmentController : ControllerBase
    {
        private readonly IAssignmentService _assignmentService;
        private readonly IMapper _mapper;

        public AssignmentController(IAssignmentService assignmentService, IMapper mapper)
        {
            _assignmentService = assignmentService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetAssignments()
        {
            var assignments = await _assignmentService.GetAllAssignmentsAsync();

            var response = _mapper.Map<IEnumerable<AssignmentResponse>>(assignments);
            
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetAssignment(int id)
        {
            var assignment = await _assignmentService.GetAssignmentAsync(id);

            if (assignment == null)
            {
                return NotFound();
            }

            var response = _mapper.Map<AssignmentResponse>(assignment);
            return Ok(response);
        }

        [HttpPost("filter")]
        public async Task<IActionResult> GetAssignments(AssignmentFilterCriteria filterCriteria)
        {
            var assignments = await _assignmentService.GetAssignmentsAsync(filterCriteria);
            
            var response = _mapper.Map<IEnumerable<AssignmentResponse>>(assignments);
            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateAssignment([FromBody] AssignmentCreationRequest request)
        {
            var assignment = _mapper.Map<Assignment>(request);

            await _assignmentService.AddAssignmentAsync(assignment);

            return Ok(assignment.Id);
        }
        
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateAssignment(int id, [FromBody]AssignmentUpdateRequest request)
        {
            var existingAssignment = await _assignmentService.GetAssignmentAsync(id);

            if (existingAssignment == null)
            {
                return NotFound();
            }

            existingAssignment.TopicName = request.TopicName;
            existingAssignment.AssignmentTypeId = request.AssignmentTypeId;
            existingAssignment.DisciplineId = request.DisciplineId;
            existingAssignment.ExecutorId = request.ExecutorId;
            existingAssignment.CreatorId = request.CreatorId;
            existingAssignment.Details = request.Details;
            existingAssignment.PreferredDeadline = request.PreferredDeadline;

            await _assignmentService.UpdateAssignmentAsync(id, existingAssignment);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteAssignment(int id)
        {
            var existingAssignment = await _assignmentService.GetAssignmentAsync(id);

            if (existingAssignment == null)
            {
                return NotFound();
            }

            await _assignmentService.DeleteAssignmentAsync(id);

            return Ok();
        }
    }
}
