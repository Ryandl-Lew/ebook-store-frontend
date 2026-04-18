import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import { CartProvider } from './CartContext';
import { OrderProvider } from './OrderContext';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import Profile from './pages/Profile';

const CURRENT_USER_STORAGE_KEY = 'ebook_current_user';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUsername, setCurrentUsername] = useState(
    () => localStorage.getItem(CURRENT_USER_STORAGE_KEY) || ''
  );

  const handleLoginSuccess = (username) => {
    setIsAuthenticated(true);
    setCurrentUsername(username);
    localStorage.setItem(CURRENT_USER_STORAGE_KEY, username);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUsername('');
    localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
  };

  return (
    <CartProvider currentUsername={currentUsername}>
      <OrderProvider currentUsername={currentUsername}>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? (
                <Navigate to="/home" replace />
              ) : (
                <LoginPage onLoginSuccess={handleLoginSuccess} />
              )
            }
          />
          <Route
            path="/register"
            element={isAuthenticated ? <Navigate to="/home" replace /> : <Register />}
          />
          <Route
            path="/home"
            element={isAuthenticated ? <Home /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/books/:id"
            element={isAuthenticated ? <BookDetail /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/cart"
            element={isAuthenticated ? <Cart /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/orders"
            element={isAuthenticated ? <Orders /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/profile"
            element={
              isAuthenticated ? (
                <Profile currentUsername={currentUsername} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </OrderProvider>
    </CartProvider>
  );
}

export default App;
