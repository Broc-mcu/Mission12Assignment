import { useState } from 'react';
import type { Book } from '../types/Book';

interface EditBookFormProps {
  book: Book;
  onSubmit: (book: Book) => void;
  onCancel: () => void;
}

export const EditBookForm = ({ book, onSubmit, onCancel }: EditBookFormProps) => {
  const [formData, setFormData] = useState<Book>({ ...book });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'pageCount'
          ? parseInt(value) || 0
          : name === 'price'
            ? parseFloat(value) || 0
            : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card shadow-sm p-4">
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label fw-semibold">Title</label>
          <input
            type="text"
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Author</label>
          <input
            type="text"
            className="form-control"
            name="author"
            value={formData.author}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Publisher</label>
          <input
            type="text"
            className="form-control"
            name="publisher"
            value={formData.publisher}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">ISBN</label>
          <input
            type="text"
            className="form-control"
            name="isbn"
            value={formData.isbn}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Classification</label>
          <input
            type="text"
            className="form-control"
            name="classification"
            value={formData.classification}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Category</label>
          <input
            type="text"
            className="form-control"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Page Count</label>
          <input
            type="number"
            className="form-control"
            name="pageCount"
            value={formData.pageCount}
            onChange={handleChange}
            required
            min={1}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label fw-semibold">Price ($)</label>
          <input
            type="number"
            className="form-control"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            min={0}
            step={0.01}
          />
        </div>
      </div>

      <div className="mt-4 d-flex gap-2">
        <button type="submit" className="btn btn-primary">
          {book.bookID === 0 ? 'Add Book' : 'Save Changes'}
        </button>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
