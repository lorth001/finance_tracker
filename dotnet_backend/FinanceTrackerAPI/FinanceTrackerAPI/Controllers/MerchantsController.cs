using Microsoft.AspNetCore.Mvc;
using FinanceTrackerAPI.Models;
using FinanceTrackerAPI.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;

namespace FinanceTrackerAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class MerchantsController : ControllerBase
    {
        private IMerchantRepository _merchantRepo;
        private IUserRepository _userRepo;

        public MerchantsController(IMerchantRepository merchantRepo, IUserRepository userRepo)
        {
            _merchantRepo = merchantRepo;
            _userRepo = userRepo;
        }

        // GET: /api/v1/merchants
        [Authorize]
        [HttpGet]
        public IActionResult GetMerchants([FromHeader(Name = "Authorization")] string header, [FromQuery] string month, [FromQuery] string start, [FromQuery] string end)
        {
            var user = _userRepo.LoadUser(header);
            var merchants = _merchantRepo.GetMerchants(month, start, end, user.MacroUserId);
            return Ok(merchants);
        }

        // GET: /api/v1/merchants/:id
        [Authorize]
        [HttpGet]
        [Route("{merchantId}")]
        public IActionResult GetMerchantById([FromHeader(Name = "Authorization")] string header, int merchantId)
        {
            var user = _userRepo.LoadUser(header);
            var merchant = _merchantRepo.GetMerchant(merchantId);

            if (user.MacroUserId != merchant.MacroUserId)
            {
                return NotFound();
            }

            return Ok(merchant);
        }
    }
}
