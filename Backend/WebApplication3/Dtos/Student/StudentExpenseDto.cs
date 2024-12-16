using Microsoft.VisualBasic;
using WebApplication3.Models;

namespace WebApplication3.Dtos.Student
{
    public class StudentExpenseDto
    {
        public Guid studentId { get; set; }
        public string studentName {  get; set; }
        public Guid idExpense { get; set; }
        public string livingCostPeriod { get; set; }
        public byte[] livingCostDocument { get; set; }
        public byte[] invoice { get; set; }
        public decimal cost { get; set; }
        public DateTime dateTime { get; set; }
        public isProcess isProcess { get; set; }
        public Bank bankInfo { get; set; }
    }
}
