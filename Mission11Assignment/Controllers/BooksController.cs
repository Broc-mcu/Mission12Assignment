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
        public IActionResult GetBooks(int pageNum = 1, int pageSize = 5, string sortTitle = "", string category = null)
        {
            var query = _context.Books.AsQueryable();

            if (!string.IsNullOrEmpty(category))
            {
                query = query.Where(b => b.Category == category);
            }

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
        [HttpGet("categories")]
        public IActionResult GetCategories()
        {
            var categories = _context.Books
                .Select(b => b.Category)
                .Distinct()
                .OrderBy(c => c)
                .ToList();
            
            return Ok(categories);
        }

        [HttpPost]
        public IActionResult AddBook([FromBody] Book book)
        {
            _context.Books.Add(book);
            _context.SaveChanges();
            return Ok(book);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateBook(int id, [FromBody] Book book)
        {
            var existing = _context.Books.Find(id);
            if (existing == null)
            {
                return NotFound();
            }

            existing.Title = book.Title;
            existing.Author = book.Author;
            existing.Publisher = book.Publisher;
            existing.ISBN = book.ISBN;
            existing.Classification = book.Classification;
            existing.Category = book.Category;
            existing.PageCount = book.PageCount;
            existing.Price = book.Price;

            _context.SaveChanges();
            return Ok(existing);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteBook(int id)
        {
            var book = _context.Books.Find(id);
            if (book == null)
            {
                return NotFound();
            }

            _context.Books.Remove(book);
            _context.SaveChanges();
            return NoContent();
        }
    }
}
