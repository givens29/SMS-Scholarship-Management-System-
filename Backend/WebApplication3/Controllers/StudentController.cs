using Azure;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Text.RegularExpressions;
using WebApplication3.Data;
using WebApplication3.Dtos;
using WebApplication3.Dtos.Student;
using WebApplication3.Models;
using WebApplication3.Services;

namespace WebApplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class StudentController : ControllerBase
    {
        private IStudentService _studentService;
        private readonly DataContext _context;

        public StudentController(DataContext context, IStudentService studentService)
        {
            _context = context;
            _studentService = studentService;
        }

        [HttpPost("addAcademic"), Authorize(Policy = "Student")]
        public async Task<IActionResult> addAcademic(Guid id, AcademicDto academic)
        {
            try
            {
                var accademic = await _studentService.addAcademic(id, academic);

                if (accademic == null)
                {
                    return NotFound("Account can not be found");
                }

                return Ok(accademic);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost("addExpense"), Authorize(Policy = "Student")]
        public async Task<IActionResult> addExpense(Guid id, ExpenseDto expense)
        {
            try
            {
                var expenses = await _studentService.addExpense(id, expense);

                if (expenses == null)
                {
                    return NotFound("Account can not be found");
                }

                return Ok(expenses);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("getAcademic"),Authorize(Policy = "AnyRole")]
        public async Task<IActionResult> getAcademic(Guid academicID)
        {
            try
            {
                var academic = await _studentService.getAcademic(academicID);

                if (academic == null)
                {
                    return NotFound("Academic can not be found.");
                }

                return Ok(academic);
            }
            catch (Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
        }

        [HttpGet("getlistofAcademic"), Authorize(Policy = "AnyRole")]
        public async Task<IActionResult> getlistofAcademic(Guid studentId)
        {
            try
            {
                var listofAcademic = await _studentService.getlistAcademic(studentId);

                if (listofAcademic == null)
                {
                    return NotFound("Account can not be found!!!");
                }

                return Ok(listofAcademic);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("getExpense"), Authorize(Policy = "AnyRole")]
        public async Task<IActionResult> getExpense(Guid expenseID)
        {
            try
            {
                var expense = await _studentService.getExpense(expenseID);

                if (expense == null)
                {
                    return NotFound("Expense can not be found.");
                }

                return Ok(expense);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("getlistofExpense"), Authorize(Policy = "AnyRole")]
        public async Task<IActionResult> getlistofExpense(Guid studentId)
        {
            try
            {
                var listofExpense = await _studentService.getlistExpense(studentId);
                if (listofExpense == null)
                {
                    return BadRequest();
                }
                return Ok(listofExpense);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("getlistofManagers")]
        public async Task<IActionResult> getlistofManager()
        {
            var managers = await _studentService.getlistManager();

            return Ok(managers);
        }
        [HttpGet("getManager"),Authorize(Policy = "AnyRole")]
        public async Task<IActionResult> getManager(Guid managerId)
        {
            var manager = await _studentService.getManager(managerId);

            if (manager == null)
            {
                return NotFound("Account can not be found!!!");
            }
            return Ok(manager);
        }
        [HttpPut("editProfile"),Authorize(Policy = "Student")]
        public async Task<IActionResult> editProfile(Guid studentId, EditprofileDto student)
        {           
            try
            {
                var editProfile = await _studentService.editProfile(studentId,student);

                if (editProfile == null)
                {
                    return NotFound("Account not exist!");
                }

                return Ok(editProfile);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        
        [HttpPut("editParent"), Authorize(Policy = "Student")]
        public async Task<IActionResult> editParent(Guid idParent, ParentDto parent)
        {
            try
            {
                var studentParent = await _studentService.editParent(idParent, parent);

                if (studentParent == null)
                {
                    return NotFound("Parent not exist!");
                }

                return Ok(studentParent);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("editBank"), Authorize(Policy = "Student")]
        public async Task<IActionResult> editBank(Guid idBank, BankDto bank)
        {
            try
            {
                var s = await _studentService.editBank(idBank, bank);

                if (s == null)
                {
                    return NotFound("Bank not exist!");
                }

                return Ok(s);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpPut("editUniversity"), Authorize(Policy = "Student")]
        public async Task<IActionResult> editUniversity(Guid idUni, UniversityDto uni)
        {
            try
            {
                var s = await _studentService.editUniversity(idUni, uni);

                if (s == null)
                {
                    return NotFound("University not exist!");
                }

                return Ok(s);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpDelete("deleteAcademic"), Authorize(Policy = "Student")]
        public async Task<IActionResult> deleteAcademic(Guid idAcademic)
        {
            var academic = await _studentService.deleteAcademic(idAcademic);
            if (!academic)
            {
                return BadRequest("Academic can not be found");
            }
            return Ok("Academic deleted!");
        }
        [HttpDelete("deleteExpense"), Authorize(Policy = "Student")]
        public async Task<IActionResult> deleteExpense(Guid idExpense)
        {
            var expense = await _studentService.deleteExpense(idExpense);
            if (!expense)
            {
                return BadRequest();
            }
            return Ok("Expense deleted!");
        } 

    }
}
