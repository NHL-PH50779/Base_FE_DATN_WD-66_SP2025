import React from 'react';
import { Layout, Menu, Avatar } from 'antd';
import {
  DashboardOutlined,
  TagsOutlined,
  ShoppingCartOutlined,
  UserOutlined, 
  ShopOutlined,
  SettingOutlined,
  TrademarkOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';
import type { MenuProps } from 'antd';

const { Header, Sider, Content, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

const AdminLayout = () => {
  const location = useLocation();
  
  const selectedKey = location.pathname.split('/')[2] || 'dashboard';
  const getOpenKeys = () => {
    if (selectedKey === 'dashboard') return ['dashboard'];
    if (['products', 'categories', 'brands'].includes(selectedKey)) return ['product-management'];
    if (selectedKey === 'orders') return ['order-management'];
    if (selectedKey === 'users') return ['user-management'];
    return [];
  };
  
  const openKeys = getOpenKeys();

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
      key: 'system',
      icon: <SettingOutlined />,
      label: 'Hệ thống',
      children: [],
    },
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={220}>
        <div
          style={{
            height: 64,
            background: '#fff',
            margin: 16,
            textAlign: 'center',
            fontWeight: 'bold',
            lineHeight: '64px',
            borderRadius: 8,
          }}
        >
          ADMIN
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          defaultOpenKeys={openKeys}
          items={menuItems}
          style={{ height: '100%' }}
        />
      </Sider>

      <Layout>
        <Header style={{ 
          padding: '0 24px', 
          background: '#fff',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>Hệ thống quản trị</h1>
          
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              cursor: 'pointer',
              padding: '0 8px'
            }}>
              <Avatar 
                style={{ backgroundColor: '#1890ff', marginRight: 8 }}
                icon={<UserOutlined />}
              />
              <span>Admin</span>
            </div>
          </div>
        </Header>

        <Content style={{ margin: '16px' }}>
          <div
            style={{
              background: '#fff',
              padding: 24,
              minHeight: 360,
              borderRadius: 8,
            }}
          >
            <Outlet />
          </div>
        </Content>

        <Footer style={{ textAlign: 'center' }}>
          © {new Date().getFullYear()} Quản trị laptop - Dự án tốt nghiệp
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AdminLayout;