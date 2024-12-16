using Microsoft.VisualBasic;

namespace WebApplication3.Dtos.Student
{
    public class ExpenseDto
    {
        public string livingCostPeriod { get; set; }
        public IFormFile livingCostDocument { get; set; }
        public IFormFile? invoice { get; set; }
        public decimal cost { get; set; }
        public DateTime dateTime { get; set; }
    }
}
