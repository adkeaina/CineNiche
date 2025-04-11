using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using CineNiche.API.Data;

namespace CineNiche.API.Controllers
{

    [ApiController]
    [Route("api/[controller]")]
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly UserManager<ApplicationUser> _userManager;

        public RolesController(RoleManager<IdentityRole> roleManager, UserManager<ApplicationUser> userManager)
        {
            _roleManager = roleManager;
            _userManager = userManager;
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("add")]
        public async Task<IActionResult> AddRole(string role)
        {
            if (string.IsNullOrWhiteSpace(role))
                return BadRequest("Role name cannot be empty.");

            var exists = await _roleManager.RoleExistsAsync(role);
            if (exists) return Ok("Role already exists.");

            var result = await _roleManager.CreateAsync(new IdentityRole(role));
            return result.Succeeded ? Ok("Role created.") : BadRequest(result.Errors);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost("assign")]
        public async Task<IActionResult> AssignRole(string email, string role)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return NotFound("User not found.");

            var roleExists = await _roleManager.RoleExistsAsync(role);
            if (!roleExists) return NotFound("Role not found.");

            var result = await _userManager.AddToRoleAsync(user, role);
            return result.Succeeded ? Ok("Role assigned.") : BadRequest(result.Errors);
        }

        [HttpGet("pingauth")]
        public IActionResult PingAuth()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
            {
                return Ok(new
                {
                    isAuthenticated = false,
                    roles = Array.Empty<string>()
                });
            }

            var roles = User.Claims
                .Where(c => c.Type == ClaimTypes.Role)
                .Select(c => c.Value)
                .ToArray();

            return Ok(new
            {
                isAuthenticated = true,
                roles
            });
        }

        [Authorize]
        [HttpGet("userinfo")]
        public IActionResult GetUserInfo()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var email = User.Claims.FirstOrDefault(c =>
                c.Type == ClaimTypes.Email || c.Type == "email")?.Value;

            var roles = User.Claims
                .Where(c => c.Type == ClaimTypes.Role)
                .Select(c => c.Value)
                .ToArray();

            var firstName = User.Claims.FirstOrDefault(c => c.Type == "FirstName")?.Value;
            var lastName = User.Claims.FirstOrDefault(c => c.Type == "LastName")?.Value;

            return Ok(new
            {
                firstName,
                lastName,
                email,
                roles,
            });
        }
        
        [Authorize]
        [HttpGet("userid")]
        public IActionResult GetUserId()
        {
            if (!User.Identity?.IsAuthenticated ?? true)
            {
                return Unauthorized(new { message = "User is not authenticated." });
            }

            var userId = User.Claims.FirstOrDefault(c => c.Type == "UserId")?.Value;

            return Ok(new
            {
                userId
            });
        }
    }

}