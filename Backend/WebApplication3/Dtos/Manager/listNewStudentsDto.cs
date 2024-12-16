using WebApplication3.Models;

namespace WebApplication3.Dtos.Manager
{
    public class listNewStudentsDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string IDNumber { get; set; }
        public string fullName { get; set; }
        public DateTime dateOfBirth { get; set; }
        public string address { get; set; }
        public string WAnumber { get; set; }
        public Parent parent { get; set; }
        public Bank bank { get; set; }
        public University university { get; set; }
        public byte[] scholarshipContract { get; set; }
    }
}
