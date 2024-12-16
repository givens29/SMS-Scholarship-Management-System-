using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication3.Models
{
    public class Student
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string IDNumber { get; set; }
        public string fullName { get; set; }
        public DateTime dateOfBirth { get; set; }
        public string address { get; set; }
        public string WAnumber { get; set; }
        public Account account { get; set; }
        public Guid accountId { get; set; }
        public Parent parent { get; set; }
        public Guid parentId { get; set; }
        public Bank bank { get; set; }
        public Guid bankId { get; set; }
        public University university { get; set; }
        public Guid universityId { get; set; }
        public List<Academic> academics { get; set; } = new List<Academic>();
        public List<Expense> expenses { get; set; } = new List<Expense>();
        public byte[] profilePicture { get; set; } = new byte[0];

    }
}
