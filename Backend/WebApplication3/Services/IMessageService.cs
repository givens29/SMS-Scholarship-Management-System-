using Microsoft.EntityFrameworkCore;
using WebApplication3.Data;
using WebApplication3.Dtos.Message;
using WebApplication3.Dtos.Student;
using WebApplication3.Models;

namespace WebApplication3.Services
{
    public interface IMessageService
    {
        Task<SendMessageDto> sendMessage(SendMessageDto message);
        Task<List<ListMessagesDto>> getMessages(Guid id);
        Task<List<Account>> getMesssagesAccount(Guid id);
        Task<ListMessagesDto> getConversation(Guid currentUserId, Guid otherUserId);
        Task<List<byte[]>> getFiles(Guid id);
        Task<bool> deleteMessage(Guid idMessage);

    }
    public class MessageService : IMessageService
    {
        private readonly DataContext _context;
        private readonly IConfiguration _configuration;

        public MessageService(DataContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }
        public async Task<SendMessageDto> sendMessage(SendMessageDto messageDto)
        {
            var sender = await _context.Accounts
                .Include(s => s.SentMessages)
                .FirstOrDefaultAsync(s => s.Id == messageDto.senderId);

            var recipient = await _context.Accounts
                .Include(r => r.ReceivedMessages)
                .FirstOrDefaultAsync(r => r.Id == messageDto.receipantId);

            if (sender == null || recipient == null)
            {
                return null;
            }

            var filesByteArray = new List<byte[]>();

            if (messageDto.file != null && messageDto.file.Any())
            {
                foreach (var formFile in messageDto.file)
                {
                    using (var memoryStream = new MemoryStream())
                    {
                        await formFile.CopyToAsync(memoryStream);
                        filesByteArray.Add(memoryStream.ToArray());
                    }
                }
            }
            else
            {
                filesByteArray.Add(new byte[0]);
            }

            var sendMessage = new Message
            {
                SenderId = messageDto.senderId,
                RecipientId = messageDto.receipantId,
                subject = messageDto.subject,
                body = messageDto.body,
                dateTime = DateTime.UtcNow,
                file = filesByteArray,
                IsRead = false
            };

            sender.SentMessages.Add(sendMessage);
            recipient.ReceivedMessages.Add(sendMessage);

            _context.Messages.Add(sendMessage);
            await _context.SaveChangesAsync();

            return messageDto;
        }

        public async Task<bool> deleteMessage(Guid idMessage)
        {
            var message = await _context.Messages.FirstOrDefaultAsync(m => m.Id == idMessage);

            if (message == null)
            {
                return false;
            }

            _context.Messages.Remove(message);
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<List<Account>> getMesssagesAccount(Guid id)
        {
            var accounts = await _context.Accounts
            .Where(u => u.SentMessages.Any(m => m.RecipientId == id) || u.ReceivedMessages.Any(m => m.SenderId == id))
            .ToListAsync();

            if (accounts.Count == 0)
            {
                return null;
            }

            return accounts;
        }

        public async Task<ListMessagesDto> getConversation(Guid currentUserId, Guid otherUserId)
        {
            // Fetch the user and related messages
            var user = await _context.Accounts
                .Include(u => u.SentMessages)
                .Include(u => u.ReceivedMessages)
                .Where(u => u.Id == currentUserId)
                .FirstOrDefaultAsync();

            if (user == null)
            {
                return null;
            }

            // Update the isRead status for the received messages
            var receivedMessages = user.ReceivedMessages
                .Where(m => m.SenderId == otherUserId && !m.IsRead)
                .ToList();

            foreach (var message in receivedMessages)
            {
                message.IsRead = true;
            }

            // Save changes to the database
            await _context.SaveChangesAsync();

            // Prepare the DTO
            var result = new ListMessagesDto
            {
                id = currentUserId,
                SentMessages = user.SentMessages
                    .Where(m => m.RecipientId == otherUserId)
                    .Select(m => new MessageforListMessagesDto
                    {
                        id = m.Id,
                        senderId = m.SenderId,
                        receipantId = m.RecipientId,
                        dateTime = m.dateTime,
                        subject = m.subject,
                        body = m.body,
                        isRead = m.IsRead,
                        file = m.file
                    }).ToList(),

                ReceivedMessages = user.ReceivedMessages
                    .Where(m => m.SenderId == otherUserId)
                    .Select(m => new MessageforListMessagesDto
                    {
                        id = m.Id,
                        senderId = m.SenderId,
                        receipantId = m.RecipientId,
                        dateTime = m.dateTime,
                        subject = m.subject,
                        body = m.body,
                        isRead = m.IsRead,
                        file = m.file
                    }).ToList()
            };

            return result;
        }

        public async Task<List<byte[]>> getFiles(Guid id)
        {
            var files = await _context.Messages
        .Where(m => m.Id == id)
        .Select(m => m.file)
        .FirstOrDefaultAsync();
            if (files == null)
            {
                return null;
            }
            return files;
        }

        public async Task<List<ListMessagesDto>> getMessages(Guid id)
        {
            var accounts = await _context.Accounts
                .Include(a => a.SentMessages)
                .Include(a => a.ReceivedMessages)
                .Where(u => u.SentMessages.Any(m => m.RecipientId == id) || u.ReceivedMessages.Any(m => m.SenderId == id))
                .ToListAsync();

   
            var messagesDtoList = new List<ListMessagesDto>();

            foreach (var account in accounts)
            {
                var sentMessages = account.SentMessages
                    .Where(m => m.RecipientId == id)
                    .Select(m => new MessageforListMessagesDto
                    {
                        id = m.Id,
                        senderId = m.SenderId,
                        receipantId = m.RecipientId,
                        subject = m.subject,
                        body = m.body,
                        dateTime = m.dateTime,
                        isRead = m.IsRead,
                        file = m.file
                    })
                    .ToList();

                var receivedMessages = account.ReceivedMessages
                    .Where(m => m.SenderId == id)
                    .Select(m => new MessageforListMessagesDto
                    {
                        id = m.Id,
                        senderId = m.SenderId,
                        receipantId = m.RecipientId,
                        subject = m.subject,
                        body = m.body,
                        dateTime = m.dateTime,
                        isRead = m.IsRead,
                        file = m.file
                    })
                    .ToList();

                var listMessagesDto = new ListMessagesDto
                {
                    id = account.Id,
                    SentMessages = sentMessages,
                    ReceivedMessages = receivedMessages
                };

                messagesDtoList.Add(listMessagesDto);
            }

            return messagesDtoList;
        }


    }
}
