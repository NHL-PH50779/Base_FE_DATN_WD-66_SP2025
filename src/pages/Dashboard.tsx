import React from "react";
import { Card, Col, Row, Statistic, List, Badge, Typography, Button, Table, Progress } from "antd";
import { useNavigate } from "react-router-dom";
import { dashboardService } from '../services/dashboard.service';
import {
  LaptopOutlined,
  ShoppingCartOutlined,
  UserOutlined,
  DollarOutlined,
  ExclamationCircleOutlined,
  TrophyOutlined,
  WarningOutlined,
  EyeOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
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
  LineChart,
  Line,
  Area,
  AreaChart,
} from "recharts";
import dayjs from 'dayjs';

const { Title } = Typography;

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = React.useState<any>({});
  const [loading, setLoading] = React.useState(false);
  const [period, setPeriod] = React.useState('30days');

  React.useEffect(() => {
    fetchDashboardData();
  }, [period]);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await dashboardService.getStats({ period });
      console.log('Dashboard data received:', response.data);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { 
      style: 'currency', 
      currency: 'VND' 
    }).format(value);
  };

  const COLORS = ["#1890ff", "#52c41a", "#faad14", "#f5222d", "#722ed1", "#13c2c2"];

  const topProductColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <img 
            src={record.thumbnail || '/placeholder.jpg'} 
            alt={text}
            style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
          />
          <span 
            style={{ cursor: 'pointer', color: '#1890ff' }}
            onClick={() => navigate(`/admin/products/detail/${record.id}`)}
          >
            {text}
          </span>
        </div>
      ),
    },
    {
      title: 'Đã bán',
      dataIndex: 'total_sold',
      key: 'total_sold',
      sorter: (a: any, b: any) => a.total_sold - b.total_sold,
    },
    {
      title: 'Doanh thu',
      dataIndex: 'total_revenue',
      key: 'total_revenue',
      render: (value: number) => formatCurrency(value),
      sorter: (a: any, b: any) => a.total_revenue - b.total_revenue,
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: any) => (
        <Button 
          type="link" 
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/products/detail/${record.id}`)}
        >
          Xem
        </Button>
      ),
    },
  ];

  const lowStockColumns = [
    {
      title: 'Sản phẩm',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: any) => (
        <div>
          <div 
            style={{ cursor: 'pointer', color: '#1890ff', fontWeight: 500 }}
            onClick={() => navigate(`/admin/products/detail/${record.id}`)}
          >
            {text}
          </div>
          <small style={{ color: '#666' }}>{record.variant_name}</small>
        </div>
      ),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <Badge 
          count={stock} 
          style={{ 
            backgroundColor: stock <= 5 ? '#f5222d' : stock <= 10 ? '#faad14' : '#52c41a' 
          }} 
        />
      ),
      sorter: (a: any, b: any) => a.stock - b.stock,
    },
  ];

  return (
    <div>
      {/* Header với bộ lọc thời gian */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
          📊 Dashboard Quản Trị
        </Title>
        <div style={{ display: 'flex', gap: 8 }}>
          {['7days', '30days', '3months', '6months', '1year'].map(p => (
            <Button
              key={p}
              type={period === p ? 'primary' : 'default'}
              onClick={() => setPeriod(p)}
              size="small"
            >
              {p === '7days' ? '7 ngày' : 
               p === '30days' ? '30 ngày' :
               p === '3months' ? '3 tháng' :
               p === '6months' ? '6 tháng' : '1 năm'}
            </Button>
          ))}
        </div>
      </div>

      {/* Thống kê tổng quan */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderTop: "4px solid #1890ff", borderRadius: 8 }}>
            <Statistic
              title="Tổng đơn hàng"
              value={dashboardData?.overview?.total_orders || 0}
              prefix={<ShoppingCartOutlined />}
              loading={loading}
              valueStyle={{ color: '#1890ff' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              {dashboardData?.overview?.completion_rate || 0}% hoàn thành
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderTop: "4px solid #52c41a", borderRadius: 8 }}>
            <Statistic
              title="Doanh thu"
              value={dashboardData?.overview?.total_revenue || 0}
              formatter={(value) => formatCurrency(Number(value))}
              prefix={<DollarOutlined />}
              loading={loading}
              valueStyle={{ color: '#52c41a' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, display: 'flex', alignItems: 'center' }}>
              {(dashboardData?.overview?.revenue_growth || 0) >= 0 ? (
                <ArrowUpOutlined style={{ color: '#52c41a', marginRight: 4 }} />
              ) : (
                <ArrowDownOutlined style={{ color: '#f5222d', marginRight: 4 }} />
              )}
              {Math.abs(dashboardData?.overview?.revenue_growth || 0)}% so với kỳ trước
            </div>
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderTop: "4px solid #faad14", borderRadius: 8 }}>
            <Statistic
              title="Sản phẩm"
              value={dashboardData?.overview?.total_products || 0}
              prefix={<LaptopOutlined />}
              loading={loading}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderTop: "4px solid #722ed1", borderRadius: 8 }}>
            <Statistic
              title="Khách hàng"
              value={dashboardData?.overview?.total_users || 0}
              prefix={<UserOutlined />}
              loading={loading}
              valueStyle={{ color: '#722ed1' }}
            />
            <div style={{ marginTop: 8, fontSize: 12, color: '#666' }}>
              +{dashboardData?.overview?.new_users || 0} mới
            </div>
          </Card>
        </Col>
      </Row>

      {/* Biểu đồ doanh thu */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={16}>
          <Card title="📈 Biểu đồ doanh thu" style={{ borderRadius: 8 }}>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={dashboardData?.revenue_chart || []}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#1890ff" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#1890ff" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="period" />
                <YAxis tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`} />
                <Tooltip formatter={(value) => [formatCurrency(Number(value)), 'Doanh thu']} />
                <Area 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#1890ff" 
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </Card>
        </Col>
        <Col span={8}>
          <Card title="🎯 Tỉ lệ đơn hàng" style={{ borderRadius: 8 }}>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={dashboardData?.order_status_ratio || []}
                  dataKey="count"
                  nameKey="status_name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({percentage}) => `${percentage}%`}
                >
                  {(dashboardData?.order_status_ratio || []).map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </Col>
      </Row>

      {/* Top sản phẩm và danh mục */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card 
            title={
              <span>
                <TrophyOutlined style={{ color: '#faad14', marginRight: 8 }} />
                Top sản phẩm bán chạy
              </span>
            } 
            style={{ borderRadius: 8 }}
            extra={
              <Button type="link" onClick={() => navigate('/admin/products')}>
                Xem tất cả
              </Button>
            }
          >
            <Table
              dataSource={dashboardData?.top_products || []}
              columns={topProductColumns}
              pagination={false}
              size="small"
              loading={loading}
              rowKey="id"
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title="📂 Top danh mục bán chạy" 
            style={{ borderRadius: 8 }}
            extra={
              <Button type="link" onClick={() => navigate('/admin/categories')}>
                Xem tất cả
              </Button>
            }
          >
            {(dashboardData?.top_categories || []).map((category: any, index: number) => (
              <div 
                key={category.id}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < (dashboardData?.top_categories?.length - 1) ? '1px solid #f0f0f0' : 'none',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/admin/categories/${category.id}`)}
              >
                <span style={{ color: '#1890ff' }}>{category.name}</span>
                <div style={{ textAlign: 'right' }}>
                  <div>{category.total_sold} sản phẩm</div>
                  <small style={{ color: '#666' }}>{formatCurrency(category.total_revenue)}</small>
                </div>
              </div>
            ))}
          </Card>
        </Col>
      </Row>

      {/* Top khách hàng và tồn kho thấp */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={12}>
          <Card 
            title="👑 Top khách hàng VIP" 
            style={{ borderRadius: 8 }}
            extra={
              <Button type="link" onClick={() => navigate('/admin/users')}>
                Xem tất cả
              </Button>
            }
          >
            {(dashboardData?.top_customers || []).map((customer: any, index: number) => (
              <div 
                key={customer.id}
                style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: index < (dashboardData?.top_customers?.length - 1) ? '1px solid #f0f0f0' : 'none',
                  cursor: 'pointer'
                }}
                onClick={() => navigate(`/admin/users/${customer.id}`)}
              >
                <div>
                  <div style={{ color: '#1890ff', fontWeight: 500 }}>{customer.name}</div>
                  <small style={{ color: '#666' }}>{customer.email}</small>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div>{formatCurrency(customer.total_spent)}</div>
                  <small style={{ color: '#666' }}>{customer.total_orders} đơn hàng</small>
                </div>
              </div>
            ))}
          </Card>
        </Col>
        <Col span={12}>
          <Card 
            title={
              <span>
                <WarningOutlined style={{ color: '#f5222d', marginRight: 8 }} />
                Sản phẩm tồn kho thấp
              </span>
            } 
            style={{ borderRadius: 8 }}
            extra={
              <Button type="link" onClick={() => navigate('/admin/products')}>
                Xem tất cả
              </Button>
            }
          >
            <Table
              dataSource={dashboardData?.low_stock_products || []}
              columns={lowStockColumns}
              pagination={false}
              size="small"
              loading={loading}
              rowKey="variant_id"
            />
          </Card>
        </Col>
      </Row>

      {/* Đơn hàng gần đây */}
      <Row gutter={16}>
        <Col span={24}>
          <Card 
            title="🕒 Đơn hàng chờ xác nhận" 
            style={{ borderRadius: 8 }}
            extra={
              <Button type="primary" onClick={() => navigate('/admin/orders')}>
                Xử lý đơn hàng
              </Button>
            }
          >
            <List
              dataSource={dashboardData?.recent_orders || []}
              renderItem={(order: any) => (
                <List.Item
                  style={{ cursor: 'pointer' }}
                  onClick={() => navigate(`/admin/orders/${order.id}`)}
                  actions={[
                    <Button type="link" key="view">
                      Xem chi tiết
                    </Button>
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <span>
                        Đơn hàng #{order.id} - {order.user?.name || 'Khách vãng lai'}
                      </span>
                    }
                    description={
                      <div>
                        <div>Tổng tiền: {formatCurrency(order.total)}</div>
                        <div>Số sản phẩm: {order.items_count}</div>
                        <div>Thời gian: {dayjs(order.created_at).format('DD/MM/YYYY HH:mm')}</div>
                      </div>
                    }
                  />
                  <Badge 
                    status="processing" 
                    text={order.payment_method === 'cod' ? 'COD' : 'Online'} 
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