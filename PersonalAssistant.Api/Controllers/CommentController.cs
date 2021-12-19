using System.Collections.Generic;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Mvc;
using PersonalAssistant.Api.ViewModels.Comment;
using PersonalAssistant.DataAccess.Entities;
using PersonalAssistant.Services.Interfaces;

namespace PersonalAssistant.Api.Controllers
{
    [Route("api/comments")]
    [ApiController]
    public class CommentController : ControllerBase
    {
        private readonly ICommentService _commentService;
        private readonly IMapper _mapper;

        public CommentController(ICommentService commentService, IMapper mapper)
        {
            _commentService = commentService;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetComments()
        {
            var comments = await _commentService.GetCommentsAsync();

            var response = _mapper.Map<IEnumerable<CommentResponse>>(comments);

            return Ok(response);
        }

        [HttpGet("assignment/{assignmentId}")]
        public async Task<IActionResult> GetCommentsByAssignmentId(int assignmentId)
        {
            var comments = await _commentService.GetCommentsByAssignmentIdAsync(assignmentId);

            var response = _mapper.Map<IEnumerable<CommentResponse>>(comments);

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetComment(int id)
        {
            var comment = await _commentService.GetCommentAsync(id);

            if (comment == null)
            {
                return NotFound();
            }

            var response = _mapper.Map<CommentResponse>(comment);

            return Ok(response);
        }

        [HttpPost]
        public async Task<IActionResult> CreateComment([FromBody] CommentCreationRequest request)
        {
            var comment = _mapper.Map<Comment>(request);

            await _commentService.AddCommentAsync(comment);

            return Ok(comment.Id);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateComment(int id, [FromBody] CommentUpdateRequest request)
        {
            var existingComment = await _commentService.GetCommentAsync(id);

            if (existingComment == null)
            {
                return NotFound();
            }

            existingComment.Headline = request.Headline;
            existingComment.Content = request.Content;

            await _commentService.UpdateCommentAsync(id, existingComment);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteComment(int id)
        {
            var existingComment = await _commentService.GetCommentAsync(id);

            if (existingComment == null)
            {
                return NotFound();
            }

            await _commentService.DeleteCommentAsync(id);

            return Ok();
        }
    }
}
