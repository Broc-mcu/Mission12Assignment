import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Book } from '../types/Book';

export const BookList = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [totalRecords, setTotalRecords] = useState(0);
  const [sortTitle, setSortTitle] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5099/api/books`, {
        params: {
          pageNum: currentPage,
          pageSize: pageSize,
          sortTitle: sortTitle
        }
      });
      setBooks(response.data.books);
      setTotalRecords(response.data.totalRecords);
    } catch (err) {
      setError('Error fetching books from the API. Ensure the backend is running at http://localhost:5099');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [currentPage, pageSize, sortTitle]);

  const totalPages = Math.ceil(totalRecords / pageSize);

  const handleSortChange = () => {
    setSortTitle(prev => (prev === 'asc' ? 'desc' : 'asc'));
    setCurrentPage(1);
  };

  const renderSortIndicator = () => {
    if (sortTitle === 'asc') return '↑';
    if (sortTitle === 'desc') return '↓';
    return '';
  };

  return (
    <div className="container mt-5">
      <h1 className="mb-4 text-center text-primary fw-bold">Joel Hilton's Book Collection</h1>
      
      {/* Controls */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 p-3 bg-white rounded shadow-sm border">
        <div className="d-flex align-items-center mb-2 mb-md-0">
          <label className="me-2 fw-semibold text-secondary">Results per page:</label>
          <select 
            className="form-select d-inline-block w-auto shadow-sm" 
            value={pageSize} 
            onChange={(e) => {
              setPageSize(Number(e.target.value));
              setCurrentPage(1);
            }}
          >
            <option value={5}>5</option>
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={50}>50</option>
          </select>
        </div>
        <div>
          <button 
            className={`btn ${sortTitle ? 'btn-primary' : 'btn-outline-primary'} shadow-sm`} 
            onClick={handleSortChange}
            title="Sort by book title alphabetically"
          >
            Sort by Title {renderSortIndicator()}
          </button>
        </div>
      </div>

      {error && (
        <div className="alert alert-danger shadow-sm border-0" role="alert">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center my-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      ) : (
        <>
          <div className="row row-cols-1 row-cols-md-2 row-cols-xl-3 g-4">
            {books.map((book) => (
              <div key={book.bookID} className="col">
                <div className="card h-100 shadow-sm border-0 border-top border-primary border-4 rounded-3 d-flex flex-column" style={{ transition: "transform 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-dark fw-bold mb-1">{book.title}</h5>
                    <h6 className="card-subtitle mb-3 text-secondary fst-italic">by {book.author}</h6>
                    
                    <hr className="my-2 border-light" />
                    
                    <div className="flex-grow-1">
                      <p className="card-text mb-1"><small><strong>Publisher:</strong> {book.publisher}</small></p>
                      <p className="card-text mb-1"><small><strong>ISBN:</strong> {book.isbn}</small></p>
                      <p className="card-text mb-1"><small><strong>Classification:</strong> {book.classification}</small></p>
                      <p className="card-text mb-1"><small><strong>Category:</strong> {book.category}</small></p>
                      <p className="card-text mb-1"><small><strong>Pages:</strong> {book.pageCount}</small></p>
                    </div>

                    <div className="mt-auto pt-3 border-top mt-3">
                      <span className="fs-5 fw-bold text-success float-end">${book.price.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {books.length === 0 && !error && (
            <div className="alert alert-info text-center mt-4 shadow-sm border-0">
              No books found matching the current criteria.
            </div>
          )}

          {/* Dynamic Pagination based on database total items */}
          {totalPages > 0 && (
            <nav aria-label="Book collection page navigation" className="mt-5 mb-5 pb-5">
              <ul className="pagination justify-content-center">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button className="page-link shadow-sm" onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}>
                    &laquo; Prev
                  </button>
                </li>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => {
                  if (totalPages > 10 && Math.abs(page - currentPage) > 3 && page !== 1 && page !== totalPages) {
                    if (Math.abs(page - currentPage) === 4) {
                      return <li key={`dots-${page}`} className="page-item disabled"><span className="page-link">...</span></li>;
                    }
                    return null;
                  }

                  return (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button className="page-link shadow-sm" onClick={() => setCurrentPage(page)}>
                        {page}
                      </button>
                    </li>
                  )
                })}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button className="page-link shadow-sm" onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}>
                    Next &raquo;
                  </button>
                </li>
              </ul>
            </nav>
          )}
        </>
      )}
    </div>
  );
};
