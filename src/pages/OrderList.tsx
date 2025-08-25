import React, { useEffect, useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Modal,
  Select,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Image,
  Spin,
  Alert,
  Descriptions,
  message,
  Popconfirm,
  Badge,
  notification
} from 'antd';
import { EyeOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { orderService } from '../services/order.service';

const { Title, Text } = Typography;
const { Option } = Select;

interface OrderItem {
  id: number;
  product_variant_id: number;
  quantity: number;
  price: number;
  product_variant: {
    Name: string;
    product: {
      name: string;
      thumbnail: string;
    };
  };
}

interface Order {
  id: number;
  user_id: number;
  total: number;
  subtotal?: number;
  shipping_fee?: number;
  discount_amount?: number;
  voucher_code?: string;
  order_status_id: number;
  payment_status_id: number;
  payment_method?: string;
  name: string;
  phone: string;
  email?: string;
  address: string;
  note?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
    phone?: string;
  };
  items?: OrderItem[];
  order_items?: OrderItem[];
}

const statusConfig = {
  1: { label: 'Chờ xác nhận', color: 'orange', description: 'Đơn hàng vừa được tạo' },
  2: { label: 'Đã xác nhận', color: 'blue', description: 'Admin đã xác nhận đơn hàng' },
  3: { label: 'Đang vận chuyển', color: 'cyan', description: 'Admin đã chuyển sang trạng thái vận chuyển' },
  4: { label: 'Đã giao hàng', color: 'purple', description: 'Admin xác nhận đã giao hàng' },
  5: { label: 'Hoàn thành', color: 'green', description: 'Khách hàng đã nhận hàng hoặc tự động sau 3 ngày' },
  6: { label: 'Đã hủy', color: 'red', description: 'Khách hàng hoặc Admin hủy đơn' }
};

const paymentStatusConfig = {
  1: { label: 'Chưa thanh toán', color: 'orange' },
  2: { label: 'Đã thanh toán', color: 'green' },
  3: { label: 'Đã hoàn tiền', color: 'blue' }
};

