using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System.Text.RegularExpressions;
using WebApplication3.Data;
using WebApplication3.Dtos;
using WebApplication3.Dtos.Manager;
using WebApplication3.Dtos.Student;
using WebApplication3.Services;

namespace WebApplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthenticationController : ControllerBase
    {
        private readonly DataContext _context;
        private readonly IAuthenticationService _authentication;

        public AuthenticationController(DataContext dataContext, IAuthenticationService authentication)
        {
            _context = dataContext;
            _authentication = authentication;
        }

        [HttpPost("registerStudent")]
        public async Task<IActionResult> registerStudent([FromForm] Dtos.Student.NewStudentDto student)
        {
            try
            {
                var registerStudent = await _authentication.registerNewStudent(student);

                if (registerStudent == "Email not in valid format" || registerStudent == "Password not valid" || registerStudent != "Registration success!")
                {
                    return BadRequest(registerStudent);
                }

                return Ok("Registration success! We will check and confirm your data. Please wait for email confirmation");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }

        }

        [HttpPost("registerManager")]
        public async Task<IActionResult> registerManager(registerManagerDto manager)
        {
            var isEmailValid = checkEmailValidation(manager.email);
            if (!isEmailValid)
            {
                return BadRequest("Email is not valid");
            }

            var isPasswordValid = checkPasswordValidation(manager.password);
            if(isPasswordValid != "Password Valid")
            {
                return BadRequest(isPasswordValid);
            }

            try
            {
                var registration = await _authentication.registerManager(manager);

                if (registration == null)
                {
                    return BadRequest("Account exist with the email " + manager.email);
                }

                return Ok(registration);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPost("loginStudent")]
        public async Task<IActionResult> loginStudent(string email, string password)
        {
            try
            {
                var student = await _authentication.loginStudent(email, password);

                if (student == "Email not in valid format" || student == "Password should be longer than 5 characters" || student == "Password should contain at least one digit and letter")
                {
                    return BadRequest(student);
                }

                if (student == null)
                {
                    return NotFound("Account not exist!");
                }

                return Ok(student);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        [HttpPost("loginManager")]
        public async Task<IActionResult> loginManager(string email, string password)
        {
            var isEmailValid = checkEmailValidation(email);

            if (!isEmailValid)
            {
                return BadRequest("Email not in valid format");
            }

            var isPasswordValid = checkPasswordValidation(password);

            if (isPasswordValid != "Password Valid")
            {
                return BadRequest(isPasswordValid);
            }
            try
            {
                var manager = await _authentication.loginManager(email, password);

                if (manager == null)
                {
                    return NotFound("Account can not be found!");
                }

                return Ok(manager);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpPut("editAccount"), Authorize(Policy = "AnyRole")]
        public async Task<IActionResult> editAccount(Guid idAccount, EditAccountDto account)
        {
            try
            {
                var userAccount = await _authentication.editAccount(idAccount, account);

                if (userAccount == null)
                {
                    return NotFound("Account not exist!");
                }

                return Ok(userAccount);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpPost("logout"), Authorize(Policy = "AnyRole")]
        public async Task<IActionResult> logout()
        {
            try
            {
                var userEmailClaim = User.FindFirst(ClaimTypes.Email);
                if (userEmailClaim == null)
                {
                    return NotFound("Account can not be found.");
                }

                var editedUser = await _authentication.logout(userEmailClaim.Value);
                if (editedUser == false)
                {
                    return BadRequest();
                }
                return Ok("You've logout!");
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }



        [HttpPost("isAcceptNewStudent"), Authorize(Policy = "Manager")]
        public async Task<IActionResult> isAcceptNewStudent(Guid id, bool accept)
        {
            try
            {
                var student = await _authentication.isAcceptNewStudent(id, accept);

                if (student == null)
                {
                    return NotFound("Can't find new student");
                }

                return Ok(student);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }


        private bool checkEmailValidation(string email)
        {
            string emailRegexPattern = @"^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$";

            if (!Regex.IsMatch(email, emailRegexPattern))
            {
                return false;
            }
            return true;
        }

        private string checkPasswordValidation(string password)
        {
            if (password.Length <= 5)
            {
                return "Password should be longer than 5 characters";
            }

            var letter = Regex.IsMatch(password, @"[a-zA-Z]");
            var digit = Regex.IsMatch(password, @"\d");

            if (!letter || !digit)
            {
                return "Password should contain at least one digit and letter";
            }

            return "Password Valid";
        }

        private string checkAccount(string email)
        {
            var isRegisterAsNewStudent = _context.NewStudents.FirstOrDefault(s => s.email == email);

            var isStudent = _context.Students.FirstOrDefault(s => s.account.email == email);

            if (isRegisterAsNewStudent != null)
            {
                return ("This account has been register. Wait for email confirmation");
            }

            if (isStudent != null)
            {
                return ("This account has been register and accepted. You can login");
            }

            return "This account has not been register";
        }
    }
}
