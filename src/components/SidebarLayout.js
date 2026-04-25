import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  BookOutlined,
  ShoppingCartOutlined,
  OrderedListOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const { Sider, Content } = Layout;

function SidebarLayout({ currentUsername, onLogout }) {
  const location = useLocation();
  const navigate = useNavigate();

  // 根据当前路径匹配菜单选中项
  const getSelectedKey = () => {
    const path = location.pathname;
    if (path.startsWith('/books/')) return '/home';
    return path;
  };

  const handleMenuClick = ({ key }) => {
    navigate(key);
  };

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const menuItems = [
    { key: '/home', icon: <BookOutlined />, label: '图书列表' },
    { key: '/cart', icon: <ShoppingCartOutlined />, label: '我的购物车' },
    { key: '/orders', icon: <OrderedListOutlined />, label: '我的订单' },
    { key: '/profile', icon: <UserOutlined />, label: '个人信息' },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: '退出登录',
      danger: true,
      onClick: handleLogout,
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        width={220}
        style={{
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
          height: '100vh',
          overflow: 'auto',
          zIndex: 100,
          background: '#4e342e',
        }}
      >
        {/* 品牌标识区域 — 木质铭牌 */}
        <div
          style={{
            height: 64,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#f5f0e8',
            fontSize: 20,
            fontWeight: 700,
            borderBottom: '1px solid rgba(255,248,239,0.12)',
            letterSpacing: '0.04em',
          }}
        >
          <BookOutlined style={{ marginRight: 8 }} />
          电子书店
        </div>

        {/* 当前用户信息 */}
        {currentUsername && (
          <div
            style={{
              padding: '12px 24px',
              color: 'rgba(245,240,232,0.7)',
              fontSize: 14,
              borderBottom: '1px solid rgba(255,248,239,0.08)',
            }}
          >
            欢迎，{currentUsername}
          </div>
        )}

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[getSelectedKey()]}
          items={menuItems}
          onClick={handleMenuClick}
          style={{
            borderRight: 0,
            marginTop: 4,
            background: '#4e342e',
          }}
        />
      </Sider>

      <Layout style={{ marginLeft: 220 }}>
        <Content
          style={{
            padding: 24,
            minHeight: '100vh',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
}

export default SidebarLayout;
