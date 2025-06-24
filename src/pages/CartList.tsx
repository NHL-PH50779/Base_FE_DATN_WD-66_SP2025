import React, { useEffect, useState } from 'react';
import {
  Table,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Image,
  Button,
  Modal,
  Descriptions,
  Tag
} from 'antd';
import { EyeOutlined, ShoppingCartOutlined } from '@ant-design/icons';
import { cartService } from '../services/cart.service';

const { Title, Text } = Typography;

interface CartItem {
  id: number;
  product_id: number;
  product_variant_id?: number;
  quantity: number;
  price: number;
  product: {
    id: number;
    name: string;
    thumbnail?: string;
  };
  product_variant?: {
    id: number;
    name: string;
  };
}

interface Cart {
  id: number;
  user_id: number;
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email: string;
  };
  items: CartItem[];
}

const CartList = () => {
  const [carts, setCarts] = useState<Cart[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  useEffect(() => {
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    setLoading(true);
    try {
      const response = await cartService.getAllCarts();
      setCarts(response.data);
    } catch (error) {
      console.error('Error fetching carts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetail = (cart: Cart) => {
    setSelectedCart(cart);
    setDetailVisible(true);
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

  const getImageUrl = (thumbnail?: string) => {
    if (!thumbnail) return '/placeholder-image.jpg';
    if (thumbnail.startsWith('http')) return thumbnail;
    return `http://localhost/storage/products/${thumbnail}`;
  };

  const calculateCartTotal = (items: CartItem[]) => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 80,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (record: Cart) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.user.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{record.user.email}</div>
        </div>
      ),
    },
    {
      title: 'Số sản phẩm',
      key: 'itemCount',
      render: (record: Cart) => (
        <Tag color="blue">{record.items.length} sản phẩm</Tag>
      ),
    },
    {
      title: 'Tổng tiền',
      key: 'total',
      render: (record: Cart) => (
        <Text strong style={{ color: '#f5222d' }}>
          {formatPrice(calculateCartTotal(record.items))}
        </Text>
      ),
    },
    {
      title: 'Cập nhật lần cuối',
      dataIndex: 'updated_at',
      key: 'updated_at',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (record: Cart) => (
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
      <Title level={2}>
        <ShoppingCartOutlined /> Quản lý giỏ hàng
      </Title>

      <Table
        columns={columns}
        dataSource={carts}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng cộng ${total} giỏ hàng`,
        }}
      />

      {/* Cart Detail Modal */}
      <Modal
        title={`Chi tiết giỏ hàng - ${selectedCart?.user.name}`}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={900}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedCart && (
          <div>
            <Row gutter={16}>
              {/* Customer Info */}
              <Col span={12}>
                <Card title="Thông tin khách hàng" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Tên">{selectedCart.user.name}</Descriptions.Item>
                    <Descriptions.Item label="Email">{selectedCart.user.email}</Descriptions.Item>
                    <Descriptions.Item label="ID">{selectedCart.user.id}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>

              {/* Cart Info */}
              <Col span={12}>
                <Card title="Thông tin giỏ hàng" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="ID giỏ hàng">{selectedCart.id}</Descriptions.Item>
                    <Descriptions.Item label="Số sản phẩm">{selectedCart.items.length}</Descriptions.Item>
                    <Descriptions.Item label="Tổng tiền">
                      <Text strong style={{ color: '#f5222d' }}>
                        {formatPrice(calculateCartTotal(selectedCart.items))}
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Cập nhật lần cuối">{formatDate(selectedCart.updated_at)}</Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>

            {/* Cart Items */}
            <Card title="Sản phẩm trong giỏ hàng" style={{ marginTop: 16 }} size="small">
              <Space direction="vertical" style={{ width: '100%' }}>
                {selectedCart.items.map((item) => (
                  <Card key={item.id} size="small">
                    <Row align="middle" gutter={16}>
                      <Col span={3}>
                        <Image
                          src={getImageUrl(item.product.thumbnail)}
                          alt={item.product.name}
                          width={60}
                          height={60}
                          style={{ objectFit: 'cover' }}
                        />
                      </Col>
                      <Col span={10}>
                        <div>
                          <Text strong>{item.product.name}</Text>
                          <br />
                          {item.product_variant && (
                            <Text type="secondary">{item.product_variant.name}</Text>
                          )}
                        </div>
                      </Col>
                      <Col span={3}>
                        <Text>SL: {item.quantity}</Text>
                      </Col>
                      <Col span={4}>
                        <Text>Đơn giá: {formatPrice(item.price)}</Text>
                      </Col>
                      <Col span={4}>
                        <Text strong>Thành tiền: {formatPrice(item.price * item.quantity)}</Text>
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

export default CartList;