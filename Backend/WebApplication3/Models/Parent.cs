using System.ComponentModel.DataAnnotations;

namespace WebApplication3.Models
{
    public class Parent
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string fullName { get; set; }
        public string relation { get; set; }
        public string address { get; set; }
        public string email { get; set; }
        public string WAnumber { get; set; }
    }
}
