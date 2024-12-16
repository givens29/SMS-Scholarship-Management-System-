using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace WebApplication3.Models
{
    public class Account
    {
        public Guid Id { get; set; } = Guid.NewGuid();
        public string email { get; set; }
        public string hashedPassword { get; set; }
        public Role role { get; set; }
        public List<Message> SentMessages { get; set; } = new List<Message>();
        public List<Message> ReceivedMessages { get; set; } = new List<Message>();


    }
}
