import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  Input,
  Card,
  Typography,
  message,
  Avatar,
  Popconfirm,
  Select,
  DatePicker,
  Row,
  Col
} from 'antd';
import {
  EyeOutlined,
  DeleteOutlined,
  CheckOutlined,
  CloseOutlined,
  MessageOutlined,
  UserOutlined,
  CalendarOutlined
} from '@ant-design/icons';
import { commentService } from '../services/comment.service';

const { Title, Text } = Typography;
const { TextArea } = Input;
const { Option } = Select;
const { RangePicker } = DatePicker;

interface Comment {
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
  };
  product: {
    id: number;
    name: string;
  };
}

const CommentManagement = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    fetchComments();
  }, []);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const response = await commentService.getAllComments();
      const commentsData = response.data || response;
      
      // Lọc chỉ lấy bình luận (rating = 0)
      const filteredComments = commentsData.filter((comment: any) => comment.rating === 0);
      setComments(filteredComments);
    } catch (error) {
      console.error('Error fetching comments:', error);
      message.error('Lỗi khi tải danh sách bình luận');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (commentId: number, newStatus: 'approved' | 'rejected') => {
    try {
      await commentService.updateCommentStatus(commentId, newStatus);
      setComments(prev => 
        prev.map(comment => 
          comment.id === commentId 
            ? { ...comment, status: newStatus, updated_at: new Date().toISOString() }
            : comment
        )
      );
      message.success(`Đã ${newStatus === 'approved' ? 'duyệt' : 'từ chối'} bình luận`);
    } catch (error) {
      console.error('Error updating comment status:', error);
      message.error('Lỗi khi cập nhật trạng thái');
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      await commentService.deleteComment(commentId);
      setComments(prev => prev.filter(comment => comment.id !== commentId));
      message.success('Đã xóa bình luận');
    } catch (error) {
      console.error('Error deleting comment:', error);
      message.error('Lỗi khi xóa bình luận');
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

  const filteredComments = comments.filter(comment => {
    const matchesStatus = !statusFilter || comment.status === statusFilter;
    const matchesSearch = !searchText || 
      comment.content.toLowerCase().includes(searchText.toLowerCase()) ||
      comment.user.name.toLowerCase().includes(searchText.toLowerCase()) ||
      comment.product.name.toLowerCase().includes(searchText.toLowerCase());
    
    return matchesStatus && matchesSearch;
  });

  const columns = [
    {
      title: 'Người dùng',
      key: 'user',
      render: (record: Comment) => (
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
      render: (record: Comment) => (
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
      title: 'Nội dung',
      dataIndex: 'content',
      key: 'content',
      render: (content: string) => (
        <div style={{ maxWidth: 300 }}>
          {content.length > 100 ? `${content.substring(0, 100)}...` : content}
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
      render: (record: Comment) => (
        <Space>
          <Button
            icon={<EyeOutlined />}
            onClick={() => {
              setSelectedComment(record);
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
            title="Bạn có chắc chắn muốn xóa bình luận này?"
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

  return (
    <div>
      <Card
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <MessageOutlined style={{ color: '#fff', fontSize: '18px' }} />
            </div>
            <Title level={3} style={{ 
              margin: 0, 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 700
            }}>
              💬 Quản lý Bình luận
            </Title>
          </div>
        }
        style={{ 
          borderRadius: 16,
          boxShadow: '0 10px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(102, 126, 234, 0.1)',
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)'
        }}
      >
        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 16 }}>
          <Col span={8}>
            <Input.Search
              placeholder="Tìm kiếm bình luận, người dùng, sản phẩm..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
            />
          </Col>
          <Col span={6}>
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
          <Col span={6}>
            <RangePicker
              placeholder={['Từ ngày', 'Đến ngày']}
              style={{ width: '100%' }}
            />
          </Col>
        </Row>

        {/* Statistics */}
        <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
          <Col span={6}>
            <Card size="small" style={{ 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              border: 'none'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 8 }}>
                {comments.length}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>📊 Tổng bình luận</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
              color: '#fff',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(82, 196, 26, 0.3)',
              border: 'none'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 8 }}>
                {comments.filter(c => c.status === 'approved').length}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>✅ Đã duyệt</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)',
              color: '#fff',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(250, 140, 22, 0.3)',
              border: 'none'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 8 }}>
                {comments.filter(c => c.status === 'pending').length}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>⏳ Chờ duyệt</div>
            </Card>
          </Col>
          <Col span={6}>
            <Card size="small" style={{ 
              textAlign: 'center', 
              background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
              color: '#fff',
              borderRadius: 16,
              boxShadow: '0 8px 32px rgba(255, 77, 79, 0.3)',
              border: 'none'
            }}>
              <div style={{ fontSize: '32px', fontWeight: 'bold', marginBottom: 8 }}>
                {comments.filter(c => c.status === 'rejected').length}
              </div>
              <div style={{ fontSize: '14px', opacity: 0.9 }}>❌ Từ chối</div>
            </Card>
          </Col>
        </Row>

        <Table
          columns={columns}
          dataSource={filteredComments}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng cộng ${total} bình luận`,
          }}
          style={{
            borderRadius: 16,
            overflow: 'hidden',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}
          className="modern-table"
        />
      </Card>

      {/* Detail Modal */}
      <Modal
        title="Chi tiết bình luận"
        open={detailVisible}
        onCancel={() => setDetailVisible(false)}
        width={600}
        footer={[
          <Button key="close" onClick={() => setDetailVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {selectedComment && (
          <div>
            <Row gutter={16}>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Người dùng:</Text>
                  <div style={{ marginTop: 4 }}>
                    <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                    {selectedComment.user.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                    {selectedComment.user.email}
                  </div>
                </div>
              </Col>
              <Col span={12}>
                <div style={{ marginBottom: 16 }}>
                  <Text strong>Sản phẩm:</Text>
                  <div style={{ marginTop: 4 }}>
                    <Avatar 
                      src={selectedComment.product?.thumbnail ? 
                        (selectedComment.product.thumbnail.startsWith('http') ? 
                          selectedComment.product.thumbnail : 
                          `http://127.0.0.1:8000/storage/products/${selectedComment.product.thumbnail}`
                        ) : undefined
                      } 
                      shape="square" 
                      style={{ marginRight: 8 }} 
                    />
                    {selectedComment.product?.name || 'Sản phẩm'}
                  </div>
                </div>
              </Col>
            </Row>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Nội dung bình luận:</Text>
              <div style={{ 
                marginTop: 8, 
                padding: 12, 
                backgroundColor: '#f5f5f5', 
                borderRadius: 4,
                lineHeight: 1.6
              }}>
                {selectedComment.content}
              </div>
            </div>

            <Row gutter={16}>
              <Col span={8}>
                <Text strong>Trạng thái:</Text>
                <div style={{ marginTop: 4 }}>
                  <Tag color={getStatusColor(selectedComment.status)}>
                    {getStatusText(selectedComment.status)}
                  </Tag>
                </div>
              </Col>
              <Col span={8}>
                <Text strong>Ngày tạo:</Text>
                <div style={{ marginTop: 4 }}>
                  {new Date(selectedComment.created_at).toLocaleString('vi-VN')}
                </div>
              </Col>
              <Col span={8}>
                <Text strong>Cập nhật:</Text>
                <div style={{ marginTop: 4 }}>
                  {new Date(selectedComment.updated_at).toLocaleString('vi-VN')}
                </div>
              </Col>
            </Row>

            {selectedComment.status === 'pending' && (
              <div style={{ marginTop: 16, textAlign: 'center' }}>
                <Space>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => {
                      handleStatusChange(selectedComment.id, 'approved');
                      setDetailVisible(false);
                    }}
                  >
                    Duyệt bình luận
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => {
                      handleStatusChange(selectedComment.id, 'rejected');
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

export default CommentManagement;