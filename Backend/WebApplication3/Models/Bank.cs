using System.ComponentModel.DataAnnotations;

namespace WebApplication3.Models
{
    public class Bank
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string name { get; set; }
        public string accountName { get; set; }
        public string accountNumber { get; set; }
    }
}
