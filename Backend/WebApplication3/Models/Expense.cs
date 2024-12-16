using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;

namespace WebApplication3.Models
{
    public class Expense
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string livingCostPeriod { get; set; }
        public byte[] livingCostDocument { get; set; }
        public byte[] invoice { get; set; } 
        public decimal cost { get; set; }
        public isProcess isProcess { get; set; }
        public DateTime dateTime { get; set; }
    }
}
