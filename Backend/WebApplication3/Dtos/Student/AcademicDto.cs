using Microsoft.VisualBasic;

namespace WebApplication3.Dtos.Student
{
    public class AcademicDto
    {
        public string periodofAcademic { get; set; }
        public IFormFile transcriptRecord { get; set; }
        public IFormFile verificationLetter { get; set; }
        public DateTime dateTime { get; set; }
    }
}
