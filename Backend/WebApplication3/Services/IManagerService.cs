using Microsoft.EntityFrameworkCore;
using WebApplication3.Data;
using WebApplication3.Dtos.Manager;
using WebApplication3.Dtos.Student;
using WebApplication3.Models;


namespace WebApplication3.Services
{
    public interface IManagerService
    {
        Task<List<listNewStudentsDto>> getlistofNewStudent();
        Task<Student> getStudent(Guid id);
        Task<List<listStudentsDto>> getlistofStudents();
        Task<listNewStudentsDto> getNewStudents(Guid newstudentID);
        Task<string> processExpense(Guid idExpense, bool isProcess);
        Task<bool> deleteStudent(Guid idStudent);
        Task<Manager> editProfile(Guid managerId, editProfileManagerDto manager);
        Task<List<StudentExpenseDto>> getlistofStudentsUnprocessedExpenses();
        Task<List<StudentExpenseDto>> getlistofStudentsProcessedExpenses();


    }
    public class ManagerService: IManagerService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public ManagerService(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        public async Task<Manager> editProfile(Guid managerId, editProfileManagerDto manager)
        {
            var managerProfile = await _context.Managers
                .Include(s => s.account)
                .FirstOrDefaultAsync(s => s.account.Id == managerId);
            if (managerProfile == null)
            {
                return null;
            }

            managerProfile.employeeId = manager.employeeId;
            managerProfile.fullName = manager.fullName;
            managerProfile.WAnumber = manager.WAnumber;
            managerProfile.address = manager.address;

            if (manager.profilePicture != null && manager.profilePicture.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await manager.profilePicture.CopyToAsync(memoryStream);
                    managerProfile.profilePicture = memoryStream.ToArray();
                }
            }
            else
            {
                managerProfile.profilePicture = new byte[0];
            }


            await _context.SaveChangesAsync();


            return managerProfile;
        }
        public async Task<bool> deleteStudent(Guid idStudent)
        {
            var student = await _context.Students.FirstOrDefaultAsync(s => s.account.Id == idStudent);

            if (student == null)
            {
                return false;
            }

            _context.Students.Remove(student);
            await _context.SaveChangesAsync();

            return true;

        }

        public async Task<List<listNewStudentsDto>> getlistofNewStudent()
        {
            var listofNewStudent = await _context.NewStudents
                .Include(s => s.parent)
                .Include(s => s.bank)
                .Include(s => s.university)
                .ToListAsync();

            var listNewStudentsDto = listofNewStudent.Select(student => new listNewStudentsDto
            {
                Id = student.Id,
                IDNumber = student.IDNumber,
                fullName = student.fullName,
                dateOfBirth = student.dateOfBirth,
                address = student.address,
                WAnumber = student.WAnumber,
                parent = new Parent
                {
                    Id =student.parentId,
                    fullName = student.parent.fullName,
                    relation = student.parent.relation,
                    address = student.parent.address,
                    email = student.parent.email,
                    WAnumber = student.parent.WAnumber
                },
                bank = new Bank
                {
                    Id = student.bankId,
                    name = student.bank.name,
                    accountName = student.bank.accountName,
                    accountNumber = student.bank.accountNumber
                },
                university = new University
                {
                    Id = student.universityId,
                    name = student.university.name,
                    address = student.university.address,
                    email = student.university.email,
                    link = student.university.link
                },
                scholarshipContract = student.scholarshipContract
            }).ToList();

            return listNewStudentsDto;
        }

        public async Task<List<listStudentsDto>> getlistofStudents()
        {
            var listStudents = await _context.Students
                .Include(s => s.account)
                .Include(s => s.university)
                .ToListAsync();

            var listStudentsDto = listStudents.Select(student => new listStudentsDto
            {
                Id = student.Id,
                fullName = student.fullName,
                accountId = student.accountId,
                university = student.university,
                profilePic = student.profilePicture
            }).ToList();

            return listStudentsDto;
        }

        public async Task<List<StudentExpenseDto>> getlistofStudentsProcessedExpenses()
        {
            var processedExpenses = await _context.Students
        .Where(s => s.expenses.Any(e => e.isProcess == isProcess.Processed))
        .SelectMany(s => s.expenses.Where(e => e.isProcess == isProcess.Processed),
                    (s, e) => new StudentExpenseDto
                    {
                        studentId = s.Id,
                        studentName = s.fullName,
                        idExpense = e.Id,
                        livingCostPeriod = e.livingCostPeriod,
                        livingCostDocument = e.livingCostDocument,
                        invoice = e.invoice,
                        cost = e.cost,
                        isProcess = e.isProcess

                    })
        .ToListAsync();

            return processedExpenses;
        }

        public async Task<List<StudentExpenseDto>> getlistofStudentsUnprocessedExpenses()
        {
            var processedExpenses = await _context.Students
                    .Where(s => s.expenses.Any(e => e.isProcess == isProcess.InProcess))
                    .SelectMany(s => s.expenses.Where(e => e.isProcess == isProcess.InProcess),
                    (s, e) => new StudentExpenseDto
                    {
                        studentId = s.account.Id,
                        studentName = s.fullName,
                        idExpense = e.Id,
                        livingCostPeriod = e.livingCostPeriod,
                        livingCostDocument = e.livingCostDocument,
                        invoice = e.invoice,
                        cost = e.cost,
                        isProcess = e.isProcess,
                        bankInfo = s.bank,
                        dateTime = e.dateTime

                    }).ToListAsync();

            return processedExpenses;
        }

        public async Task<listNewStudentsDto> getNewStudents(Guid newstudentID)
        {
            var student = await _context.NewStudents
                .Include(s => s.bank)
                .Include(s => s.university)
                .Include(s => s.parent)
                .FirstOrDefaultAsync(s => s.Id == newstudentID);

            if (student == null)
            {
                return null;
            }

            var newStudent = new listNewStudentsDto
            {
                Id = student.Id,
                IDNumber = student.IDNumber,
                fullName = student.fullName,
                dateOfBirth = student.dateOfBirth,
                address = student.address,
                WAnumber = student.WAnumber,
                parent = new Parent
                {
                    Id = student.parentId,
                    fullName = student.parent.fullName,
                    relation = student.parent.relation,
                    address = student.parent.address,
                    email = student.parent.email,
                    WAnumber = student.parent.WAnumber
                },
                bank = new Bank
                {
                    Id = student.bankId,
                    name = student.bank.name,
                    accountName = student.bank.accountName,
                    accountNumber = student.bank.accountNumber
                },
                university = new University
                {
                    Id = student.universityId,
                    name = student.university.name,
                    address = student.university.address,
                    email = student.university.email,
                    link = student.university.link
                },
                scholarshipContract = student.scholarshipContract

            };

            return newStudent;
        }

        public async Task<Student> getStudent(Guid id)
        {
            var student = await _context.Students
                .Include(s => s.account)
                .Include(s => s.bank)
                .Include(s => s.university)
                .Include(s => s.expenses)
                .Include(s => s.academics)
                .Include(s => s.parent)
                .FirstOrDefaultAsync(s => s.account.Id == id);

            if (student == null)
            {
                return null;
            }

            return student;

        }

        public async Task<string> processExpense(Guid idExpense, bool IsProcess)
        {
            var processExpense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == idExpense);

            if (IsProcess != true)
            {
                processExpense.isProcess = isProcess.Decline;
                _context.Expenses.Remove(processExpense);
                await _context.SaveChangesAsync();
                return "Expense decline.";

            }

            processExpense.isProcess = isProcess.Processed;
            await _context.SaveChangesAsync();
            return "Expense processed!";

        }

    }
}
