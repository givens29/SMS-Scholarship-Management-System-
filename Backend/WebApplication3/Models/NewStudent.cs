using System.ComponentModel.DataAnnotations;

namespace WebApplication3.Models
{
    public class NewStudent
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string IDNumber { get; set; }
        public string fullName { get; set; }
        public DateTime dateOfBirth { get; set; }
        public string address { get; set; }
        public string WAnumber { get; set; }
        public string email { get; set; }
        public string hashedPassword { get; set; }
        public Parent parent { get; set; }
        public Guid parentId { get; set; }
        public Bank bank { get; set; }
        public Guid bankId { get; set; }
        public University university { get; set; }
        public Guid universityId { get; set; }
        public byte[] scholarshipContract { get; set; }
    }
}
