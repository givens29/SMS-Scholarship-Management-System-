using WebApplication3.Models;

namespace WebApplication3.Dtos.Manager
{
    public class listStudentsDto
    {
        public Guid accountId { get; set; }
        public Guid Id { get; set; }
        public string fullName { get; set; }
        public University university { get; set; }
        public byte[] profilePic { get; set; }

    }
}
