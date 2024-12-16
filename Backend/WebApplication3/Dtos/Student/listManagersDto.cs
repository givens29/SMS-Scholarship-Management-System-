using WebApplication3.Models;

namespace WebApplication3.Dtos.Student
{
    public class listManagersDto
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public int employeeId { get; set; }
        public Guid accountId { get; set; }
        public string fullName { get; set; }
        public string address { get; set; }
        public string WAnumber { get; set; }
        public byte[] profilePicture { get; set; } = new byte[0];

    }
}
