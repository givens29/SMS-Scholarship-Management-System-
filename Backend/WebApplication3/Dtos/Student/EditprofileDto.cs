using Microsoft.AspNetCore.Http;
using System.ComponentModel.DataAnnotations;
using WebApplication3.Models;

namespace WebApplication3.Dtos.Student
{
    public class EditprofileDto
    {
        public string IDNumber { get; set; }
        public string fullName { get; set; }
        public DateTime dateOfBirth { get; set; }
        public string address { get; set; }
        public string WAnumber { get; set; }
        public IFormFile profilePicture { get; set; }

    }
}
