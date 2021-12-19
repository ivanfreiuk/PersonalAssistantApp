using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using PersonalAssistant.Api.ViewModels.User;
using PersonalAssistant.DataAccess.Identity;
using PersonalAssistant.Services.Models;

namespace PersonalAssistant.Api.Controllers
{
    [Route("api/users")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public UserController(UserManager<User> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.OrderBy(u => u.UserName).ToListAsync();

            var response = _mapper.Map<IEnumerable<UserResponse>>(users);

            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetUser(int id)
        {
            var user = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (user == null)
            {
                return NotFound();
            }

            var response = _mapper.Map<UserResponse>(user);

            return Ok(response);
        }

        [HttpPost("filter")]
        public async Task<IActionResult> GetUsers([FromBody] UserFilterCriteria filterCriteria)
        {
            var users = await _userManager.Users.OrderBy(u => u.UserName).ToListAsync();
            users = users.Where(u => filterCriteria.SearchKeyword == null || ContainsSearchKeyword(filterCriteria.SearchKeyword, u)).ToList();

            if (filterCriteria.StartRecord != null && filterCriteria.Limit != null)
            {
                users = users.Skip(filterCriteria.StartRecord.Value).Take(filterCriteria.Limit.Value).ToList();
            }

            var response = _mapper.Map<IEnumerable<UserResponse>>(users);

            return Ok(response);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateUser(int id, [FromBody] UserUpdateRequest request)
        {
            var existingUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (existingUser == null)
            {
                return NotFound();
            }

            existingUser.FirstName = request.FirstName;
            existingUser.LastName = request.LastName;
            existingUser.BirthDate = request.BirthDate;
            existingUser.Location = request.Location;
            existingUser.Email = request.Email;
            existingUser.EducationalInstitutionType = request.EducationalInstitutionType;
            existingUser.EducationalInstitutionName = request.EducationalInstitutionName;

            await _userManager.UpdateAsync(existingUser);

            return Ok();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteUser(int id)
        {
            var existingUser = await _userManager.Users.FirstOrDefaultAsync(u => u.Id == id);

            if (existingUser == null)
            {
                return NotFound();
            }

            await _userManager.DeleteAsync(existingUser);

            return Ok();
        }

        private static bool ContainsSearchKeyword(string keyword, User user)
        {
            keyword = keyword.Trim();
            return user.UserName.Contains(keyword, StringComparison.InvariantCultureIgnoreCase) ||
                   $"{user.FirstName} {user.LastName}".Contains(keyword, StringComparison.InvariantCultureIgnoreCase);
        }
    }
}
