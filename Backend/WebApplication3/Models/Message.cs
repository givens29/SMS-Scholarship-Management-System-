using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication3.Models
{
    public class Message
    {
        [Key]
        public Guid Id { get; set; } = Guid.NewGuid();
        public Account sender { get; set; }
        public Guid SenderId { get; set; }
        public Account receipant { get; set; }
        public Guid RecipientId { get; set; }
        public string subject { get; set; }
        public string body { get; set; }
        public DateTime dateTime { get; set; }
        public List<byte[]> file { get; set; } = new List<byte[]>();
        public bool IsRead { get; set; }
    }
}
