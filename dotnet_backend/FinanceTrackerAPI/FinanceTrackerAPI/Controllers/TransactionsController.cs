using Microsoft.AspNetCore.Mvc;
using FinanceTrackerAPI.Models;
using FinanceTrackerAPI.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;

namespace FinanceTrackerAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class TransactionsController : ControllerBase
    {
        private ITransactionRepository _transactionRepo;
        private IUserRepository _userRepo;

        public TransactionsController(ITransactionRepository npRepo, IUserRepository userRepo)
        {
            _transactionRepo = npRepo;
            _userRepo = userRepo;
        }

        // GET: /api/v1/transactions
        [Authorize]
        [HttpGet]
        public IActionResult GetTransactions([FromHeader(Name = "Authorization")] string header, [FromQuery] string month, [FromQuery] string start, [FromQuery] string end)
        {
            var user = _userRepo.LoadUser(header);
            var transactions = _transactionRepo.GetTransactions(month, start, end, user.MacroUserId);
            return Ok(transactions);
        }

        // GET: /api/v1/transactions/:id
        [Authorize]
        [HttpGet]
        [Route("{transactionId}")]
        public IActionResult GetTransactionById([FromHeader(Name = "Authorization")] string header, int transactionId)
        {
            var user = _userRepo.LoadUser(header);
            var transaction = _transactionRepo.GetTransaction(transactionId);

            if (user.MacroUserId != transaction.MacroUserId)
            {
                return NotFound();
            }

            return Ok(transaction);
        }

        // POST: /api/v1/transactions
        [Authorize]
        [HttpPost]
        public IActionResult CreateTransaction([FromHeader(Name = "Authorization")] string header, [FromBody] Transaction transaction)
        {
            var user = _userRepo.LoadUser(header);

            if (user.Email == "guest@financetracker.app")
            {
                return Ok();
            }

            try
            {
                if(transaction == null)
                {
                    return NotFound();
                }

                var transactionEntity = _transactionRepo.CreateTransaction(transaction, user);
                return CreatedAtAction(nameof(GetTransactionById), new { transactionId = transactionEntity.TransactionId }, transactionEntity);
            }
            catch
            {
                return BadRequest();
            }
        }

        // PUT: /api/v1/transactions/:id
        [Authorize]
        [HttpPut]
        [Route("{transactionId}")]
        public IActionResult UpdateTransaction([FromHeader(Name = "Authorization")] string header, int transactionId, [FromBody] Transaction transaction)
        {
            var user = _userRepo.LoadUser(header);

            if (user.Email == "guest@financetracker.app")
            {
                return Ok();
            }

            try
            {
                if(transaction == null)
                {
                    return BadRequest("Transaction is null");
                }

                var transactionEntity = _transactionRepo.GetTransaction(transactionId);
                if (transactionEntity == null || transactionEntity.MacroUserId != user.MacroUserId)
                {
                    return NotFound();
                }

                transactionEntity = _transactionRepo.UpdateTransaction(transactionId, transaction, user);

                return Ok(transactionEntity.CategoryColor);
            }
            catch
            {
                return BadRequest();
            }
        }

        // DELETE: /api/v1/transactions/:id
        [Authorize]
        [HttpDelete]
        [Route("{transactionId}")]
        public IActionResult DeleteTransaction([FromHeader(Name = "Authorization")] string header, int transactionId)
        {
            var user = _userRepo.LoadUser(header);

            if (user.Email == "guest@financetracker.app")
            {
                return Ok();
            }

            try
            {
                var transactionEntity = _transactionRepo.GetTransaction(transactionId);
                if (transactionEntity == null || transactionEntity.MacroUserId != user.MacroUserId)
                {
                    return NotFound();
                }

                _transactionRepo.DeleteTransaction(transactionId);

                return NoContent();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
