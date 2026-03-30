using Microsoft.AspNetCore.Mvc;
using Mission11Assignment.Models;
using System.Linq;

namespace Mission11Assignment.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BooksController : ControllerBase
    {
        private readonly BookstoreContext _context;

        public BooksController(BookstoreContext context)
        {
            _context = context;
        }

        [HttpGet]
        public IActionResult GetBooks(int pageNum = 1, int pageSize = 5, string sortTitle = "")
        {
            var query = _context.Books.AsQueryable();

            if (!string.IsNullOrEmpty(sortTitle))
            {
                if (sortTitle.ToLower() == "asc")
                {
                    query = query.OrderBy(b => b.Title);
                }
                else if (sortTitle.ToLower() == "desc")
                {
                    query = query.OrderByDescending(b => b.Title);
                }
            }

            int totalRecords = query.Count();
            
            var books = query
                .Skip((pageNum - 1) * pageSize)
                .Take(pageSize)
                .ToList();

            return Ok(new {
                Books = books,
                TotalRecords = totalRecords,
                CurrentPage = pageNum,
                PageSize = pageSize
            });
        }
    }
}
