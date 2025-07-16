import React from "react";
import { Card, Col, Row, Statistic, List, Badge } from "antd";
import { axiosInstance } from "../utils/axios.util";
import { dashboardService } from '../services/dashboard.service';
import CommentReviewStats from '../components/dashboard/CommentReviewStats';
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
  const [stats, setStats] = React.useState({
    laptops: 0,
    orders: 0,
    users: 0,
    revenue: 0,
    categories: 0,
    ordersByStatus: [] as Array<{status_id: number, status_name: string, count: number}>,
    thisMonth: { orders: 0, revenue: 0 }
  });
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    fetchStats();
    // Auto refresh mỗi 10 giây
    const interval = setInterval(fetchStats, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchStats = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getStats();
      const data = response.data;
      
      setStats({
        laptops: data.totals?.products || 0,
        orders: data.totals?.orders || 0,
        users: data.totals?.users || 0,
        revenue: data.totals?.revenue || 0,
        categories: data.totals?.categories || 0,
        ordersByStatus: data.orders_by_status || [],
        thisMonth: data.this_month || { orders: 0, revenue: 0 }
      });
      
      // Cập nhật doanh thu theo tháng từ API
      if (data.monthly_revenue) {
        setRevenueData(data.monthly_revenue);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        laptops: 0,
        orders: 0,
        users: 0,
        revenue: 0,
        categories: 0,
        ordersByStatus: [],
        thisMonth: { orders: 0, revenue: 0 }
      });
    } finally {
      setLoading(false);
    }
  };

  const [revenueData, setRevenueData] = React.useState([
    { month: "Jan", revenue: 0 },
    { month: "Feb", revenue: 0 },
    { month: "Mar", revenue: 0 },
    { month: "Apr", revenue: 0 },
    { month: "May", revenue: 0 },
    { month: "Jun", revenue: 0 },
    { month: "Jul", revenue: 0 },
    { month: "Aug", revenue: 0 },
    { month: "Sep", revenue: 0 },
    { month: "Oct", revenue: 0 },
    { month: "Nov", revenue: 0 },
    { month: "Dec", revenue: 0 },
  ]);

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

  const getStatusColor = (statusId: number) => {
    const colors = {
      1: '#faad14', // Chờ xác nhận
      2: '#1890ff', // Đã xác nhận
      3: '#13c2c2', // Đang giao
      4: '#52c41a', // Đã giao
      5: '#f5222d'  // Đã hủy
    };
    return colors[statusId as keyof typeof colors] || '#faad14';
  };

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
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderTop: "4px solid #52c41a" }}>
            <Statistic
              title="Đơn hàng"
              value={stats.orders}
              prefix={<ShoppingCartOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderTop: "4px solid #faad14" }}>
            <Statistic
              title="Người dùng"
              value={stats.users}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card style={{ borderTop: "4px solid #f5222d" }}>
            <Statistic
              title="Doanh thu"
              value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenue)}
              prefix={<DollarOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Thống kê danh mục và tháng này */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={8}>
          <Card style={{ borderTop: "4px solid #722ed1" }}>
            <Statistic
              title="Danh mục"
              value={stats.categories}
              prefix={<LaptopOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderTop: "4px solid #13c2c2" }}>
            <Statistic
              title="Đơn hàng tháng này"
              value={stats.thisMonth.orders}
              prefix={<ShoppingCartOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderTop: "4px solid #eb2f96" }}>
            <Statistic
              title="Doanh thu tháng này"
              value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.thisMonth.revenue)}
              prefix={<DollarOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      {/* Thống kê đơn hàng theo trạng thái */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title={<span style={{ color: "#1890ff" }}>Thống kê đơn hàng theo trạng thái</span>} style={{ borderRadius: 12 }}>
            <Row gutter={16}>
              {stats.ordersByStatus.map((status) => (
                <Col span={6} key={status.status_id}>
                  <Card size="small" style={{ textAlign: 'center', marginBottom: 8 }}>
                    <Statistic
                      title={status.status_name}
                      value={status.count}
                      valueStyle={{ color: getStatusColor(status.status_id) }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Thống kê bình luận và đánh giá */}
      <Row gutter={16} style={{ marginTop: 16 }}>
        <Col span={24}>
          <CommentReviewStats />
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
