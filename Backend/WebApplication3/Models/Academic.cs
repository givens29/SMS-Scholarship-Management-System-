using Microsoft.VisualBasic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication3.Models
{
    public class Academic
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public string periodofAcademic { get; set; }
        public byte[] transcriptRecord { get; set; }
        public byte[] verificationLetter {  get; set; }
        public DateTime dateTime { get; set; }
    }
}
