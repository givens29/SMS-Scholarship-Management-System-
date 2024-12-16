using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using WebApplication3.Data;
using WebApplication3.Dtos.Message;
using WebApplication3.Services;

namespace WebApplication3.Controllers
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class MessageController : ControllerBase
    {
        private IMessageService _messageService;
        private readonly DataContext _context;

        public MessageController(DataContext context, IMessageService messageService)
        {
            _context = context;
            _messageService = messageService;
        }

        [HttpPost("sendMessage")]
        public async Task<IActionResult> sendMessage(SendMessageDto message)
        {
            try
            {
                var sendMessage = await _messageService.sendMessage(message);
                if (sendMessage == null)
                {
                    return NotFound("sender or receipant can not be found!!!");
                }
                return Ok(sendMessage);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }



        [HttpGet("getListMessagesAccount")]
        public async Task<IActionResult> getListMessagesAccount(Guid id)
        {
            try 
            {
                var listMessages = await _messageService.getMesssagesAccount(id);
                if (listMessages == null)
                {
                    return NotFound("Account not exist!");
                }
                return Ok(listMessages);
            }
            catch(Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("getMesssagesAccount")]
        public async Task<IActionResult> getMesssagesAccount(Guid id)
        {
            try
            {
                var listMessages = await _messageService.getMesssagesAccount(id);

                return Ok(listMessages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("getConversation")]
        public async Task<IActionResult> getConversation(Guid currentUserId, Guid otherUserId)
        {
            try
            {
                var listMessages = await _messageService.getConversation(currentUserId, otherUserId);
                if (listMessages == null)
                {
                    return NotFound("Account not exist!");
                }
                return Ok(listMessages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("getMessages")]
        public async Task<IActionResult> getMessages(Guid id)
        {
            try
            {
                var listMessages = await _messageService.getMessages(id);
                if (listMessages == null)
                {
                    return NotFound("Account not exist!");
                }
                return Ok(listMessages);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
            }
        }
        [HttpGet("getMessagesFiles")]
        public async Task<IActionResult> getMessagesFiles(Guid id)
        {
            var sendMessage = await _messageService.getFiles(id);
            if (sendMessage == null)
            {
                return NotFound("Message can not be found!");
            }
            return Ok(sendMessage);
        }

        [HttpDelete("deleteMessage")]
        public async Task<IActionResult> deleteMessage(Guid idMessage)
        {
            var deleteMessage = await _messageService.deleteMessage(idMessage);

            if(!deleteMessage)
            {
                return NotFound("Message not found");
            }
            return Ok("Message deleted");
        }
    }
}