const paymentMethodConfig = {
  'cod': 'Thanh toán khi nhận hàng',
  'vnpay': 'VNPay',
  'momo': 'MoMo',
  'bank_transfer': 'Chuyển khoản ngân hàng'
};

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    fetchOrders();
    checkNotifications();
    
    // Auto-refresh mỗi 30 giây thay vì 5 giây
    const interval = setInterval(() => {
      fetchOrders(false, false); // Không dùng cache khi auto-refresh
      checkNotifications();
    }, 30000);
    
    return () => clearInterval(interval);
  }, []);
  
  const checkNotifications = () => {
    const adminNotifications = JSON.parse(localStorage.getItem('admin_notifications') || '[]');
    const unreadNotifications = adminNotifications.filter((n: any) => !n.read);
    
    // Hiển thị thông báo mới
    unreadNotifications.forEach((notif: any) => {
      if (notif.type === 'order_completed') {
        notification.success({
          message: 'Cập nhật đơn hàng',
          description: notif.message,
          duration: 10,
          placement: 'topRight'
        });
        
        // Đánh dấu đã đọc
        notif.read = true;
      }
    });
    
    // Cập nhật lại localStorage
    localStorage.setItem('admin_notifications', JSON.stringify(adminNotifications));
    setNotifications(unreadNotifications);
  };

  const fetchOrders = async (showLoading = true, useCache = true) => {
    if (showLoading) setLoading(true);
    try {
      const response = await orderService.getAllOrders(useCache);
      const allOrders = response.data;
      
      // Lọc bỏ các đơn hàng có trạng thái hoàn hàng (7,8,9)
      const newOrders = allOrders.filter((order: Order) => ![7, 8, 9].includes(order.order_status_id));
      
      // Kiểm tra có đơn hàng nào chuyển thành "Hoàn thành" không
      if (orders.length > 0) {
        const completedOrders = newOrders.filter((newOrder: Order) => {
          const oldOrder = orders.find(o => o.id === newOrder.id);
          return oldOrder && oldOrder.order_status_id !== 5 && newOrder.order_status_id === 5;
        });
        
        if (completedOrders.length > 0) {
          completedOrders.forEach((order: Order) => {
            message.success(`Đơn hàng #${order.id} đã được khách hàng xác nhận nhận hàng!`, 5);
          });
        }
      }
      
      setOrders(newOrders);
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (showLoading) {
        message.error('Lỗi khi tải danh sách đơn hàng');
      }
    } finally {
      if (showLoading) setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatusId: number) => {
    // Optimistic update ngay lập tức
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId 
          ? { ...order, order_status_id: newStatusId }
          : order
      )
    );
    
    // Hiện thông báo ngay
    message.success('Cập nhật trạng thái thành công!');
    
    // Gọi API trong background (không chờ kết quả)
    orderService.updateOrderStatus(orderId, newStatusId, 1)
      .catch((error) => {
        // Nếu lỗi, revert lại trạng thái cũ
        fetchOrders(false);
        message.error('Lỗi khi cập nhật trạng thái: ' + (error as any)?.message);
      });
  };



  const canCancelOrder = (order: Order) => {
    return order.order_status_id === 3; // Chỉ đang giao mới được hủy
  };

  const getAvailableStatuses = (currentStatus: number) => {
    const allStatuses = Object.entries(statusConfig);
    
    // Logic cho phép chuyển trạng thái theo yêu cầu
    switch (currentStatus) {
      case 1: // Chờ xác nhận -> Admin có thể: Xác nhận hoặc Hủy
        return allStatuses.filter(([key]) => ['1', '2', '6'].includes(key));
      case 2: // Đã xác nhận -> Admin chỉ có thể: Vận chuyển (không thể hủy nữa)
        return allStatuses.filter(([key]) => ['2', '3'].includes(key));
      case 3: // Đang vận chuyển -> Admin có thể: Đã giao
        return allStatuses.filter(([key]) => ['3', '4'].includes(key));
      case 4: // Đã giao hàng -> Chỉ hiển thị trạng thái hiện tại, chờ client xác nhận
        return allStatuses.filter(([key]) => key === '4');
      case 5: // Hoàn thành -> Không thể thay đổi
        return allStatuses.filter(([key]) => key === '5');
      case 6: // Đã hủy -> Không thể thay đổi
        return allStatuses.filter(([key]) => key === '6');
      default:
        return allStatuses;
    }
  };

  const handleViewDetail = (order: Order) => {
    console.log('Viewing order:', order);
    setSelectedOrder(order);
    setDetailVisible(true);
    
    // Tạm thời disable API call vì backend không trả về đầy đủ dữ liệu
    // TODO: Sửa backend API để trả về đầy đủ thông tin đơn hàng
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN');
  };

  const getImageUrl = (thumbnail: string) => {
    if (!thumbnail) return '/placeholder-image.jpg';
    if (thumbnail.startsWith('http')) return thumbnail;
    return `http://localhost/storage/products/${thumbnail}`;
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => `#${id}`,
    },
    {
      title: 'Tài khoản mua',
      key: 'customer',
      render: (record: Order) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.user?.name || record.name || 'Không có'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.user?.email || record.email || 'Không có'}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.user?.phone || record.phone || 'Không có'}</div>
        </div>
      ),
    },
    {
      title: 'Thanh toán',
      key: 'payment',
      render: (record: Order) => (
        <div>
          <Tag color={paymentStatusConfig[record.payment_status_id as keyof typeof paymentStatusConfig]?.color}>
            {paymentStatusConfig[record.payment_status_id as keyof typeof paymentStatusConfig]?.label || 'Không xác định'}
          </Tag>
          <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
            {paymentMethodConfig[record.payment_method as keyof typeof paymentMethodConfig] || record.payment_method || 'Chưa xác định'}
          </div>
        </div>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total',
      key: 'total',
      render: (total: number) => (
        <Text strong style={{ color: '#f5222d' }}>
          {formatPrice(total)}
        </Text>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'order_status_id',
      key: 'order_status_id',
      render: (statusId: number, record: Order) => {
        const availableStatuses = getAvailableStatuses(statusId);
        const isDisabled = statusId === 5 || statusId === 6; // Hoàn thành hoặc đã hủy
        
        const canEdit = ![4, 5, 6].includes(statusId); // Không thể sửa: Đã giao hàng, Hoàn thành, Đã hủy
        const currentStatus = statusConfig[statusId as keyof typeof statusConfig];
        
        if (!canEdit) {
          // Chỉ hiển thị tag cho trạng thái không thể sửa
          return (
            <Tag color={currentStatus?.color}>
              {currentStatus?.label}
            </Tag>
          );
        }
        
        // Hiển thị select cho trạng thái có thể sửa
        return (
          <Select
            value={statusId}
            style={{ width: 145 }}
            onChange={(value) => {
              const statusInfo = statusConfig[value as keyof typeof statusConfig];
              handleStatusChange(record.id, value);
            }}
            size="small"
          >
            {availableStatuses.map(([key, config]) => (
              <Option key={key} value={parseInt(key)}>
                <Tag color={config.color} size="small">{config.label}</Tag>
              </Option>
            ))}
          </Select>
        );
      },
    },
    {
      title: 'Ngày đặt',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (record: Order) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            onClick={() => handleViewDetail(record)}
            size="small"
          >
            Chi tiết
          </Button>

        </Space>
      ),
    },
  ];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <Title level={2}>Quản lý đơn hàng</Title>
        <Space>
          <Button 
            type="default"
            onClick={async () => {
              try {
                setLoading(true);
                const result = await orderService.autoCompleteOrders();
                message.success(`Đã tự động hoàn thành ${result.completed_orders || 0} đơn hàng`);
                await fetchOrders(false);
              } catch (error) {
                message.error('Lỗi khi tự động hoàn thành đơn hàng!');
              } finally {
                setLoading(false);
              }
            }}
            loading={loading}
          >
            Tự động hoàn thành
          </Button>
          <Badge count={notifications.length} showZero={false}>
            <Button 
              type="primary" 
              onClick={() => {
                fetchOrders(true, false); // Force refresh không dùng cache
                message.success('Cập nhật danh sách đơn hàng thành công!');
              }}
            >
              Làm mới
            </Button>
          </Badge>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 20,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng cộng ${total} đơn hàng`,
          pageSizeOptions: ['10', '20', '50', '100']
        }}
      />

      {/* Order Detail Modal */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id || 'N/A'}`}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedOrder && (
          <div>
            <Row gutter={16}>
              {/* Customer Info */}
              <Col span={12}>
                <Card title="Tài khoản mua hàng" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Tên tài khoản">{selectedOrder.user?.name || 'Không có'}</Descriptions.Item>
                    <Descriptions.Item label="Email tài khoản">{selectedOrder.user?.email || 'Không có'}</Descriptions.Item>
                    <Descriptions.Item label="SĐT tài khoản">{selectedOrder.user?.phone || 'Không có'}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="Thông tin giao hàng" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Tên người nhận">{selectedOrder.name || 'Không có'}</Descriptions.Item>
                    <Descriptions.Item label="SĐT người nhận">{selectedOrder.phone || 'Không có'}</Descriptions.Item>
                    <Descriptions.Item label="Email người nhận">{selectedOrder.email || 'Không có'}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ giao hàng">{selectedOrder.address || 'Không có'}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

            </Row>
            
            <Row gutter={16} style={{ marginTop: 16 }}>
              {/* Order Info */}
              <Col span={12}>
                <Card title="Thông tin đơn hàng" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Trạng thái đơn hàng">
                      <Tag color={statusConfig[selectedOrder.order_status_id as keyof typeof statusConfig]?.color}>
                        {statusConfig[selectedOrder.order_status_id as keyof typeof statusConfig]?.label || 'Không xác định'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái thanh toán">
                      <Tag color={paymentStatusConfig[selectedOrder.payment_status_id as keyof typeof paymentStatusConfig]?.color}>
                        {paymentStatusConfig[selectedOrder.payment_status_id as keyof typeof paymentStatusConfig]?.label || 'Không xác định'}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phương thức thanh toán">
                      {paymentMethodConfig[selectedOrder.payment_method as keyof typeof paymentMethodConfig] || selectedOrder.payment_method || 'Chưa xác định'}
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày đặt">
                      {selectedOrder.created_at ? formatDate(selectedOrder.created_at) : 'Không xác định'}
                    </Descriptions.Item>
                    {selectedOrder.note && (
                      <Descriptions.Item label="Ghi chú">{selectedOrder.note}</Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
              </Col>
              
              {/* Price Breakdown */}
              <Col span={12}>
                <Card title="Chi tiết giá" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Tạm tính">
                      <Text>{formatPrice(selectedOrder.subtotal || (selectedOrder.total - (selectedOrder.shipping_fee || 0) + (selectedOrder.discount_amount || 0)))}</Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Phí vận chuyển">
                      <Text>{formatPrice(selectedOrder.shipping_fee || 0)}</Text>
                    </Descriptions.Item>
                    {selectedOrder.discount_amount && selectedOrder.discount_amount > 0 && (
                      <Descriptions.Item label="Giảm giá">
                        <Text style={{ color: '#52c41a' }}>-{formatPrice(selectedOrder.discount_amount)}</Text>
                      </Descriptions.Item>
                    )}
                    {selectedOrder.voucher_code && (
                      <Descriptions.Item label="Mã voucher">
                        <Tag color="blue">{selectedOrder.voucher_code}</Tag>
                      </Descriptions.Item>
                    )}
                    <Descriptions.Item label="Tổng cộng">
                      <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                        {selectedOrder.total ? formatPrice(Number(selectedOrder.total)) : '0 ₫'}
                      </Text>
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            {/* Order Items */}
            <Card title="Sản phẩm đã đặt" style={{ marginTop: 16 }} size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                {(selectedOrder.items || selectedOrder.order_items)?.length > 0 ? (
                  (selectedOrder.items || selectedOrder.order_items)?.map((item, index) => (
                  <Card key={item.id || index} size="small">
                    <Row align="middle" gutter={16}>
                      <Col span={4}>
                        <Image
                          src={getImageUrl(item.product?.thumbnail || item.product_variant?.product?.thumbnail)}
                          alt={item.product?.name || item.product_variant?.product?.name || 'Sản phẩm'}
                          width={60}
                          height={60}
                          style={{ objectFit: 'cover' }}
                          fallback="/placeholder-image.jpg"
                        />
                      </Col>
                      <Col span={12}>
                        <div>
                          <Text strong>{item.product?.name || item.product_variant?.product?.name || 'Sản phẩm'}</Text>
                          <br />
                          {(item.product_variant || item.variant) && (
                            <Text type="secondary">
                              {item.product_variant?.Name || item.product_variant?.name || item.variant?.Name || item.variant?.name || 'Biến thể'}
                            </Text>
                          )}
                        </div>
                      </Col>
                      <Col span={3}>
                        <Text>SL: {item.quantity || 1}</Text>
                      </Col>
                      <Col span={3}>
                        <Text strong>
                          Đơn giá: {formatPrice(item.price || 0)}
                        </Text>
                      </Col>
                      <Col span={2}>
                        <Text strong style={{ color: '#f5222d' }}>
                          {formatPrice((item.price || 0) * (item.quantity || 1))}
                        </Text>
                      </Col>
                    </Row>
                  </Card>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>
                    Không có sản phẩm nào trong đơn hàng này
                  </div>
                )}
              </Space>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderList;