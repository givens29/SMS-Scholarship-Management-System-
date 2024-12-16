using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.RegularExpressions;
using WebApplication3.Data;
using WebApplication3.Dtos;
using WebApplication3.Dtos.Manager;
using WebApplication3.Dtos.Student;
using WebApplication3.Models;

namespace WebApplication3.Services
{
    public interface IAuthenticationService
    {
        Task<string> registerNewStudent(Dtos.Student.NewStudentDto newStudent);
        Task<string> registerManager(registerManagerDto manager);
        Task<string> isAcceptNewStudent(Guid id, bool accept);
        Task<string> loginManager(string email, string password);
        Task<string> loginStudent(string email, string password);
        Task<Account> editAccount(Guid id,EditAccountDto editAccount);
        Task<bool> logout(string email);
    }
    public class AuthenticationService : IAuthenticationService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public AuthenticationService(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<string> isAcceptNewStudent(Guid id, bool accept)
        {
           
                var newStudent = await _context.NewStudents
                .Include(s => s.parent)
                .Include(s => s.bank)
                .Include(s => s.university)
                .FirstOrDefaultAsync(s => s.Id == id);

                if (newStudent == null)
                {
                    return null;
                }

            if (accept)
                {

                var studentAccount = new Account
                {
                    email = newStudent.email,
                    hashedPassword = newStudent.hashedPassword,
                    role = Role.Student,
                };

                _context.Accounts.Add(studentAccount);
                await _context.SaveChangesAsync();              

                var student = new Student
                    {
                        IDNumber = newStudent.IDNumber,
                        fullName = newStudent.fullName,
                        dateOfBirth = newStudent.dateOfBirth,
                        address = newStudent.address,
                        WAnumber = newStudent.WAnumber,
                        account = studentAccount,
                        accountId = studentAccount.Id,
                        parent = newStudent.parent,
                        parentId = newStudent.parentId,
                        bank = newStudent.bank,
                        bankId = newStudent.bankId,
                        university = newStudent.university,
                        universityId = newStudent.university.Id,

                    };

                    _context.Students.Add(student);
                    _context.NewStudents.Remove(newStudent);
                    await _context.SaveChangesAsync();

                    return "New student accepted";
                }

            _context.NewStudents.Remove(newStudent);
            _context.Parents.Remove(newStudent.parent);
            _context.Banks.Remove(newStudent.bank);
            _context.Universities.Remove(newStudent.university);
            await _context.SaveChangesAsync();
            return "New student decline";
           
        }
        public async Task<Account> editAccount(Guid idAccount, EditAccountDto account)
        {
            var userAccount = await _context.Accounts.FirstOrDefaultAsync(s => s.Id == idAccount);
            if (userAccount == null)
            {
                return null;
            }
            var hashPassword = HashPassword(account.password);

            userAccount.email = account.email;
            userAccount.hashedPassword = hashPassword;

            await _context.SaveChangesAsync();           
          
            return userAccount;

        }
        public async Task<string> loginManager(string email, string password)
        {
            var isEmailValid = checkEmailValidation(email);

            if (!isEmailValid)
            {
                return "Email not in valid format";
            }

            var isPasswordValid = checkPasswordValidation(password);

            if (isPasswordValid != "Password Valid")
            {
                return  isPasswordValid;
            }

            var managerEmail = await _context.Managers
                .Include(s => s.account)
                .FirstOrDefaultAsync(s => s.account.email == email);

            if (managerEmail == null)
            {
                return null;
            }

            string hashedPassword = HashPassword(password);

            var managerPassword = await _context.Managers
                .Include(s => s.account)
                .FirstOrDefaultAsync(s => s.account.hashedPassword == hashedPassword);


            string token = CreateManagerToken(managerEmail);
            var storeToken = new StorageToken
            {
                email = managerEmail.account.email,
                Token = token
            };

            _context.StorageTokens.Add(storeToken);
            await _context.SaveChangesAsync();

            return token;
        }

        public async Task<string> loginStudent(string email, string password)
        {
            var student = await _context.Students
                .Include(s => s.account)
                .Include(s => s.parent)
                .Include(s => s.bank)
                .Include(s => s.university)
                .Include(s => s.academics)
                .Include(s => s.expenses)
                .FirstOrDefaultAsync(s => s.account.email == email);

            if (student == null)
            {
                return null;
            }

            string token = CreateStudentToken(student);
            var storeToken = new StorageToken
            {
                email = student.account.email,
                Token = token
            };

            _context.StorageTokens.Add(storeToken);
            await _context.SaveChangesAsync();

            return token;
        }

        public async Task<bool> logout(string email)
        {
            var existingUser = await _context.StorageTokens.FirstOrDefaultAsync(u => u.email == email);
            if (existingUser != null)
            {
                _context.StorageTokens.Remove(existingUser);
                await _context.SaveChangesAsync();
                return true;
            }
            return false;

        }

        public async Task<string> registerManager(registerManagerDto manager)
        {

            var checkAccount = await _context.Managers.FirstOrDefaultAsync(m => m.account.email == manager.email);

            if (checkAccount != null)
            {
                return null;
            }
            
                string hashPassword = HashPassword(manager.password);

                var accountManager = new Account
                {
                    email = manager.email,
                    hashedPassword = hashPassword,
                    role = Role.Manager

                };

            _context.Accounts.Add(accountManager);
            await _context.SaveChangesAsync();

            var registerManager = new Manager
                {
                    employeeId = manager.employeeId,
                    fullName = manager.fullName,
                    address = manager.address,
                    WAnumber = manager.WAnumber,
                    accountId = accountManager.Id,
                };

                _context.Managers.Add(registerManager);
                await _context.SaveChangesAsync();
                return "You've registered";
            
        }

        public async Task<string> registerNewStudent(Dtos.Student.NewStudentDto newStudentDto)
        {

            var isEmailValid = checkEmailValidation(newStudentDto.email);

            if (!isEmailValid)
            {
                return "Email not in valid format";
            }

            var isPasswordValid = checkPasswordValidation(newStudentDto.password);

            if (isPasswordValid != "Password Valid")
            {
                return isPasswordValid;
            }

            var isRegister = checkAccount(newStudentDto.email);

            if (isRegister != "This account has not been register")
            {
                return isRegister;
            }

                byte[] scholarshipContractBytes;

                using (var memoryStream = new MemoryStream())
                {
                    await newStudentDto.scholarshipContract.CopyToAsync(memoryStream);
                    scholarshipContractBytes = memoryStream.ToArray();
                }

                string hashPassword = HashPassword(newStudentDto.password);

            var parent = new Parent
            {
                fullName = newStudentDto.parent.fullName,
                relation = newStudentDto.parent.relation,
                address = newStudentDto.parent.address,
                email = newStudentDto.parent.email,
                WAnumber = newStudentDto.parent.WAnumber
            };

            var bank = new Bank
            {
                name = newStudentDto.bank.name,
                accountName = newStudentDto.bank.accountName,
                accountNumber = newStudentDto.bank.accountNumber
            };

            var university = new University
            {
                name = newStudentDto.university.name,
                address = newStudentDto.university.address,
                email = newStudentDto.university.email,
                link = newStudentDto.university.link
            };

            _context.Parents.Add(parent);
            _context.Banks.Add(bank);
            _context.Universities.Add(university);
            await _context.SaveChangesAsync();

            var newStudent = new NewStudent
            {
                IDNumber = newStudentDto.IDNumber,
                fullName = newStudentDto.fullName,
                dateOfBirth = newStudentDto.dateOfBirth,
                address = newStudentDto.address,
                WAnumber = newStudentDto.WAnumber,
                email = newStudentDto.email,
                hashedPassword = hashPassword, 
                parentId = parent.Id,
                bankId = bank.Id,
                universityId = university.Id,
                scholarshipContract = scholarshipContractBytes
            };

            _context.NewStudents.Add(newStudent);
            await _context.SaveChangesAsync();

            return "Registration success!";
 }

        private string HashPassword(string password)
        {
            var passwordHasher = new PasswordHasher<object>();
            return passwordHasher.HashPassword(null, password);
        }



        private string CreateStudentToken(Student student)
        {
            List<Claim> claims = new List<Claim> 
            {
                new Claim(ClaimTypes.Authentication, student.account.Id.ToString()),
                new Claim(ClaimTypes.Email, student.account.email),
                new Claim(ClaimTypes.Name, student.fullName),
                new Claim(ClaimTypes.Role, "Student"),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("Authentication:Schemes:Bearer:SigningKeys:0:Value").Value!));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: cred
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;

        }
        private string CreateManagerToken(Manager manager)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Authentication, manager.account.Id.ToString()),
                new Claim(ClaimTypes.Email, manager.account.email),
                new Claim(ClaimTypes.Name, manager.fullName),
                new Claim(ClaimTypes.Role, "Manager"),
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("Authentication:Schemes:Bearer:SigningKeys:0:Value").Value!));

            var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                claims: claims,
                expires: DateTime.Now.AddDays(1),
                signingCredentials: cred
                );

            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;

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
                return ("This email has been register. Wait for email confirmation");
            }

            if (isStudent != null)
            {
                return ("This email has been register and accepted. You can login");
            }

            return "This account has not been register";
        }


    }
}
