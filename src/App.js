import { useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import 'antd/dist/reset.css';
import './App.css';
import Home from './pages/Home';
import BookDetail from './pages/BookDetail';
import Cart from './pages/Cart';
import Orders from './pages/Orders';
import { CartProvider } from './contexts/CartContext';
import { OrderProvider } from './contexts/OrderContext';
import LoginPage from './pages/LoginPage';
import Register from './pages/Register';
import Profile from './pages/Profile';
import SidebarLayout from './components/SidebarLayout';

const CURRENT_USER_STORAGE_KEY = 'ebook_current_user';

const themeConfig = {
  token: {
    colorPrimary: '#5b8c85',
    borderRadius: 6,
    fontFamily:
      "'Noto Serif SC', 'Songti SC', 'STSong', 'Times New Roman', serif",
    colorText: '#4a4a4a',
    colorBgContainer: '#fcfaf8',
    colorBorder: '#d9d0c5',
    colorTextPlaceholder: '#b0a89c',
    colorLink: '#5b8c85',
    colorLinkHover: '#7aa39a',
  },
  components: {
    Layout: {
      headerBg: '#4e342e',
      bodyBg: '#f4ead5',
      siderBg: '#4e342e',
      triggerBg: '#3e2a25',
      triggerHeight: 48,
    },
    Menu: {
      darkItemBg: '#4e342e',
      darkItemColor: '#f5f0e8',
      darkItemSelectedBg: '#3e2a25',
      darkItemSelectedColor: '#fff8ef',
      darkItemHoverBg: '#5c4033',
      darkItemHoverColor: '#fff8ef',
      darkSubMenuItemBg: '#3e2a25',
      darkPopupBg: '#4e342e',
      itemBorderRadius: 8,
    },
    Button: {
      primaryShadow: '0 4px 12px rgba(78, 52, 46, 0.25)',
    },
    Card: {
      colorBgContainer: '#fdf8f2',
    },
  },
};

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
    <ConfigProvider theme={themeConfig}>
      <CartProvider currentUsername={currentUsername}>
        <OrderProvider currentUsername={currentUsername}>
          <Routes>
            {/* ===== 无侧边栏的路由 ===== */}
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

            {/* ===== 带侧边栏的路由（包裹在 SidebarLayout 中） ===== */}
            <Route
              element={
                <SidebarLayout
                  currentUsername={currentUsername}
                  onLogout={handleLogout}
                />
              }
            >
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
            </Route>

            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </OrderProvider>
      </CartProvider>
    </ConfigProvider>
  );
}

export default App;
