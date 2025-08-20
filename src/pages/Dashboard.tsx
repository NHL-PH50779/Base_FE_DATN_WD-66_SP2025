import React from "react";
import { Card, Col, Row, Statistic, List, Badge, Typography } from "antd";
import { axiosInstance } from "../utils/axios.util";
import { dashboardService } from '../services/dashboard.service';
import CommentReviewStats from '../components/dashboard/CommentReviewStats';
import DashboardFilters from '../components/dashboard/DashboardFilters';
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
import dayjs from 'dayjs';

const { Title } = Typography;

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
  
  // Filter states
  const [dateRange, setDateRange] = React.useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const [timeFilter, setTimeFilter] = React.useState<string>('all');
  const [statusFilter, setStatusFilter] = React.useState<string>('all');
  const [categoryFilter, setCategoryFilter] = React.useState<string>('all');

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

  const handleFilterChange = () => {
    fetchStats();
  };

  const resetFilters = () => {
    setDateRange(null);
    setTimeFilter('all');
    setStatusFilter('all');
    setCategoryFilter('all');
    fetchStats();
  };

  return (
    <div>
      {/* Bộ lọc Dashboard */}
      <DashboardFilters
        timeFilter={timeFilter}
        setTimeFilter={setTimeFilter}
        dateRange={dateRange}
        setDateRange={setDateRange}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        onApplyFilters={handleFilterChange}
        onResetFilters={resetFilters}
        onRefresh={fetchStats}
        loading={loading}
      />

      {/* Thống kê tổng quan */}
      <Title level={3} style={{ color: "#1890ff", marginBottom: 16 }}>📊 Thống kê tổng quan</Title>
      <Row gutter={16}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderTop: "4px solid #1890ff", borderRadius: 8, marginBottom: 16 }}>
            <Statistic
              title="Tổng sản phẩm"
              value={stats.laptops}
              prefix={<LaptopOutlined />}
              loading={loading}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderTop: "4px solid #52c41a", borderRadius: 8, marginBottom: 16 }}>
            <Statistic
              title="Tổng đơn hàng"
              value={stats.orders}
              prefix={<ShoppingCartOutlined />}
              loading={loading}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderTop: "4px solid #faad14", borderRadius: 8, marginBottom: 16 }}>
            <Statistic
              title="Tổng người dùng"
              value={stats.users}
              prefix={<UserOutlined />}
              loading={loading}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderTop: "4px solid #f5222d", borderRadius: 8, marginBottom: 16 }}>
            <Statistic
              title="Tổng doanh thu"
              value={new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(stats.revenue)}
              prefix={<DollarOutlined />}
              loading={loading}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Thống kê theo thời gian */}
      <Title level={4} style={{ color: "#52c41a", marginTop: 24, marginBottom: 16 }}>📈 Thống kê theo thời gian</Title>
      <Row gutter={16}>
        <Col span={8}>
          <Card style={{ borderTop: "4px solid #722ed1", borderRadius: 8 }}>
            <Statistic
              title="Danh mục sản phẩm"
              value={stats.categories}
              prefix={<LaptopOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderTop: "4px solid #13c2c2", borderRadius: 8 }}>
            <Statistic
              title="Đơn hàng tháng này"
              value={stats.thisMonth.orders}
              prefix={<ShoppingCartOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card style={{ borderTop: "4px solid #eb2f96", borderRadius: 8 }}>
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
      <Title level={4} style={{ color: "#faad14", marginTop: 24, marginBottom: 16 }}>🛒 Phân tích đơn hàng</Title>
      <Row gutter={16}>
        <Col span={24}>
          <Card title={<span style={{ color: "#1890ff" }}>📋 Thống kê đơn hàng theo trạng thái</span>} style={{ borderRadius: 12 }}>
            <Row gutter={16}>
              {stats.ordersByStatus.map((status) => (
                <Col span={6} key={status.status_id}>
                  <Card 
                    size="small" 
                    style={{ 
                      textAlign: 'center', 
                      marginBottom: 8,
                      borderLeft: `4px solid ${getStatusColor(status.status_id)}`,
                      borderRadius: 8
                    }}
                  >
                    <Statistic
                      title={status.status_name}
                      value={status.count}
                      valueStyle={{ color: getStatusColor(status.status_id), fontWeight: 'bold' }}
                    />
                  </Card>
                </Col>
              ))}
            </Row>
          </Card>
        </Col>
      </Row>

      {/* Thống kê bình luận và đánh giá */}
      <Title level={4} style={{ color: "#722ed1", marginTop: 24, marginBottom: 16 }}>💬 Thống kê tương tác</Title>
      <Row gutter={16}>
        <Col span={24}>
          <CommentReviewStats />
        </Col>
      </Row>

      {/* Biểu đồ và thông báo */}
      <Title level={4} style={{ color: "#f5222d", marginTop: 32, marginBottom: 16 }}>📈 Biểu đồ & Thông báo</Title>
      <Row gutter={24}>
        <Col span={16}>
          <Card
            title={
              <span style={{ color: "#1890ff" }}>💰 Doanh thu theo tháng</span>
            }
            style={{ marginBottom: 24, borderRadius: 12 }}
          >
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={revenueData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => [new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(value)), 'Doanh thu']} />
                <Bar dataKey="revenue" fill="#1890ff" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
          <Card
            title={
              <span style={{ color: "#52c41a" }}>🏆 Sản phẩm bán chạy</span>
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
                  label={({name, value}) => `${name}: ${value}`}
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
                <ExclamationCircleOutlined /> 🔔 Thông báo quan trọng
              </span>
            }
            style={{ borderRadius: 12, minHeight: 530 }}
          >
            <List
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item style={{ padding: '12px 0' }}>
                  <Badge
                    status={item.type === "order" ? "processing" : "error"}
                    text={item.content}
                    style={{ fontSize: '14px' }}
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
