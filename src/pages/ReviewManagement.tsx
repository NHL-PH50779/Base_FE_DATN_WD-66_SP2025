import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Card,
  Typography,
  message,
  Avatar,
  Popconfirm,
  Select,
  Row,
  Col,
  Rate,
  Input,
  Statistic
} from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  StarOutlined,
  UserOutlined,
  ShoppingOutlined
} from '@ant-design/icons';
import { commentService } from '../services/comment.service';

const { Title, Text } = Typography;
const { Option } = Select;

interface Review {
  id: number;
  user_id: number;
  product_id: number;
  content: string;
  rating: number;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  updated_at: string;
  user: {
    id: number;
    name: string;
    email?: string;
  };
  product: {
    id: number;
    name: string;
    thumbnail?: string;
  };
}

const ReviewManagement = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [ratingFilter, setRatingFilter] = useState<number | null>(null);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await commentService.getAllComments();
      const commentsData = response.data || response;
      
      // Lọc chỉ lấy đánh giá (rating > 0)
      const filteredReviews = commentsData.filter((comment: any) => comment.rating > 0);
      setReviews(filteredReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      message.error('Lỗi khi tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (reviewId: number, newStatus: 'approved' | 'rejected') => {
    try {
      await commentService.updateCommentStatus(reviewId, newStatus);
      setReviews(prev => 
        prev.map(review => 
          review.id === reviewId 
            ? { ...review, status: newStatus, updated_at: new Date().toISOString() }
            : review
        )
      );
      message.success(`Đã ${newStatus === 'approved' ? 'duyệt' : 'từ chối'} đánh giá`);
    } catch (error) {
      console.error('Error updating review status:', error);
      message.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleDelete = async (reviewId: number) => {
    try {
      await commentService.deleteComment(reviewId);
      setReviews(prev => prev.filter(review => review.id !== reviewId));
      message.success('Đã xóa đánh giá');
    } catch (error) {
      console.error('Error deleting review:', error);
      message.error('Lỗi khi xóa đánh giá');
    }
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
      case 'rejected': return 'Từ chối';
      case 'pending': return 'Chờ duyệt';
      default: return 'Không xác định';
    }
  };

  const filteredReviews = reviews.filter(review => {
    const matchesStatus = !statusFilter || review.status === statusFilter;
    const matchesRating = !ratingFilter || review.rating === ratingFilter;
    const matchesSearch = !searchText || 
      review.content.toLowerCase().includes(searchText.toLowerCase()) ||
      review.user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      review.product.name.toLowerCase().includes(searchText.toLowerCase());
    
    return matchesStatus && matchesRating && matchesSearch;
  });

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const total = reviews.reduce((sum, review) => sum + review.rating, 0);
    return (total / reviews.length).toFixed(1);
  };

  const getRatingDistribution = () => {
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      distribution[review.rating as keyof typeof distribution]++;
    });
    return distribution;
  };

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (record: Review) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar icon={<UserOutlined />} />
          <div>
            <div style={{ fontWeight: 500 }}>{record.user.name}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{record.user.email}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Sản phẩm',
      key: 'product',
      render: (record: Review) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar 
            src={record.product?.thumbnail ? 
              (record.product.thumbnail.startsWith('http') ? 
                record.product.thumbnail : 
                `http://127.0.0.1:8000/storage/products/${record.product.thumbnail}`
              ) : undefined
            } 
            shape="square" 
          />
          <div>
            <div style={{ fontWeight: 500, maxWidth: 200 }}>
              {record.product?.name || 'Sản phẩm'}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Đánh giá',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating: number) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Rate disabled defaultValue={rating} style={{ fontSize: 16 }} />
          <span style={{ fontWeight: 500 }}>({rating}/5)</span>
        </div>
      ),
    },
    {
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => (
        <div style={{ maxWidth: 250 }}>
          {content.length > 80 ? `${content.substring(0, 80)}...` : content}
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
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (record: Review) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedReview(record);
              setDetailVisible(true);
            }}
            size="small"
          >
            Xem
          </Button>
          
          {record.status === 'pending' && (
            <>
              <Button
                icon={<CheckOutlined />}
                type="primary"
                size="small"
                onClick={() => handleStatusChange(record.id, 'approved')}
              >
                Duyệt
              </Button>
              <Button
                icon={<CloseOutlined />}
                danger
                size="small"
                onClick={() => handleStatusChange(record.id, 'rejected')}
              >
                Từ chối
              </Button>
            </>
          )}
          
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa đánh giá này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Xóa"
            cancelText="Hủy"
          >
            <Button
              icon={<DeleteOutlined />}
              danger
              size="small"
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const ratingDistribution = getRatingDistribution();

  return (
    <div>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <StarOutlined style={{ color: '#faad14' }} />
            <Title level={3} style={{ margin: 0, color: '#faad14' }}>
              Quản lý Đánh giá
            </Title>
          </div>
        }
        style={{ borderRadius: 8 }}
      >
        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input.Search
              placeholder="Tìm kiếm đánh giá, người dùng, sản phẩm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={4}>
            <Select
              placeholder="Lọc theo trạng thái"
              value={statusFilter}
              onChange={setStatusFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value="pending">Chờ duyệt</Option>
              <Option value="approved">Đã duyệt</Option>
              <Option value="rejected">Từ chối</Option>
            </Select>
          </Col>
          <Col span={4}>
            <Select
              placeholder="Lọc theo sao"
              value={ratingFilter}
              onChange={setRatingFilter}
              allowClear
              style={{ width: '100%' }}
            >
              <Option value={5}>5 sao</Option>
              <Option value={4}>4 sao</Option>
              <Option value={3}>3 sao</Option>
              <Option value={2}>2 sao</Option>
              <Option value={1}>1 sao</Option>
            </Select>
          </Col>
        </Row>

        {/* Statistics */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={4}>
            <Card size="small" style={{ textAlign: 'center', backgroundColor: '#f0f9ff' }}>
              <Statistic
                title="Tổng đánh giá"
                value={reviews.length}
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size="small" style={{ textAlign: 'center', backgroundColor: '#fff7e6' }}>
              <Statistic
                title="Điểm trung bình"
                value={getAverageRating()}
                suffix="/ 5"
                valueStyle={{ color: '#faad14' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size="small" style={{ textAlign: 'center', backgroundColor: '#f6ffed' }}>
              <Statistic
                title="Đã duyệt"
                value={reviews.filter(r => r.status === 'approved').length}
                valueStyle={{ color: '#52c41a' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size="small" style={{ textAlign: 'center', backgroundColor: '#fff7e6' }}>
              <Statistic
                title="Chờ duyệt"
                value={reviews.filter(r => r.status === 'pending').length}
                valueStyle={{ color: '#fa8c16' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size="small" style={{ textAlign: 'center', backgroundColor: '#fff2f0' }}>
              <Statistic
                title="Từ chối"
                value={reviews.filter(r => r.status === 'rejected').length}
                valueStyle={{ color: '#ff4d4f' }}
              />
            </Card>
          </Col>
          <Col span={4}>
            <Card size="small" style={{ textAlign: 'center', backgroundColor: '#f9f0ff' }}>
              <div style={{ fontSize: '14px', color: '#722ed1', marginBottom: '8px' }}>
                Phân bố sao
              </div>
              <div style={{ fontSize: '12px' }}>
                {Object.entries(ratingDistribution).reverse().map(([star, count]) => (
                  <div key={star} style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>{star}⭐</span>
                    <span>{count}</span>
                  </div>
                ))}
              </div>
            </Card>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredReviews}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng cộng ${total} đánh giá`,
          }}
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết đánh giá"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={700}
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
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Người dùng:</Text>
                  <div style={{ marginTop: 4 }}>
                    <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                    {selectedReview.user.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                    {selectedReview.user.email}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Sản phẩm:</Text>
                  <div style={{ marginTop: 4 }}>
                    <Avatar 
                      src={selectedReview.product?.thumbnail ? 
                        (selectedReview.product.thumbnail.startsWith('http') ? 
                          selectedReview.product.thumbnail : 
                          `http://127.0.0.1:8000/storage/products/${selectedReview.product.thumbnail}`
                        ) : undefined
                      } 
                      shape="square" 
                      style={{ marginRight: 8 }} 
                    />
                    {selectedReview.product?.name || 'Sản phẩm'}
                  </div>
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Đánh giá:</Text>
              <div style={{ marginTop: 8 }}>
                <Rate disabled defaultValue={selectedReview.rating} />
                <span style={{ marginLeft: 8, fontWeight: 500 }}>
                  {selectedReview.rating}/5 sao
                </span>
              </div>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Nội dung đánh giá:</Text>
              <div style={{ 
                marginTop: 8, 
                padding: 12, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 4,
                lineHeight: 1.6
              }}>
                {selectedReview.content}
              </div>
            </div>

            <Row gutter={16}>
              <Col span={8}>
                <Text strong>Trạng thái:</Text>
                <div style={{ marginTop: 4 }}>
                  <Tag color={getStatusColor(selectedReview.status)}>
                    {getStatusText(selectedReview.status)}
                  </Tag>
                </div>
              </Col>
              <Col span={8}>
                <Text strong>Ngày tạo:</Text>
                <div style={{ marginTop: 4 }}>
                  {new Date(selectedReview.created_at).toLocaleString('vi-VN')}
                </div>
              </Col>
              <Col span={8}>
                <Text strong>Cập nhật:</Text>
                <div style={{ marginTop: 4 }}>
                  {new Date(selectedReview.updated_at).toLocaleString('vi-VN')}
                </div>
              </Col>
            </Row>

            {selectedReview.status === 'pending' && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Space>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => {
                      handleStatusChange(selectedReview.id, 'approved');
                      setDetailVisible(false);
                    }}
                  >
                    Duyệt đánh giá
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => {
                      handleStatusChange(selectedReview.id, 'rejected');
                      setDetailVisible(false);
                    }}
                  >
                    Từ chối
                  </Button>
                </Space>
              </div>
            )}
          </div>
        )}
      </Modal>
    </div>
  );
};

export default ReviewManagement;