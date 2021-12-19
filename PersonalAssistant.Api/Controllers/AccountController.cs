using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using PersonalAssistant.DataAccess.Identity;
using PersonalAssistant.Services.Helpers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using PersonalAssistant.Api.ViewModels.User;

namespace PersonalAssistant.Api.Controllers
{
    [Route("api/account")]
    [ApiController]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly SignInManager<User> _signInManager;
        private readonly ITokenService _tokenService;
        private readonly IMapper _mapper;

        public AccountController(UserManager<User> userManager, SignInManager<User> signInManager, ITokenService tokenService, IMapper mapper)
        {
            _userManager = userManager;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _mapper = mapper;
        }

        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<IActionResult> Login([FromBody] UserLoginRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var loginResult = await _signInManager.PasswordSignInAsync(request.Email, request.Password,
                request.RememberMe, false);

            if (!loginResult.Succeeded)
            {
                return BadRequest();
            }

            var user = await _userManager.FindByNameAsync(request.Email);

            var response = new
            {
                token = _tokenService.GetToken(user),
                user = new UserModel
                {
                    Id = user.Id,
                    RoleName = _userManager.GetRolesAsync(user).Result.Single(),
                    FirstName = user.FirstName,
                    LastName = user.LastName,
                    Email = user.Email
                }
            };
            
            return Ok(response);
        }


        [Authorize]
        [HttpPost("refreshtoken")]
        public async Task<IActionResult> RefreshToken()
        {
            var user = await _userManager.FindByNameAsync(
                User.Identity.Name ??
                User.Claims.Where(c => c.Properties.ContainsKey("unique_name")).Select(c => c.Value).FirstOrDefault()
            );

            return Ok(_tokenService.GetToken(user));
        }

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<IActionResult> Register([FromBody] UserRegisterRequest request)
        {
            if (!ModelState.IsValid) return BadRequest(ModelState);

            var user = _mapper.Map<User>(request);

            var identityResult = await _userManager.CreateAsync(user, request.Password);
            
            if (!identityResult.Succeeded) return BadRequest(identityResult.Errors);
            
            await _userManager.AddToRoleAsync(user, "User");

            await _signInManager.SignInAsync(user, isPersistent: false);

            return Ok(new {Token = _tokenService.GetToken(user) });

        }
    }
}
