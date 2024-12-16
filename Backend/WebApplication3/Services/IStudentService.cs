using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using WebApplication3.Data;
using WebApplication3.Dtos;
using WebApplication3.Dtos.Manager;
using WebApplication3.Dtos.Student;
using WebApplication3.Models;

namespace WebApplication3.Services
{
    public interface IStudentService
    {
        Task<Academic> addAcademic(Guid id, AcademicDto academic);
        Task<Expense> addExpense(Guid id, ExpenseDto expense);
        Task<List<Academic>> getlistAcademic(Guid id);
        Task<Academic> getAcademic(Guid id);
        //Task<Expense> addExpense(Guid studentId, ExpenseDto expense);
        Task<List<Expense>> getlistExpense(Guid id);
        Task<Expense> getExpense(Guid id);             
        Task<List<listManagersDto>> getlistManager();
        Task<listManagersDto> getManager(Guid managerId);
        Task<Student> editProfile(Guid studentId,EditprofileDto student);
        Task<Parent> editParent(Guid idParent, ParentDto parent);
        Task<Bank> editBank(Guid idBank,BankDto bank);
        Task<University> editUniversity(Guid idUniversity, UniversityDto university);
        Task<bool> deleteAcademic(Guid idAcademic);
        Task<bool> deleteExpense(Guid idExpense);
    }
    public class StudentService : IStudentService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public StudentService(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<Academic> addAcademic(Guid id, AcademicDto academic)
        {
            var student = await _context.Students
                .Include(s => s.academics)
                .FirstOrDefaultAsync(s => s.account.Id == id);

            if (student == null)
            {
                return null; 
            }

                byte[] transcriptRecordData = null;
                byte[] verificationLetterData = null;

                if (academic.transcriptRecord != null && academic.transcriptRecord.Length > 0)
                {
                    transcriptRecordData = await ReadFileDataAsync(academic.transcriptRecord);
                    if (transcriptRecordData == null)
                    {
                        return null; 
                    }
                }

                if (academic.verificationLetter != null && academic.verificationLetter.Length > 0)
                {
                    verificationLetterData = await ReadFileDataAsync(academic.verificationLetter);
                    if (verificationLetterData == null)
                    {
                        return null;
                    }
                }

                var addAcademic = new Academic
                {
                    periodofAcademic = academic.periodofAcademic,
                    transcriptRecord = transcriptRecordData,
                    verificationLetter = verificationLetterData,
                    dateTime = DateTime.UtcNow
                };

                student.academics.Add(addAcademic);
                _context.Academics.Add(addAcademic);

                await _context.SaveChangesAsync();

                return addAcademic;

        }

        public async Task<Expense> addExpense(Guid id, ExpenseDto expense)
        {
            var student = await _context.Students
               .Include(s => s.expenses)
               .FirstOrDefaultAsync(s => s.account.Id == id);

            if (student == null)
            {
                return null;
            }

                byte[] livingCostData = null;
                byte[] invoiceData = null;

                if (expense.livingCostDocument != null && expense.livingCostDocument.Length > 0)
                {
                    livingCostData = await ReadFileDataAsync(expense.livingCostDocument);
                    if (livingCostData == null)
                    {
                        return null;
                    }
                }

                if (expense.invoice != null && expense.invoice.Length > 0)
                {
                    invoiceData = await ReadFileDataAsync(expense.invoice);                 
                }
                else
                {
                   invoiceData = new byte[0];
                }

                var addExpense = new Expense
                {
                    livingCostPeriod = expense.livingCostPeriod,
                    livingCostDocument = livingCostData,
                    invoice = invoiceData,
                    cost = expense.cost,
                    dateTime = expense.dateTime
                };

                student.expenses.Add(addExpense);
                _context.Expenses.Add(addExpense);

                await _context.SaveChangesAsync();

                return addExpense;
  
        }

        public async Task<bool> deleteAcademic(Guid idAcademic)
        {
            var academic = await _context.Academics.FirstOrDefaultAsync(a => a.Id ==  idAcademic);

            if(academic == null)
            {
                return false;
            }    

             _context.Academics.Remove(academic);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> deleteExpense(Guid idExpense)
        {
            var expense = await _context.Expenses.FirstOrDefaultAsync(e => e.Id == idExpense);

            if(expense == null)
            {
                return false;
            }

            _context.Expenses.Remove(expense);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<Bank> editBank(Guid idBank, BankDto bank)
        {
            var studentBank = await _context.Banks.FirstOrDefaultAsync(b => b.Id == idBank);
            if (studentBank == null)
            {
                return null;
            }

            studentBank.accountNumber = bank.accountNumber;
            studentBank.accountName = bank.accountName;
            studentBank.name = bank.name;

            await _context.SaveChangesAsync();
            return studentBank;
        }

        public async Task<Parent> editParent(Guid idParent, ParentDto parent)
        {
            var studentParent = await _context.Parents.FirstOrDefaultAsync(p => p.Id == idParent);
            if (studentParent == null)
            {
                return null;
            }

            studentParent.fullName = parent.fullName;
            studentParent.relation = parent.relation;
            studentParent.address = parent.address;
            studentParent.email = parent.email;
            studentParent.WAnumber = parent.WAnumber;        

            await _context.SaveChangesAsync();
            return studentParent;
        }

        public async Task<Student> editProfile(Guid studentId, EditprofileDto student)
        {
            var studentProfile = await _context.Students
                .Include(s=>s.account)
                .Include(s => s.parent)
                .Include(s => s.bank)
                .Include(s => s.university)
                .FirstOrDefaultAsync(s => s.account.Id == studentId);
            if(studentProfile == null)
            {
                return null;
            }

            studentProfile.IDNumber = student.IDNumber;
            studentProfile.fullName = student.fullName;
            studentProfile.dateOfBirth = student.dateOfBirth;
            studentProfile.address = student.address;
            studentProfile.WAnumber = student.WAnumber;

            if (student.profilePicture != null && student.profilePicture.Length > 0)
            {
                using (var memoryStream = new MemoryStream())
                {
                    await student.profilePicture.CopyToAsync(memoryStream);
                    studentProfile.profilePicture = memoryStream.ToArray();
                }
            }
            else
            {
                studentProfile.profilePicture = new byte[0];
            }

            await _context.SaveChangesAsync();
           
            return studentProfile;
        }

        public async Task<University> editUniversity(Guid idUniversity, UniversityDto university)
        {
            var studentUniversity = await _context.Universities.FirstOrDefaultAsync(s => s.Id == idUniversity);
            if (studentUniversity == null)
            {
                return null;
            }

            studentUniversity.email = university.email;
            studentUniversity.address= university.address;
            studentUniversity.link= university.link;
            studentUniversity.name = university.name;

            await _context.SaveChangesAsync();
            return studentUniversity;
        }

        public async Task<Academic> getAcademic(Guid id)
        {
            var studentAcademic = await _context.Academics.FirstOrDefaultAsync(a => a.Id == id);

            if(studentAcademic == null)
            {
                return null;
            }

            return studentAcademic;
        }

        public async Task<Expense> getExpense(Guid id)
        {
            var studentExpense = await _context.Expenses.FirstOrDefaultAsync(a => a.Id == id);

            if (studentExpense == null)
            {
                return null;
            }

            return studentExpense;
        }

        public async Task<List<Academic>> getlistAcademic(Guid id)
        {
            var student = await _context.Students
                .Include(s => s.academics)
                .FirstOrDefaultAsync(s => s.account.Id == id);

            if (student == null)
            {
                return null; 
            }

            var academicRecords = student.academics.ToList();

            foreach (var academicRecord in academicRecords)
            {
                await LoadFileDataAsync(academicRecord);
            }

            return academicRecords;
        }

        public async Task<List<Expense>> getlistExpense(Guid id)
        {
            var student = await _context.Students
        .Include(s => s.expenses)
        .FirstOrDefaultAsync(s => s.account.Id == id);

            if (student == null)
            {
                return null;
            }

            var expenseRecords = student.expenses.ToList();

            foreach (var expenseRecord in expenseRecords)
            {
                await LoadExpenseFileDataAsync(expenseRecord);
            }

            return expenseRecords;
        }

        private async Task LoadExpenseFileDataAsync(Expense expenseRecord)
        {
            // Load living cost document file data
            if (expenseRecord.livingCostDocument != null)
            {
                expenseRecord.livingCostDocument = await ReadFileDataAsync(expenseRecord.livingCostDocument);
            }

            // Load invoice file data
            if (expenseRecord.invoice != null)
            {
                expenseRecord.invoice = await ReadFileDataAsync(expenseRecord.invoice);
            }
        }

        public async Task<List<listManagersDto>> getlistManager()
        {
            var managers = await _context.Managers
                .Include(m=>m.account)
                .ToListAsync();

            var listManagersDto = managers.Select(manager => new listManagersDto
            {
                Id = manager.account.Id,
                employeeId = manager.employeeId,
                fullName = manager.fullName,
                address = manager.address,
                WAnumber = manager.WAnumber,
                profilePicture = manager.profilePicture
            }).ToList();

            return listManagersDto;
        }
        

        public async Task<listManagersDto> getManager(Guid id)
        {
            var manager = await _context.Managers
        .Include(m => m.account)
        .FirstOrDefaultAsync(m => m.account.Id == id);

            if (manager == null)
            {
                return null;
            }

            var managerDto = new listManagersDto
            {
                Id = manager.Id,
                employeeId = manager.employeeId,
                accountId = manager.accountId,
                fullName = manager.fullName,
                address = manager.address,
                WAnumber = manager.WAnumber,
                profilePicture = manager.profilePicture
            };

            return managerDto;
        }

        private async Task LoadFileDataAsync(Academic academicRecord)
        {
            if (academicRecord.transcriptRecord != null)
            {
                academicRecord.transcriptRecord = await ReadFileDataAsync(academicRecord.transcriptRecord);
            }
            if (academicRecord.verificationLetter != null)
            {
                academicRecord.verificationLetter = await ReadFileDataAsync(academicRecord.verificationLetter);
            }
        }

        private async Task<byte[]> ReadFileDataAsync(byte[] fileData)
        {
            using (var memoryStream = new MemoryStream(fileData))
            {
                var data = new byte[memoryStream.Length];
                await memoryStream.ReadAsync(data, 0, data.Length);
                return data;
            }
        }
        private async Task<byte[]> ReadFileDataAsync(IFormFile file)
        {
            using (var memoryStream = new MemoryStream())
            {
                await file.CopyToAsync(memoryStream);
                return memoryStream.ToArray();
            }
        }




    }
}
