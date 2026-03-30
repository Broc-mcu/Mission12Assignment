import { Routes, Route } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { BookList } from './components/BookList';
import { CartView } from './components/CartView';
import './App.css';

function App() {
  return (
    <div className="bg-light min-vh-100 pb-5">
      <Navbar />
      <Routes>
        <Route path="/" element={<BookList />} />
        <Route path="/cart" element={<CartView />} />
      </Routes>
    </div>
  );
}

export default App;
