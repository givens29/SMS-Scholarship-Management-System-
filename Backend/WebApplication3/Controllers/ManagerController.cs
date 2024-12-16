using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Text.RegularExpressions;
using WebApplication3.Data;
using WebApplication3.Dtos.Manager;
using WebApplication3.Dtos.Student;
using WebApplication3.Models;
using WebApplication3.Services;

namespace WebApplication3.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ManagerController : ControllerBase
    {
        private readonly DataContext _context;
        private IManagerService _managerService;

        public ManagerController(DataContext context, IManagerService managerService)
        {
            _context = context;
            _managerService = managerService;
        }


        [HttpGet("listofStudent"), Authorize(Policy = "Manager")]
        public async Task<IActionResult> getlistofStudents()
        {
            try
            {
                var listofStudent = await _managerService.getlistofStudents();

                return Ok(listofStudent);
            }
            catch(Exception ex)
            {
                return StatusCode(500,ex.Message);
            }
        }

        [HttpGet("listofNewStudents"), Authorize(Policy = "Manager")]
        public async Task<IActionResult> getlistofNewStudent()
        {
            try
            {
                var listofNewStudent = await _managerService.getlistofNewStudent();

                return Ok(listofNewStudent);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }

        [HttpGet("getStudent"), Authorize(Policy = "AnyRole")]
        public async Task<IActionResult> getStudent(Guid id)
        {
            try
            {
                var student = await _managerService.getStudent(id);

                if (student == null)
                {
                    return NotFound("Account can not be found!!!");
                }
                return Ok(student);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("getNewStudent"), Authorize(Policy = "Manager")]
        public async Task<IActionResult> getNewStudent(Guid newstudentID)
        {
            try
            {
                var newstudent = await _managerService.getNewStudents(newstudentID);

                if (newstudent == null)
                {
                    return NotFound("New Student not found");
                }
                return Ok(newstudent);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpPost("processExpense"), Authorize(Policy = "Manager")]
        public async Task<IActionResult> processStudentExpense(Guid idExpense, bool isProcess)
        {
            var isExpense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == idExpense);

            if (isExpense == null)
            {
                return NotFound("Expense can not be found.");
            }

            var processExpense = await _managerService.processExpense(idExpense, isProcess);

            return Ok(processExpense);

        }
        [HttpPut("editProfile"), Authorize(Policy = "Manager")]
        public async Task<IActionResult> editProfile(Guid managerId, editProfileManagerDto manager)
        {
            try
            {
                var editProfile = await _managerService.editProfile(managerId, manager);

                if (editProfile == null)
                {
                    return NotFound("Account can not be found!!!");
                }

                return Ok(editProfile);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }
        [HttpGet("getlistofUnprocessedExpenses"), Authorize(Policy = "Manager")]
        public async Task<IActionResult> getlistofUnprocessedExpenses()
        {
            var getListofUnprocessedExpenses = await _managerService.getlistofStudentsUnprocessedExpenses();

            return Ok(getListofUnprocessedExpenses);

        }
        [HttpGet("getlistofProcessedExpenses"), Authorize(Policy = "Manager")]
        public async Task<IActionResult> getlistofProcessedExpenses()
        {
            var getListofProcessedExpenses = await _managerService.getlistofStudentsProcessedExpenses();

            return Ok(getListofProcessedExpenses);

        }

        [HttpPost("deleteStudent"), Authorize(Policy = "Manager")]
        public async Task<IActionResult> deleteStudent(Guid idStudent)
        {
            var removeStudent = await _managerService.deleteStudent(idStudent);

            if (!removeStudent)
            {
                return NotFound("Account can not be found!!!");
            }


            return Ok("Student removed");

        }



    }
}
