using System.ComponentModel.DataAnnotations;

namespace WebApplication3.Models
{
    public class University
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string name { get; set; }
        public string address { get; set; }
        public string email { get; set; }
        public string link { get; set; }
    }
}
