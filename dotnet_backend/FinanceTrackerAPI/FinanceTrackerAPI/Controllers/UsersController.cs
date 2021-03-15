using Microsoft.AspNetCore.Mvc;
using FinanceTrackerAPI.Models;
using FinanceTrackerAPI.Repository.IRepository;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.IdentityModel.Tokens.Jwt;
using System;
using System.Security.Claims;
using Microsoft.Extensions.Configuration;
using Microsoft.AspNetCore.Authorization;

namespace FinanceTrackerAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class UsersController : ControllerBase
    {
        private IConfiguration _config;
        private IUserRepository _userRepo;

        public UsersController(IConfiguration configuration, IUserRepository userRepo)
        {
            _config = configuration;
            _userRepo = userRepo;
        }

        // POST: /api/v1/users
        [HttpPost]
        public IActionResult CreateMacroUser(User user)
        {
            try
            {
                if (user == null)
                {
                    return BadRequest(new { msg = "No user provided" });
                }

                var userEntity = _userRepo.CreateMacroUser(user);
                if (userEntity.MacroUserId == 0)
                {
                    return BadRequest(new { msg = "User already exists" });
                }
                
                else
                {
                    var tokenStr = GenerateJSONWebToken(userEntity);
                    return Ok(new { token = tokenStr });
                }
            }
            catch
            {
                return BadRequest(new { msg = "We're experiencing issues right now... Please try again later." });
            }
        }

        // POST: /api/v1/users/login
        [HttpPost]
        [Route("login")]
        public IActionResult Login([FromBody] User user)
        {
            var userEntity = _userRepo.Authenticate(user.Email, user.Password);

            if (userEntity == null)
            {
                return Unauthorized(new { msg = "Invalid credentials" });
            }

            else
            {
                var tokenStr = GenerateJSONWebToken(userEntity);
                return Ok(new { token = tokenStr });
            }
        }

        // GET: /api/v1/users/auth
        [Authorize]
        [HttpGet]
        [Route("auth")]
        public IActionResult Auth([FromHeader(Name = "Authorization")] string header)
        {
            var user = _userRepo.LoadUser(header);

            return Ok(new { macroUserId = user.MacroUserId, microUserId = user.MicroUserId, fullName = user.FullName, email = user.Email });

        }

        private string GenerateJSONWebToken(User user)
        {
            var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_config.GetValue<string>("Jwt:Key")));
            var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.MacroUserId.ToString()),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var token = new JwtSecurityToken(
                issuer: _config.GetValue<string>("Jwt:Issuer"),
                audience: _config.GetValue<string>("Jwt:Audience"),
                claims,
                expires: DateTime.Now.AddHours(1),
                signingCredentials: credentials
                );

            var encodetoken = new JwtSecurityTokenHandler().WriteToken(token);

            return encodetoken;
        }
    }
}
