import React from 'react';
import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  LaptopOutlined,
  TagsOutlined,
  AppstoreAddOutlined,
  ShoppingCartOutlined,
  UserOutlined, 
  LogoutOutlined,
} from '@ant-design/icons';
import { Link, Outlet, useLocation } from 'react-router-dom';

const { Header, Sider, Content, Footer } = Layout;

const AdminLayout = () => {
  const location = useLocation();
  const selectedKey = location.pathname.split('/')[2] || 'dashboard';

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/admin/dashboard">Dashboard</Link>,
    },
    {
      key: 'laptops',
      icon: <LaptopOutlined />,
      label: <Link to="/admin/laptops">Laptop</Link>,
    },
    {
      key: 'categories',
      icon: <TagsOutlined />,
      label: <Link to="/admin/categories">Danh mục</Link>,
    },
    {
      key: 'manufacturers',
      icon: <AppstoreAddOutlined />,
      label: <Link to="/admin/manufacturers">Hãng sản xuất</Link>,
    },
    {
      key: 'orders',
      icon: <ShoppingCartOutlined />,
      label: <Link to="/admin/orders">Đơn hàng</Link>, // ✅ Đơn hàng
    },
    {
       key: 'users',
       icon: <UserOutlined />,
       label: <Link to="/admin/users">Người dùng</Link>,
},
    {
      key: 'variants',
      icon: <LaptopOutlined />,
      label: <Link to="/admin/variants">Biến thể</Link>,
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: <span>Đăng xuất</span>,
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
          items={menuItems}
          style={{ height: '100%' }}
        />
      </Sider>

      <Layout>
        <Header style={{ padding: '0 24px', background: '#fff' }}>
          <h1 style={{ margin: 0, fontSize: 20 }}>Hệ thống quản trị</h1>
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
