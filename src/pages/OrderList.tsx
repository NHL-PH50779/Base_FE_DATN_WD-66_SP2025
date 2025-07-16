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
  6: { label: 'Đã hủy', color: 'red', description: 'Khách hàng hoặc Admin hủy đơn' },
  7: { label: 'Yêu cầu hoàn hàng', color: 'volcano', description: 'Khách hàng yêu cầu hoàn hàng' },
  8: { label: 'Đồng ý hoàn hàng', color: 'magenta', description: 'Admin đồng ý hoàn hàng' },
  9: { label: 'Từ chối hoàn hàng', color: 'red', description: 'Admin từ chối hoàn hàng' }
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
      const newOrders = response.data;
      
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
    setUpdating(orderId);
    try {
      console.log('Changing status for order:', orderId, 'to:', newStatusId);
      const result = await orderService.updateOrderStatus(orderId, newStatusId, 1);
      console.log('Status change result:', result);
      
      // Tự động cập nhật trạng thái thanh toán
      if (newStatusId === 8) { // Đồng ý hoàn hàng -> Đã hoàn tiền
        await orderService.updatePaymentStatus(orderId, 3);
        message.success('Cập nhật trạng thái thành công và đã hoàn tiền!');
      } else {
        message.success('Cập nhật trạng thái thành công!');
      }
      
      // Optimistic update - cập nhật ngay trên UI
      setOrders(prevOrders => 
        prevOrders.map(order => 
          order.id === orderId 
            ? { ...order, order_status_id: newStatusId }
            : order
        )
      );
      
      // Refresh data sau 1s
      setTimeout(() => {
        fetchOrders(false);
      }, 1000);
    } catch (error) {
      console.error('Error updating status:', error);
      message.error('Lỗi khi cập nhật trạng thái: ' + (error as any)?.message);
    } finally {
      setUpdating(null);
    }
  };

  const handleRefundRequest = (order: Order, approve: boolean) => {
    const newStatusId = approve ? 8 : 9; // 8: Đồng ý, 9: Từ chối
    const actionText = approve ? 'đồng ý' : 'từ chối';
    
    Modal.confirm({
      title: `Xác nhận ${actionText} hoàn hàng`,
      content: (
        <div>
          <p>Bạn có chắc chắn muốn <strong>{actionText}</strong> yêu cầu hoàn hàng cho đơn hàng #{order.id}?</p>
          {approve && (
            <div style={{ marginTop: 10, padding: 10, backgroundColor: '#fff2e8', borderRadius: 4 }}>
              <p style={{ margin: 0, fontSize: '12px', color: '#d46b08' }}>
                ⚠️ Lưu ý: Nếu đồng ý hoàn hàng, hệ thống sẽ tự động:
                <br />- Chuyển trạng thái thanh toán thành "Đã hoàn tiền"
                <br />- Hoàn tiền vào ví (nếu thanh toán online) hoặc liên hệ khách hàng (nếu COD)
              </p>
            </div>
          )}
        </div>
      ),
      onOk: () => handleStatusChange(order.id, newStatusId),
      okText: 'Xác nhận',
      cancelText: 'Hủy'
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
      case 4: // Đã giao hàng -> Admin có thể chuyển thành Hoàn thành hoặc chờ client xác nhận
        return allStatuses.filter(([key]) => ['4', '5'].includes(key));
      case 5: // Hoàn thành -> Không thể thay đổi
        return allStatuses.filter(([key]) => key === '5');
      case 6: // Đã hủy -> Không thể thay đổi
        return allStatuses.filter(([key]) => key === '6');
      case 7: // Yêu cầu hoàn hàng -> Admin có thể: Đồng ý hoặc Từ chối
        return allStatuses.filter(([key]) => ['7', '8', '9'].includes(key));
      case 8: // Đồng ý hoàn hàng -> Không thể thay đổi
        return allStatuses.filter(([key]) => key === '8');
      case 9: // Từ chối hoàn hàng -> Trở về Đã giao
        return allStatuses.filter(([key]) => ['9', '4'].includes(key));
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
        
        const canEdit = ![5, 6, 8].includes(statusId); // Không thể sửa: Hoàn thành, Đã hủy, Đồng ý hoàn hàng
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
            style={{ width: 160 }}
            onChange={(value) => {
              const statusInfo = statusConfig[value as keyof typeof statusConfig];
              Modal.confirm({
                title: 'Xác nhận thay đổi trạng thái',
                icon: <ExclamationCircleOutlined />,
                content: (
                  <div>
                    <p>Thay đổi trạng thái thành: <strong>{statusInfo?.label}</strong></p>
                    <p style={{ color: '#666', fontSize: '12px' }}>{statusInfo?.description}</p>
                  </div>
                ),
                onOk: () => handleStatusChange(record.id, value),
                okText: 'Xác nhận',
                cancelText: 'Hủy'
              });
            }}
            loading={updating === record.id}
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
          {record.order_status_id === 7 && ( // Yêu cầu hoàn hàng
            <>
              <Button
                type="primary"
                size="small"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                onClick={() => handleRefundRequest(record, true)}
              >
                Đồng ý
              </Button>
              <Button
                danger
                size="small"
                onClick={() => handleRefundRequest(record, false)}
              >
                Từ chối
              </Button>
            </>
          )}
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