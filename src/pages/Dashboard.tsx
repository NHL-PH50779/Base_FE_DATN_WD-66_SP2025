import React from "react";
import { Card, Col, Row, Statistic, List, Badge } from "antd";
import {
  LaptopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
} from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const Dashboard: React.FC = () => {
  const stats = {
    laptops: 25,
    orders: 120,
    users: 80,
    revenue: 150000000,
  };

  const revenueData = [
    { month: "Jan", revenue: 20000000 },
    { month: "Feb", revenue: 25000000 },
    { month: "Mar", revenue: 30000000 },
    { month: "Apr", revenue: 35000000 },
    { month: "May", revenue: 20000000 },
    { month: "Jun", revenue: 20000000 },
  ];

  const bestSellers = [
    { name: "Laptop Dell XPS 13", sold: 30 },
    { name: "MacBook Air M2", sold: 25 },
    { name: "HP Envy 15", sold: 20 },
  ];

  const notifications = [
    {
      type: "order",
      content: "Có 2 đơn hàng mới chờ xử lý.",
    },
    {
      type: "stock",
      content: "Laptop HP Envy 15 sắp hết hàng (còn 2 chiếc).",
    },
  ];

  const COLORS = ["#1890ff", "#52c41a", "#faad14"];

  return (
    <div>
      <h2 style={{ color: "#1890ff", fontWeight: 700 }}>Thống kê tổng quan</h2>
      <Row gutter={16}>
        <Col span={6}>
          <Card style={{ borderTop: "4px solid #1890ff" }}>
            <Statistic
              title="Sản phẩm"
              value={stats.laptops}
              prefix={<LaptopOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderTop: "4px solid #52c41a" }}>
            <Statistic
              title="Đơn hàng"
              value={stats.orders}
              prefix={<ShoppingCartOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderTop: "4px solid #faad14" }}>
            <Statistic
              title="Người dùng"
              value={stats.users}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderTop: "4px solid #f5222d" }}>
            <Statistic
              title="Doanh thu"
              value={stats.revenue.toLocaleString("vi-VN") + " ₫"}
              prefix={<DollarOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={24} style={{ marginTop: 32 }}>
        <Col span={16}>
          <Card
            title={
              <span style={{ color: "#1890ff" }}>Doanh thu theo tháng</span>
            }
            style={{ marginBottom: 24, borderRadius: 12 }}
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="revenue" fill="#1890ff" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card
            title={
              <span style={{ color: "#52c41a" }}>Sản phẩm bán chạy</span>
            }
            style={{ borderRadius: 12 }}
          >
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={bestSellers}
                  dataKey="sold"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {bestSellers.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card
            title={
              <span style={{ color: "#faad14" }}>
                <ExclamationCircleOutlined /> Thông báo
              </span>
            }
            style={{ borderRadius: 12, minHeight: 530 }}
          >
            <List
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item>
                  <Badge
                    status={item.type === "order" ? "processing" : "error"}
                    text={item.content}
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard;
