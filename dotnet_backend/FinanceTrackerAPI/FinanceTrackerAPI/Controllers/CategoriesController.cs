using Microsoft.AspNetCore.Mvc;
using FinanceTrackerAPI.Models;
using FinanceTrackerAPI.Repository.IRepository;
using Microsoft.AspNetCore.Authorization;

namespace FinanceTrackerAPI.Controllers
{
    [Route("api/v1/[controller]")]
    [ApiController]
    public class CategoriesController : ControllerBase
    {
        private ICategoryRepository _categoryRepo;
        private IUserRepository _userRepo;

        public CategoriesController(ICategoryRepository categoryRepo, IUserRepository userRepo)
        {
            _categoryRepo = categoryRepo;
            _userRepo = userRepo;
        }

        // GET: /api/v1/categories
        [Authorize]
        [HttpGet]
        public IActionResult GetCategories([FromHeader(Name = "Authorization")] string header, [FromQuery] string month, [FromQuery] string start, [FromQuery] string end)
        {
            var user = _userRepo.LoadUser(header);
            var categories = _categoryRepo.GetCategories(month, start, end, user.MacroUserId);
            return Ok(categories);
        }

        // GET: /api/v1/categories/:id
        [Authorize]
        [HttpGet]
        [Route("{categoryId}")]
        public IActionResult GetCategoryById([FromHeader(Name = "Authorization")] string header, int categoryId)
        {
            var user = _userRepo.LoadUser(header);
            var category = _categoryRepo.GetCategory(categoryId);

            if (category.MacroUserId != user.MacroUserId)
            {
                return NotFound();
            }

            return Ok(category);
        }

        // PUT: /api/v1/categories/:id
        [Authorize]
        [HttpPut]
        [Route("{categoryId}")]
        public IActionResult UpdateCategory([FromHeader(Name = "Authorization")] string header, int categoryId, [FromBody] Category category)
        {
            var user = _userRepo.LoadUser(header);

            if (user.Email == "guest@financetracker.app")
            {
                return Ok();
            }

            try
            {
                if (category == null)
                {
                    return BadRequest("Category is null");
                }

                var categoryEntity = _categoryRepo.GetCategory(categoryId);
                if (categoryEntity == null || categoryEntity.MacroUserId != user.MacroUserId)
                {
                    return NotFound();
                }

                _categoryRepo.UpdateCategory(categoryId, category);

                return NoContent();
            }
            catch
            {
                return BadRequest();
            }
        }
    }
}
