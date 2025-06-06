import React from "react";
import { Card, Col, Row, Statistic } from "antd";
import {
  LaptopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard: React.FC = () => {
  const stats = {
    laptops: 25,
    orders: 120,
    users: 80,
  };

  const chartData = [
    { month: "Jan", orders: 10 },
    { month: "Feb", orders: 20 },
    { month: "Mar", orders: 30 },
    { month: "Apr", orders: 40 },
    { month: "May", orders: 20 },
    { month: "Jun", orders: 50 },
  ];

  return (
    <div>
      <h2>Thống kê tổng quan</h2>
      <Row gutter={16}>
        <Col span={8}>
          <Card>
            <Statistic
              title="Laptop"
              value={stats.laptops}
              prefix={<LaptopOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Đơn hàng"
              value={stats.orders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Người dùng"
              value={stats.users}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <h3 style={{ marginTop: 32 }}>Đơn hàng theo tháng</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="orders" fill="#1890ff" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default Dashboard;
