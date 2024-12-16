using System.ComponentModel.DataAnnotations;

namespace WebApplication3.Models
{
    public class Manager
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public int employeeId { get; set; }
        public string fullName { get; set; }
        public string address { get; set; }
        public string WAnumber { get; set; }
        public Account account { get; set; }
        public Guid accountId { get; set; }
        public byte[] profilePicture { get; set; } = new byte[0];
    }
}
