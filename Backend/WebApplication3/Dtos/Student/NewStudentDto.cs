using WebApplication3.Models;

namespace WebApplication3.Dtos.Student
{
    public class NewStudentDto
    {
        public string IDNumber { get; set; }
        public string fullName { get; set; }
        public DateTime dateOfBirth { get; set; }
        public string address { get; set; }
        public string WAnumber { get; set; }
        public string email { get; set; }
        public string password { get; set; }
        public ParentDto parent { get; set; }
        public BankDto bank { get; set; }
        public UniversityDto university { get; set; }
        public IFormFile scholarshipContract { get; set; }
    }
}
