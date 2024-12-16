using WebApplication3.Models;

namespace WebApplication3.Dtos.Message
{
    public class ListMessagesDto
    {
        public Guid id { get; set; }
        public List<MessageforListMessagesDto> SentMessages { get; set; }
        public List<MessageforListMessagesDto> ReceivedMessages { get; set; }
    }
}
