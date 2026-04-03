import { useState, useEffect } from 'react';
import axios from 'axios';
import type { Book } from '../types/Book';
import { EditBookForm } from './EditBookForm';

const API_URL = 'https://mission13-bookstore-broc-angyahdzg5hqadf0.eastus2-01.azurewebsites.net/api/books';

export const AdminBooks = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const fetchAllBooks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(API_URL, {
        params: { pageNum: 1, pageSize: 1000 },
      });
      setBooks(response.data.books);
    } catch {
      setError('Failed to fetch books. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllBooks();
  }, []);

  const handleDelete = async (bookID: number) => {
    if (!window.confirm('Are you sure you want to delete this book?')) return;
    try {
      await axios.delete(`${API_URL}/${bookID}`);
      setBooks((prev) => prev.filter((b) => b.bookID !== bookID));
    } catch {
      alert('Failed to delete the book.');
    }
  };

  const handleEditSubmit = async (book: Book) => {
    try {
      await axios.put(`${API_URL}/${book.bookID}`, book);
      setEditingBook(null);
      fetchAllBooks();
    } catch {
      alert('Failed to update the book.');
    }
  };

  const handleAddSubmit = async (book: Book) => {
    try {
      await axios.post(API_URL, book);
      setShowAddForm(false);
      fetchAllBooks();
    } catch {
      alert('Failed to add the book.');
    }
  };

  if (loading) {
    return (
      <div className="container mt-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger">{error}</div>
      </div>
    );
  }

  if (editingBook) {
    return (
      <div className="container mt-5">
        <h1 className="mb-4 text-primary fw-bold">Edit Book</h1>
        <EditBookForm
          book={editingBook}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingBook(null)}
        />
      </div>
    );
  }

  if (showAddForm) {
    return (
      <div className="container mt-5">
        <h1 className="mb-4 text-primary fw-bold">Add New Book</h1>
        <EditBookForm
          book={{
            bookID: 0,
            title: '',
            author: '',
            publisher: '',
            isbn: '',
            classification: '',
            category: '',
            pageCount: 0,
            price: 0,
          }}
          onSubmit={handleAddSubmit}
          onCancel={() => setShowAddForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="text-primary fw-bold mb-0">Admin - Manage Books</h1>
        <button
          className="btn btn-success shadow-sm"
          onClick={() => setShowAddForm(true)}
        >
          + Add Book
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-striped table-hover align-middle shadow-sm">
          <thead className="table-primary">
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>ISBN</th>
              <th className="text-end">Price</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {books.map((book) => (
              <tr key={book.bookID}>
                <td className="fw-semibold">{book.title}</td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>
                  <small className="text-muted">{book.isbn}</small>
                </td>
                <td className="text-end fw-bold text-success">
                  ${book.price.toFixed(2)}
                </td>
                <td className="text-center">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => setEditingBook(book)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(book.bookID)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {books.length === 0 && (
        <div className="alert alert-info text-center mt-4">
          No books found in the database.
        </div>
      )}
    </div>
  );
};
