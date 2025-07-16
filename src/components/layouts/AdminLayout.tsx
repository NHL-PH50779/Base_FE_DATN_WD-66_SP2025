import React, { useState, useEffect } from 'react';
import { Layout, Menu, Avatar, Dropdown, message, Switch, notification } from 'antd';
import './AdminLayout.css';

import {
  DashboardOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  UserOutlined, 
  ShopOutlined,
  SettingOutlined,
  TrademarkOutlined,
  LogoutOutlined,
  AppstoreOutlined,
  CommentOutlined,
  StarOutlined,
  GiftOutlined,
  FireOutlined,
  BulbOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import type { MenuProps } from 'antd';
import { authService } from '../../services/auth.service';
import NotificationBell from '../common/NotificationBell';

const { Header, Sider, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const user = authService.getUser();
  const [collapsed, setCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  
  useEffect(() => {
    localStorage.setItem('darkMode', darkMode.toString());
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  }, [darkMode]);
  
  const selectedKey = location.pathname.split('/')[2] || 'dashboard';
  const getOpenKeys = () => {
    if (selectedKey === 'dashboard') return ['dashboard'];
    if (['products', 'categories', 'brands', 'attributes'].includes(selectedKey)) return ['product-management'];
    if (['orders', 'return-requests'].includes(selectedKey)) return ['order-management'];
    if (selectedKey === 'users') return ['user-management'];
    if (['comments', 'reviews', 'vouchers'].includes(selectedKey)) return ['content-management'];
    return [];
  };
  
  const openKeys = getOpenKeys();

  const handleLogout = async () => {
    try {
      await authService.logout();
      message.success('Đăng xuất thành công');
      navigate('/login');
    } catch (error) {
      message.error('Lỗi khi đăng xuất');
    }
  };

  const showNotification = () => {
    notification.info({
      message: 'Thông báo mới',
      description: 'Có 3 đơn hàng mới cần xử lý',
      placement: 'topRight',
      duration: 4,
    });
  };

  const userMenuItems: MenuProps['items'] = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Tài khoản',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
      onClick: handleLogout,
    },
  ];

  const menuItems: MenuItem[] = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: 'product-management',
      icon: <ShopOutlined />,
      label: 'Quản lý sản phẩm',
      children: [
        {
          key: 'products',
          icon: <ShopOutlined />,
          label: <Link to="/admin/products">Sản phẩm</Link>,
        },
        {
          key: 'categories',
          icon: <TagsOutlined />,
          label: <Link to="/admin/categories">Danh mục</Link>,
        },
        {
          key: 'brands',
          icon: <TrademarkOutlined />,
          label: <Link to="/admin/brands">Thương hiệu</Link>,
        },
        {
          key: 'attributes',
          icon: <AppstoreOutlined />,
          label: <Link to="/admin/attributes">Thuộc tính</Link>,
        },
      ],
    },
    {
      key: 'order-management',
      icon: <ShoppingCartOutlined />,
      label: 'Quản lý đơn hàng',
      children: [
        {
          key: 'orders',
          icon: <ShoppingCartOutlined />,
          label: <Link to="/admin/orders">Đơn hàng</Link>,
        },
        {
          key: 'return-requests',
          icon: <ShoppingCartOutlined />,
          label: <Link to="/admin/return-requests">Hoàn hàng</Link>,
        },
      ],
    },
    {
      key: 'user-management',
      icon: <UserOutlined />,
      label: 'Quản lý người dùng',
      children: [
        {
          key: 'users',
          icon: <UserOutlined />,
          label: <Link to="/admin/users">Người dùng</Link>,
        },
      ],
    },
    {
      key: 'content-management',
      icon: <CommentOutlined />,
      label: 'Quản lý nội dung',
      children: [
        {
          key: 'comments',
          icon: <CommentOutlined />,
          label: <Link to="/admin/comments">Bình luận</Link>,
        },
        {
          key: 'reviews',
          icon: <StarOutlined />,
          label: <Link to="/admin/reviews">Đánh giá</Link>,
        },
        {
          key: 'vouchers',
          icon: <GiftOutlined />,
          label: <Link to="/admin/vouchers">Voucher</Link>,
        },
        {
          key: 'flash-sales',
          icon: <FireOutlined />,
          label: <Link to="/admin/flash-sales">Flash Sale</Link>,
        },
      ],
    },
    {
      key: 'system',
      icon: <SettingOutlined />,
      label: 'Hệ thống',
      children: [],
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)' }}>
      <Sider 
        width={280}
        collapsed={collapsed}
        collapsible
        trigger={null}
        breakpoint="lg"
        onBreakpoint={(broken) => setCollapsed(broken)}
        style={{
          background: darkMode 
            ? 'linear-gradient(180deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(180deg, #1e293b 0%, #334155 100%)',
          boxShadow: '4px 0 20px rgba(0,0,0,0.1)',
          transition: 'all 0.3s ease'
        }}
      >
        <div
          style={{
            height: 80,
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            margin: '16px 16px 24px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 16,
            color: '#fff',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(10px)'
          }} />
          <div style={{ 
            position: 'relative', 
            zIndex: 1, 
            display: 'flex', 
            alignItems: 'center', 
            gap: 12 
          }}>
            <img 
              src="/logo.png" 
              alt="Logo" 
              style={{ 
                height: 40, 
                width: 40, 
                objectFit: 'contain'
              }} 
            />
            <span style={{ fontSize: '18px', fontWeight: 'bold' }}>TECHSTORE</span>
          </div>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={menuItems}
          style={{ 
            background: 'transparent',
            border: 'none',
            fontSize: '14px'
          }}

        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: '0 32px', 
          background: darkMode 
            ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
            : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 2px 20px rgba(0,0,0,0.08)',
          borderBottom: '1px solid rgba(0,0,0,0.06)',
          transition: 'all 0.3s ease'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setCollapsed(!collapsed)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
                color: darkMode ? '#fff' : '#333',
                padding: 8,
                borderRadius: 6,
                transition: 'all 0.3s ease'
              }}
            >
              {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            </button>
            <h1 style={{ 
              margin: 0, 
              fontSize: 24, 
              background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700
            }}>
              🏢 Hệ thống Quản trị
            </h1>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <BulbOutlined style={{ color: darkMode ? '#fff' : '#333' }} />
              <Switch
                checked={darkMode}
                onChange={setDarkMode}
                size="small"
                checkedChildren="🌙"
                unCheckedChildren="☀️"
              />
            </div>
            <button
              onClick={showNotification}
              style={{
                background: 'none',
                border: 'none',
                fontSize: 18,
                cursor: 'pointer',
                color: darkMode ? '#fff' : '#333',
                padding: 8,
                borderRadius: 6,
                position: 'relative'
              }}
            >
              <BellOutlined />
              <span style={{
                position: 'absolute',
                top: 2,
                right: 2,
                width: 8,
                height: 8,
                background: '#ff4d4f',
                borderRadius: '50%'
              }} />
            </button>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div style={{ 
                display: 'flex', 
                alignItems: 'center', 
                cursor: 'pointer',
                padding: '8px 16px',
                borderRadius: 12,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                color: '#fff',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(59, 130, 246, 0.4)'
              }}>
                <Avatar 
                  style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)', 
                    marginRight: 12,
                    border: '2px solid rgba(255,255,255,0.3)'
                  }}
                  icon={<UserOutlined />}
                />
                <span style={{ fontWeight: 500 }}>{user?.name || 'Admin'}</span>
              </div>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ 
          margin: '24px',
          background: 'transparent'
        }}>
          <div
            style={{
              background: darkMode 
                ? 'linear-gradient(135deg, #1e293b 0%, #334155 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              padding: 32,
              minHeight: 'calc(100vh - 200px)',
              borderRadius: 20,
              boxShadow: '0 20px 60px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(20px)',
              transition: 'all 0.3s ease',
              color: darkMode ? '#fff' : '#333'
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ 
          textAlign: 'center',
          background: 'transparent',
          color: 'rgba(255,255,255,0.8)',
          fontWeight: 500
        }}>
          © {new Date().getFullYear()} 💻 Laptop Store Admin - Made with ❤️
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;