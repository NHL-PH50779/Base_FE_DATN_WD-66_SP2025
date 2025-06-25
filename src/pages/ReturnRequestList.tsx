import React, { useState, useEffect } from 'react';
import { Table, Button, Tag, Space, message, Modal, Card, Typography } from 'antd';
import { CheckOutlined, CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { axiosInstance } from '../utils/axios.util';

const { Text } = Typography;

interface ReturnRequest {
  id: number;
  user_id: number;
  order_id: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
  user?: {
    name: string;
    email: string;
  };
  order?: {
    total: number;
  };
}

const ReturnRequestList: React.FC = () => {
  const [returnRequests, setReturnRequests] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<ReturnRequest | null>(null);
  const [detailModalVisible, setDetailModalVisible] = useState(false);

  const fetchReturnRequests = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get('/admin/return-requests');
      setReturnRequests(response.data || []);
    } catch (error) {
      console.error('Error fetching return requests:', error);
      message.error('Không thể tải danh sách yêu cầu hoàn hàng');
    } finally {
      setLoading(false);
    }
  };

  const updateReturnRequestStatus = async (id: number, status: 'approved' | 'rejected') => {
    try {
      await axiosInstance.put(`/admin/return-requests/${id}`, { status });
      message.success(`Đã ${status === 'approved' ? 'chấp nhận' : 'từ chối'} yêu cầu hoàn hàng`);
      fetchReturnRequests();
    } catch (error) {
      console.error('Error updating return request:', error);
      message.error('Có lỗi khi cập nhật trạng thái');
    }
  };

  const showDetail = (record: ReturnRequest) => {
    setSelectedRequest(record);
    setDetailModalVisible(true);
  };

  useEffect(() => {
    fetchReturnRequests();
  }, []);

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
      case 'pending': return 'Chờ xử lý';
      case 'approved': return 'Đã chấp nhận';
      case 'rejected': return 'Đã từ chối';
      default: return status;
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      width: 60,
    },
    {
      title: 'Đơn hàng',
      dataIndex: 'order_id',
      key: 'order_id',
      render: (orderId: number) => `#${orderId}`,
    },
    {
      title: 'Khách hàng',
      key: 'customer',
      render: (record: ReturnRequest) => (
        <div>
          <div>{record.user?.name || 'N/A'}</div>
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.user?.email || 'N/A'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Lý do',
      dataIndex: 'reason',
      key: 'reason',
      ellipsis: true,
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
      title: 'Hành động',
      key: 'actions',
      render: (record: ReturnRequest) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
          >
            Chi tiết
          </Button>
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                onClick={() => updateReturnRequestStatus(record.id, 'approved')}
              >
                Chấp nhận
              </Button>
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                onClick={() => updateReturnRequestStatus(record.id, 'rejected')}
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
    <Card
      title={
        <span style={{ color: '#1890ff', fontWeight: 700, fontSize: 22 }}>
          Quản lý yêu cầu hoàn hàng
        </span>
      }
      style={{
        background: 'linear-gradient(135deg, #f0f5ff 0%, #e6fffb 100%)',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(24,144,255,0.08)',
      }}
    >
      <Table
        columns={columns}
        dataSource={returnRequests}
        rowKey="id"
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng ${total} yêu cầu`,
        }}
      />

      <Modal
        title="Chi tiết yêu cầu hoàn hàng"
        open={detailModalVisible}
        onCancel={() => setDetailModalVisible(false)}
        footer={null}
        width={600}
      >
        {selectedRequest && (
          <div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>ID yêu cầu: </Text>
              <Text>{selectedRequest.id}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Đơn hàng: </Text>
              <Text>#{selectedRequest.order_id}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Khách hàng: </Text>
              <Text>{selectedRequest.user?.name} ({selectedRequest.user?.email})</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Lý do hoàn hàng: </Text>
              <Text>{selectedRequest.reason}</Text>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Trạng thái: </Text>
              <Tag color={getStatusColor(selectedRequest.status)}>
                {getStatusText(selectedRequest.status)}
              </Tag>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Ngày tạo: </Text>
              <Text>{new Date(selectedRequest.created_at).toLocaleString('vi-VN')}</Text>
            </div>
            
            {selectedRequest.status === 'pending' && (
              <div style={{ marginTop: 24, textAlign: 'center' }}>
                <Space>
                  <Button
                    type="primary"
                    icon={<CheckOutlined />}
                    style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                    onClick={() => {
                      updateReturnRequestStatus(selectedRequest.id, 'approved');
                      setDetailModalVisible(false);
                    }}
                  >
                    Chấp nhận hoàn hàng
                  </Button>
                  <Button
                    danger
                    icon={<CloseOutlined />}
                    onClick={() => {
                      updateReturnRequestStatus(selectedRequest.id, 'rejected');
                      setDetailModalVisible(false);
                    }}
                  >
                    Từ chối hoàn hàng
                  </Button>
                </Space>
              </div>
            )}
          </div>
        )}
      </Modal>
    </Card>
  );
};

export default ReturnRequestList;