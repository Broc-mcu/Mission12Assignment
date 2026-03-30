import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

export const CartView = () => {
  const { cartItems, updateQuantity, removeFromCart, cartTotal, clearCart } = useCart();
  const navigate = useNavigate();

  return (
    <div className="container mt-4">
      <h2 className="mb-4 text-primary fw-bold">Your Shopping Cart</h2>
      
      {cartItems.length === 0 ? (
        <div className="alert alert-info shadow-sm p-4 text-center border-0 rounded-3">
          <p className="fs-5 mb-3">Your cart is currently empty!</p>
          <button className="btn btn-primary px-4" onClick={() => navigate(-1)}>
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card shadow-sm border-0 rounded-3">
              <div className="card-body p-0">
                <ul className="list-group list-group-flush rounded-3">
                  {cartItems.map((item) => (
                    <li key={item.book.bookID} className="list-group-item p-4">
                      <div className="row align-items-center">
                        <div className="col-md-5">
                          <h5 className="mb-1 text-dark fw-bold">{item.book.title}</h5>
                          <p className="mb-0 text-muted small">by {item.book.author}</p>
                        </div>
                        <div className="col-md-3 text-md-center mt-3 mt-md-0">
                          <div className="input-group input-group-sm w-75 mx-auto shadow-sm shadow-sm">
                            <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.book.bookID, item.quantity - 1)}>-</button>
                            <input type="text" className="form-control text-center bg-white" value={item.quantity} readOnly />
                            <button className="btn btn-outline-secondary" onClick={() => updateQuantity(item.book.bookID, item.quantity + 1)}>+</button>
                          </div>
                        </div>
                        <div className="col-md-2 text-md-end mt-3 mt-md-0 fw-bold text-success">
                          ${(item.book.price * item.quantity).toFixed(2)}
                        </div>
                        <div className="col-md-2 text-md-end mt-3 mt-md-0">
                          <button 
                            className="btn btn-sm btn-outline-danger shadow-sm border-0" 
                            title="Remove item"
                            onClick={() => removeFromCart(item.book.bookID)}
                          >
                            Remove
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card shadow-sm border-0 rounded-3 bg-light">
              <div className="card-body p-4">
                <h4 className="card-title fw-bold mb-4">Order Summary</h4>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-secondary">Subtotal</span>
                  <span className="fw-semibold">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-3">
                  <span className="text-secondary">Shipping</span>
                  <span className="fw-semibold text-success">Free</span>
                </div>
                <hr className="my-3"/>
                <div className="d-flex justify-content-between mb-4">
                  <span className="fs-5 fw-bold">Total</span>
                  <span className="fs-5 fw-bold text-primary">${cartTotal.toFixed(2)}</span>
                </div>
                <button className="btn btn-primary w-100 py-2 mb-3 shadow-sm fw-bold">
                  Proceed to Checkout
                </button>
                <button 
                  className="btn btn-outline-secondary w-100 py-2"
                  onClick={() => navigate(-1)}
                >
                  Continue Shopping
                </button>
                <button 
                  className="btn btn-link text-danger text-decoration-none w-100 mt-2"
                  onClick={clearCart}
                >
                  Clear Cart
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
