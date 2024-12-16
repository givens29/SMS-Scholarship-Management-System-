using WebApplication3.Models;

namespace WebApplication3.Dtos.Manager
{
    public class registerManagerDto
    {
        public int employeeId { get; set; }
        public string fullName { get; set; }
        public string address { get; set; }
        public string WAnumber { get; set; }
        public string email { get; set; }
        public string password {  get; set; }
    }
}
