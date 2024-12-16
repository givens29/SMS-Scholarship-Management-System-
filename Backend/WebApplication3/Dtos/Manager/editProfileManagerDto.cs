using Microsoft.AspNetCore.Http;
using WebApplication3.Models;

namespace WebApplication3.Dtos.Manager
{
    public class editProfileManagerDto
    {
        public int employeeId { get; set; }
        public string fullName { get; set; }
        public string address { get; set; }
        public string WAnumber { get; set; }
        public IFormFile profilePicture { get; set; }
    }
}
