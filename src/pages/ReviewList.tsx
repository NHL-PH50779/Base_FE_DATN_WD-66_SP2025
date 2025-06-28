import React, { useEffect, useState } from 'react';
import {
  Table,
  Tag,
  Button,
  Modal,
  Card,
  Row,
  Col,
  Typography,
  Space,
  Image,
  Rate,
  Descriptions,
  message,
  Popconfirm
} from 'antd';
import { EyeOutlined, DeleteOutlined, CheckOutlined, CloseOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

interface Review {
  id: number;
  order_id: number;
  product_id: number;
  user_id: number;
  rating: number;
  comment: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    name: string;
    email: string;
  };
  product?: {
    id: number;
    name: string;
    thumbnail: string;
  };
  order?: {
    id: number;
    total: number;
  };
}

const ReviewList = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      // Mock data - thay thế bằng API thực
      const mockReviews: Review[] = [
        {
          id: 1,
          order_id: 13,
          product_id: 1,
          user_id: 16,
          rating: 5,
          comment: 'Sản phẩm rất tốt, giao hàng nhanh!',
          status: 'pending',
          created_at: '2025-01-15T10:30:00Z',
          updated_at: '2025-01-15T10:30:00Z',
          user: {
            id: 16,
            name: 'Nguyễn Văn A',
            email: 'user@example.com'
          },
          product: {
            id: 1,
            name: 'Laptop Dell Inspiron 15',
            thumbnail: 'https://via.placeholder.com/300x300'
          },
          order: {
            id: 13,
            total: 22020000
          }
        }
      ];
      setReviews(mockReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      message.error('Lỗi khi tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: number, newStatus: 'approved' | 'rejected') => {
    try {
      // Mock API call
      message.success(`Đã ${newStatus === 'approved' ? 'duyệt' : 'từ chối'} đánh giá`);
      
      // Update local state
      setReviews(prev => prev.map(review => 
        review.id === reviewId 
          ? { ...review, status: newStatus }
          : review
      ));
    } catch (error) {
      message.error('Lỗi khi cập nhật trạng thái đánh giá');
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      // Mock API call
      message.success('Đã xóa đánh giá');
      
      // Update local state
      setReviews(prev => prev.filter(review => review.id !== reviewId));
    } catch (error) {
      message.error('Lỗi khi xóa đánh giá');
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'green';
      case 'rejected': return 'red';
      case 'pending': return 'orange';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Đã từ chối';
      case 'pending': return 'Chờ duyệt';
      default: return 'Không xác định';
    }
  };

  const columns = [
    {
      title: 'Đánh giá',
      key: 'review',
      render: (record: Review) => (
        <div>
          <div style={{ marginBottom: 8 }}>
            <Rate disabled value={record.rating} style={{ fontSize: 16 }} />
            <Text style={{ marginLeft: 8, fontWeight: 600 }}>
              {record.rating}/5
            </Text>
          </div>
          <Paragraph 
            ellipsis={{ rows: 2, expandable: false }} 
            style={{ margin: 0, maxWidth: 300 }}
          >
            {record.comment}
          </Paragraph>
        </div>
      ),
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (record: Review) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Image
            src={record.product?.thumbnail}
            alt={record.product?.name}
            width={50}
            height={50}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            fallback="/placeholder-image.jpg"
          />
          <div>
            <Text strong>{record.product?.name}</Text>
            <br />
            <Text type="secondary" style={{ fontSize: 12 }}>
              Đơn hàng #{record.order_id}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (record: Review) => (
        <div>
          <Text strong>{record.user?.name}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.user?.email}
          </Text>
        </div>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {getStatusText(status)}
        </Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (date: string) => formatDate(date),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (record: Review) => (
        <Space>
          <Button
            type="primary"
            icon={<EyeOutlined />}
            size="small"
            onClick={() => {
              setSelectedReview(record);
              setDetailVisible(true);
            }}
          >
            Chi tiết
          </Button>
          
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                icon={<CheckOutlined />}
                size="small"
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                onClick={() => handleStatusChange(record.id, 'approved')}
              >
                Duyệt
              </Button>
              <Button
                danger
                icon={<CloseOutlined />}
                size="small"
                onClick={() => handleStatusChange(record.id, 'rejected')}
              >
                Từ chối
              </Button>
            </>
          )}
          
          <Popconfirm
            title="Xác nhận xóa đánh giá?"
            description="Bạn có chắc chắn muốn xóa đánh giá này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              danger
              icon={<DeleteOutlined />}
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={2}>Quản lý đánh giá</Title>

      <Table
        columns={columns}
        dataSource={reviews}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng cộng ${total} đánh giá`,
        }}
      />

      {/* Review Detail Modal */}
      <Modal
        title={`Chi tiết đánh giá #${selectedReview?.id || 'N/A'}`}
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={800}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedReview && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <Card title="Thông tin đánh giá" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Đánh giá">
                      <Rate disabled value={selectedReview.rating} />
                      <Text style={{ marginLeft: 8 }}>
                        {selectedReview.rating}/5 sao
                      </Text>
                    </Descriptions.Item>
                    <Descriptions.Item label="Bình luận">
                      <Paragraph>{selectedReview.comment}</Paragraph>
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                      <Tag color={getStatusColor(selectedReview.status)}>
                        {getStatusText(selectedReview.status)}
                      </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Ngày tạo">
                      {formatDate(selectedReview.created_at)}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
              
              <Col span={12}>
                <Card title="Thông tin khách hàng" size="small">
                  <Descriptions column={1} size="small">
                    <Descriptions.Item label="Tên khách hàng">
                      {selectedReview.user?.name}
                    </Descriptions.Item>
                    <Descriptions.Item label="Email">
                      {selectedReview.user?.email}
                    </Descriptions.Item>
                    <Descriptions.Item label="Đơn hàng">
                      #{selectedReview.order_id}
                    </Descriptions.Item>
                    <Descriptions.Item label="Giá trị đơn hàng">
                      {selectedReview.order?.total ? formatPrice(selectedReview.order.total) : 'N/A'}
                    </Descriptions.Item>
                  </Descriptions>
                </Card>
              </Col>
            </Row>
            
            <Card title="Thông tin sản phẩm" style={{ marginTop: 16 }} size="small">
              <Row align="middle" gutter={16}>
                <Col span={4}>
                  <Image
                    src={selectedReview.product?.thumbnail}
                    alt={selectedReview.product?.name}
                    width={80}
                    height={80}
                    style={{ objectFit: 'cover', borderRadius: 8 }}
                    fallback="/placeholder-image.jpg"
                  />
                </Col>
                <Col span={20}>
                  <Title level={5}>{selectedReview.product?.name}</Title>
                  <Text type="secondary">ID sản phẩm: {selectedReview.product_id}</Text>
                </Col>
              </Row>
            </Card>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewList;