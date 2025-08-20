import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Space,
  Tag,
  Modal,
  message,
  Card,
  Typography,
  Row,
  Col,
  Descriptions,
  Input,
  Popconfirm,
  Badge,
  Tooltip,
  Divider,
  Alert
} from 'antd';
import {
  EyeOutlined,
  CheckOutlined,
  CloseOutlined,
  BankOutlined,
  DollarOutlined,
  CalendarOutlined,
  UserOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { walletService } from '../services/wallet.service';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface WithdrawRequest {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  amount: number;
  bank_name: string;
  account_number: string;
  account_name: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_note?: string;
  created_at: string;
  processed_at?: string;
  processed_by?: {
    id: number;
    name: string;
  };
}

const WithdrawRequestManagement = () => {
  const [requests, setRequests] = useState<WithdrawRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<WithdrawRequest | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const response = await walletService.getWithdrawRequests();
      setRequests(response.data || []);
    } catch (error) {
      message.error('Lỗi khi tải danh sách yêu cầu rút tiền');
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      setActionLoading(true);
      await walletService.approveWithdrawRequest(id);
      message.success('Đã duyệt yêu cầu rút tiền thành công');
      fetchRequests();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi duyệt yêu cầu');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    
    try {
      setActionLoading(true);
      await walletService.rejectWithdrawRequest(selectedRequest.id, rejectReason);
      message.success('Đã từ chối yêu cầu rút tiền');
      setRejectModalVisible(false);
      setRejectReason('');
      setSelectedRequest(null);
      fetchRequests();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Lỗi khi từ chối yêu cầu');
    } finally {
      setActionLoading(false);
    }
  };

  const showRejectModal = (request: WithdrawRequest) => {
    setSelectedRequest(request);
    setRejectModalVisible(true);
  };

  const showDetailModal = (request: WithdrawRequest) => {
    setSelectedRequest(request);
    setDetailModalVisible(true);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'orange';
      case 'approved': return 'green';
      case 'rejected': return 'red';
      default: return 'default';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Đã từ chối';
      default: return 'Không xác định';
    }
  };

  const columns = [
    {
      title: 'Mã YC',
      dataIndex: 'id',
      key: 'id',
      render: (id: number) => (
        <Text strong style={{ color: '#1890ff' }}>
          WR{id.toString().padStart(6, '0')}
        </Text>
      ),
    },
    {
      title: 'Người dùng',
      dataIndex: 'user',
      key: 'user',
      render: (user: any) => (
        <div>
          <div style={{ fontWeight: 600 }}>{user.name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>{user.email}</div>
        </div>
      ),
    },
    {
      title: 'Số tiền',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount: number) => (
        <Text strong style={{ color: '#f5222d', fontSize: '14px' }}>
          {amount.toLocaleString()} VND
        </Text>
      ),
    },
    {
      title: 'Ngân hàng',
      key: 'bank_info',
      render: (record: WithdrawRequest) => (
        <div>
          <div style={{ fontWeight: 600 }}>{record.bank_name}</div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            {record.account_number} - {record.account_name}
          </div>
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
      render: (record: WithdrawRequest) => (
        <Space>
          <Tooltip title="Xem chi tiết">
            <Button
              type="text"
              icon={<EyeOutlined />}
              onClick={() => showDetailModal(record)}
            />
          </Tooltip>
          {record.status === 'pending' && (
            <>
              <Popconfirm
                title="Bạn có chắc muốn duyệt yêu cầu này?"
                onConfirm={() => handleApprove(record.id)}
                okText="Duyệt"
                cancelText="Hủy"
              >
                <Tooltip title="Duyệt">
                  <Button
                    type="text"
                    icon={<CheckOutlined />}
                    style={{ color: '#52c41a' }}
                    loading={actionLoading}
                  />
                </Tooltip>
              </Popconfirm>
              <Tooltip title="Từ chối">
                <Button
                  type="text"
                  icon={<CloseOutlined />}
                  style={{ color: '#ff4d4f' }}
                  onClick={() => showRejectModal(record)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  const pendingCount = requests.filter(r => r.status === 'pending').length;
  const approvedCount = requests.filter(r => r.status === 'approved').length;
  const rejectedCount = requests.filter(r => r.status === 'rejected').length;

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <Title level={2} style={{ color: '#1890ff', marginBottom: 8 }}>
          <BankOutlined /> Quản lý yêu cầu rút tiền
        </Title>
        <Text type="secondary">
          Quản lý và xử lý các yêu cầu rút tiền từ người dùng
        </Text>
      </div>

      {/* Thống kê */}
      <Row gutter={16} style={{ marginBottom: 24 }}>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Badge count={pendingCount} showZero>
                <CalendarOutlined style={{ fontSize: 24, color: '#faad14' }} />
              </Badge>
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 600 }}>{pendingCount}</div>
                <div style={{ color: '#666' }}>Chờ duyệt</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <CheckOutlined style={{ fontSize: 24, color: '#52c41a' }} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 600 }}>{approvedCount}</div>
                <div style={{ color: '#666' }}>Đã duyệt</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <CloseOutlined style={{ fontSize: 24, color: '#ff4d4f' }} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 600 }}>{rejectedCount}</div>
                <div style={{ color: '#666' }}>Đã từ chối</div>
              </div>
            </div>
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <DollarOutlined style={{ fontSize: 24, color: '#1890ff' }} />
              <div style={{ marginTop: 8 }}>
                <div style={{ fontSize: 20, fontWeight: 600 }}>
                  {requests.filter(r => r.status === 'approved')
                    .reduce((sum, r) => sum + Number(r.amount), 0)
                    .toLocaleString()}
                </div>
                <div style={{ color: '#666' }}>Tổng đã rút (VND)</div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Bảng danh sách */}
      <Card>
        <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between' }}>
          <Title level={4} style={{ margin: 0 }}>
            Danh sách yêu cầu rút tiền
          </Title>
          <Button
            icon={<ReloadOutlined />}
            onClick={fetchRequests}
            loading={loading}
          >
            Làm mới
          </Button>
        </div>
        
        <Table
          columns={columns}
          dataSource={requests}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total) => `Tổng ${total} yêu cầu`,
          }}
        />
      </Card>

      {/* Modal chi tiết */}
      <Modal
        title="Chi tiết yêu cầu rút tiền"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedRequest && (
          <div>
            <Descriptions column={2} bordered>
              <Descriptions.Item label="Mã yêu cầu" span={2}>
                <Text strong style={{ color: '#1890ff' }}>
                  WR{selectedRequest.id.toString().padStart(6, '0')}
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Người dùng">
                <div>
                  <UserOutlined /> {selectedRequest.user.name}
                  <br />
                  <Text type="secondary">{selectedRequest.user.email}</Text>
                </div>
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={getStatusColor(selectedRequest.status)}>
                  {getStatusText(selectedRequest.status)}
                </Tag>
              </Descriptions.Item>
              <Descriptions.Item label="Số tiền rút" span={2}>
                <Text strong style={{ color: '#f5222d', fontSize: '16px' }}>
                  {selectedRequest.amount.toLocaleString()} VND
                </Text>
              </Descriptions.Item>
              <Descriptions.Item label="Ngân hàng">
                {selectedRequest.bank_name}
              </Descriptions.Item>
              <Descriptions.Item label="Số tài khoản">
                {selectedRequest.account_number}
              </Descriptions.Item>
              <Descriptions.Item label="Tên chủ TK" span={2}>
                {selectedRequest.account_name}
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo">
                {new Date(selectedRequest.created_at).toLocaleString('vi-VN')}
              </Descriptions.Item>
              {selectedRequest.processed_at && (
                <Descriptions.Item label="Ngày xử lý">
                  {new Date(selectedRequest.processed_at).toLocaleString('vi-VN')}
                </Descriptions.Item>
              )}
            </Descriptions>

            {selectedRequest.admin_note && (
              <div style={{ marginTop: 16 }}>
                <Alert
                  message="Ghi chú từ admin"
                  description={selectedRequest.admin_note}
                  type={selectedRequest.status === 'approved' ? 'success' : 'error'}
                  showIcon
                />
              </div>
            )}

            {selectedRequest.status === 'pending' && (
              <div style={{ marginTop: 16, textAlign: 'right' }}>
                <Space>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    onClick={() => {
                      handleApprove(selectedRequest.id);
                      setDetailModalVisible(false);
                    }}
                    loading={actionLoading}
                  >
                    Duyệt
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => {
                      setDetailModalVisible(false);
                      showRejectModal(selectedRequest);
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

      {/* Modal từ chối */}
      <Modal
        title="Từ chối yêu cầu rút tiền"
        open={rejectModalVisible}
        onOk={handleReject}
        onCancel={() => {
          setRejectModalVisible(false);
          setRejectReason('');
          setSelectedRequest(null);
        }}
        confirmLoading={actionLoading}
        okText="Từ chối"
        cancelText="Hủy"
        okButtonProps={{ danger: true }}
      >
        <div style={{ marginBottom: 16 }}>
          <Text>Lý do từ chối yêu cầu rút tiền:</Text>
        </div>
        <TextArea
          rows={4}
          value={rejectReason}
          onChange={(e) => setRejectReason(e.target.value)}
          placeholder="Nhập lý do từ chối (không bắt buộc)"
        />
      </Modal>
    </div>
  );
};

export default WithdrawRequestManagement;