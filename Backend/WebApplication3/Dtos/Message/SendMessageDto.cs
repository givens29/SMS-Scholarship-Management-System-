using System.ComponentModel.DataAnnotations.Schema;
using WebApplication3.Models;

namespace WebApplication3.Dtos.Message
{
    public class SendMessageDto
    {
        public Guid senderId { get; set; }
        public Guid receipantId { get; set; }
        public string subject { get; set; }
        public string body { get; set; }
        public DateTime dateTime { get; set; }
        public List<IFormFile> file { get; set; } = new List<IFormFile>();
    }
}
