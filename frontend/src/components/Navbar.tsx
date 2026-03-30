import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export const Navbar = () => {
  const { cartCount, cartTotal } = useCart();

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary shadow-sm mb-4">
      <div className="container">
        <Link className="navbar-brand fw-bold" to="/">Joel Hilton's Book Collection</Link>
        
        <div className="d-flex ms-auto align-items-center">
          <Link to="/cart" className="btn btn-light position-relative d-flex align-items-center">
            {/* Bootstrap feature 2: position-relative and position-absolute with translates to place a badge over a button! */}
            <span className="me-2">🛒 Cart</span>
            <span className="fw-bold">${cartTotal.toFixed(2)}</span>
            
            {cartCount > 0 && (
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger border border-light">
                {cartCount}
                <span className="visually-hidden">items in cart</span>
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
};
