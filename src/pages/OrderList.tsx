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
  Descriptions
} from 'antd';
import { EyeOutlined } from '@ant-design/icons';
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
  order_status_id: number;
  payment_status_id: number;
  created_at: string;
  updated_at: string;
  user: {
    name: string;
    email: string;
  };
  items: OrderItem[];
}

const statusConfig = {
  1: { label: 'Chờ xác nhận', color: 'orange' },
  2: { label: 'Đã xác nhận', color: 'blue' },
  3: { label: 'Đang giao', color: 'cyan' },
  4: { label: 'Đã giao', color: 'green' },
  5: { label: 'Đã hủy', color: 'red' }
};

const OrderList = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await orderService.getAllOrders();
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (orderId: number, newStatusId: number) => {
    setUpdating(orderId);
    try {
      await orderService.updateOrderStatus(orderId, newStatusId, 1);
      await fetchOrders();
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setUpdating(null);
    }
  };

  const handleViewDetail = async (order: Order) => {
    try {
      console.log('Viewing order detail for ID:', order.id);
      const response = await orderService.getOrderDetail(order.id);
      console.log('Order detail response:', response);
      setSelectedOrder(response.data);
      setDetailVisible(true);
    } catch (error) {
      console.error('Error fetching order detail:', error);
      // Vẫn hiển thị modal với dữ liệu hiện tại nếu API lỗi
      setSelectedOrder(order);
      setDetailVisible(true);
    }
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
      title: 'Khách hàng',
      key: 'customer',
      render: (record: Order) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.user.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.user.email}</div>
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
      render: (statusId: number, record: Order) => (
        <Select
          value={statusId}
          style={{ width: 140 }}
          onChange={(value) => handleStatusChange(record.id, value)}
          loading={updating === record.id}
        >
          {Object.entries(statusConfig).map(([key, config]) => (
            <Option key={key} value={parseInt(key)}>
              <Tag color={config.color}>{config.label}</Tag>
            </Option>
          ))}
        </Select>
      ),
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
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetail(record)}
        >
          Chi tiết
        </Button>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Quản lý đơn hàng</Title>

      <Table
        columns={columns}
        dataSource={orders}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng cộng ${total} đơn hàng`,
        }}
      />

      {/* Order Detail Modal */}
      <Modal
        title={`Chi tiết đơn hàng #${selectedOrder?.id}`}
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
                <Card title="Thông tin khách hàng" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Tên">{selectedOrder.user.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{selectedOrder.user.email}</Descriptions.Item>
                    <Descriptions.Item label="SĐT">{selectedOrder.phone}</Descriptions.Item>
                    <Descriptions.Item label="Địa chỉ">{selectedOrder.shipping_address}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              {/* Order Info */}
              <Col span={12}>
                <Card title="Thông tin đơn hàng" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Trạng thái">
                      <Tag color={statusConfig[selectedOrder.order_status_id as keyof typeof statusConfig]?.color}>
                        {statusConfig[selectedOrder.order_status_id as keyof typeof statusConfig]?.label}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Thanh toán">{selectedOrder.payment_method}</Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền">
                      <Text strong style={{ color: '#f5222d' }}>
                        {formatPrice(selectedOrder.total)}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày đặt">{formatDate(selectedOrder.created_at)}</Descriptions.Item>
                    {selectedOrder.note && (
                      <Descriptions.Item label="Ghi chú">{selectedOrder.note}</Descriptions.Item>
                    )}
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            {/* Order Items */}
            <Card title="Sản phẩm đã đặt" style={{ marginTop: 16 }} size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                {selectedOrder.items?.map((item) => (
                  <Card key={item.id} size="small">
                    <Row align="middle" gutter={16}>
                      <Col span={4}>
                        <Image
                          src={getImageUrl(item.product?.thumbnail)}
                          alt={item.product?.name || 'Sản phẩm'}
                          width={60}
                          height={60}
                          style={{ objectFit: 'cover' }}
                        />
                      </Col>
                      <Col span={12}>
                        <div>
                          <Text strong>{item.product?.name || 'Sản phẩm'}</Text>
                          <br />
                          {item.product_variant && (
                            <Text type="secondary">{item.product_variant.name}</Text>
                          )}
                        </div>
                      </Col>
                      <Col span={4}>
                        <Text>SL: {item.quantity}</Text>
                      </Col>
                      <Col span={4}>
                        <Text strong>{formatPrice(item.price * item.quantity)}</Text>
                      </Col>
                    </Row>
                  </Card>
                ))}
              </Space>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OrderList;