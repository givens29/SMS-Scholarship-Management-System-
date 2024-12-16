namespace WebApplication3.Dtos.Message
{
    public class MessageforListMessagesDto
    {
        public Guid id { get; set; }
        public Guid senderId { get; set; }
        public Guid receipantId { get; set; }
        public string subject { get; set; }
        public string body { get; set; }
        public DateTime dateTime { get; set; }
        public bool isRead { get; set; }
        public List<byte[]> file { get; set; }
    }
}
