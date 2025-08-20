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
  const [processingIds, setProcessingIds] = useState<Set<string | number>>(new Set());

  const fetchReturnRequests = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      // Lấy return requests và orders có cancel_request
      const [returnResponse, ordersResponse] = await Promise.all([
        axiosInstance.get('/admin/return-requests', {
          headers: { 'Authorization': `Bearer ${token}` }
        }),
        axiosInstance.get('/admin/orders', {
          headers: { 'Authorization': `Bearer ${token}` }
        })
      ]);
      
      const returnRequests = returnResponse.data.data || returnResponse.data || [];
      
      // Lọc orders có cancel_request
      const orders = ordersResponse.data.data || ordersResponse.data || [];
      console.log('All orders:', orders);
      console.log('Orders with cancel_request:', orders.filter((order: any) => order.cancel_request));
      
      const cancelRequests = orders
        .filter((order: any) => (order.cancel_request || order.cancel_reason) && order.order_status_id !== 6)
        .map((order: any) => ({
          id: `cancel_${order.id}`,
          user_id: order.user_id,
          order_id: order.id,
          reason: order.cancel_request || order.cancel_reason || order.note || 'Yêu cầu hủy đơn',
          status: 'pending',
          created_at: order.updated_at,
          user: order.user,
          order: { total: parseFloat(order.total || 0) },
          type: 'cancel',
          original_order: order
        }));
      
      setReturnRequests([...returnRequests, ...cancelRequests]);
    } catch (error) {
      console.error('Error fetching requests:', error);
      message.error('Không thể tải danh sách yêu cầu');
    } finally {
      setLoading(false);
    }
  };

  const updateReturnRequestStatus = async (id: string | number, status: 'approved' | 'rejected') => {
    console.log('Updating return request:', { id, status });
    
    // Thêm vào danh sách đang xử lý
    setProcessingIds(prev => new Set([...prev, id]));
    
    try {
      const token = localStorage.getItem('token');
      
      if (String(id).startsWith('cancel_')) {
        // Xử lý yêu cầu hủy đơn
        const orderId = String(id).replace('cancel_', '');
        if (status === 'approved') {
          await axiosInstance.put(`/admin/orders/${orderId}/order-status`, {
            order_status_id: 6 // Trạng thái đã hủy
          }, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          
          // Gửi thông báo cho client
          const clientNotifications = JSON.parse(localStorage.getItem('client_notifications') || '[]');
          clientNotifications.push({
            id: Date.now(),
            type: 'order_cancelled',
            message: `Đơn hàng #${orderId} đã được hủy bởi quản trị viên`,
            order_id: orderId,
            created_at: new Date().toISOString(),
            read: false
          });
          localStorage.setItem('client_notifications', JSON.stringify(clientNotifications));
          
          message.success('Đã chấp nhận hủy đơn hàng và thông báo cho khách hàng');
          
          // Cập nhật trạng thái trong danh sách
          setReturnRequests(prev => 
            prev.map(req => 
              req.id === id ? { ...req, status: 'approved' as const } : req
            )
          );
        } else {
          // Từ chối hủy
          message.success('Đã từ chối yêu cầu hủy đơn');
          
          // Cập nhật trạng thái trong danh sách
          setReturnRequests(prev => 
            prev.map(req => 
              req.id === id ? { ...req, status: 'rejected' as const } : req
            )
          );
        }
      } else {
        // Xử lý yêu cầu hoàn hàng thông thường
        const request = returnRequests.find(req => req.id === id);
        if (request) {
          // Cập nhật trạng thái đơn hàng trực tiếp
          if (status === 'approved') {
            await axiosInstance.put(`/admin/orders/${request.order_id}/order-status`, {
              order_status_id: 8
            }, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
            
            await axiosInstance.put(`/admin/orders/${request.order_id}/payment-status`, {
              payment_status_id: 3
            }, {
              headers: { 'Authorization': `Bearer ${token}` }
            });
          }
          
          message.success(`Đã ${status === 'approved' ? 'chấp nhận hoàn hàng và hoàn tiền' : 'từ chối hoàn hàng'}`);
          
          // Cập nhật trạng thái trong danh sách
          setReturnRequests(prev => 
            prev.map(req => {
              if (req.id === id) {
                return { 
                  ...req, 
                  status: status as 'approved' | 'rejected'
                };
              }
              return req;
            })
          );
        }
      }
      
      // Force refresh sau 500ms để đảm bảo đồng bộ với backend
      setTimeout(() => {
        fetchReturnRequests();
      }, 500);
      
    } catch (error: any) {
      console.error('Error updating request:', error);
      if (error.response?.status === 400) {
        message.warning(error.response?.data?.message || 'Yêu cầu đã được xử lý trước đó');
        fetchReturnRequests();
      } else {
        message.error('Có lỗi khi cập nhật trạng thái');
      }
    } finally {
      // Loại bỏ khỏi danh sách đang xử lý
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(id);
        return newSet;
      });
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
      render: (id: string | number) => {
        if (String(id).startsWith('cancel_')) {
          return `C${String(id).replace('cancel_', '')}`;
        }
        return id;
      },
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
      title: 'Loại yêu cầu',
      key: 'type',
      render: (record: any) => (
        <Tag color={record.type === 'cancel' ? 'blue' : 'orange'}>
          {record.type === 'cancel' ? 'Hủy đơn' : 'Hoàn hàng'}
        </Tag>
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
      width: 120,
      fixed: 'right',
      render: (record: ReturnRequest) => (
        <Space>
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => showDetail(record)}
            title="Chi tiết"
          />
          {record.status === 'pending' && (
            <>
              <Button
                type="primary"
                size="small"
                icon={<CheckOutlined />}
                style={{ backgroundColor: '#52c41a', borderColor: '#52c41a' }}
                loading={processingIds.has(record.id)}
                disabled={processingIds.has(record.id)}
                title="Chấp nhận"
                onClick={() => {
                  if (String(record.id).startsWith('cancel_')) {
                    Modal.confirm({
                      title: 'Xác nhận hủy đơn hàng',
                      content: (
                        <div>
                          <p>Bạn có chắc chắn muốn chấp nhận hủy đơn hàng #{record.order_id}?</p>
                          <p style={{ color: '#ff4d4f', fontSize: '12px' }}>
                            ⚠️ Lưu ý: Đơn hàng sẽ chuyển thành trạng thái "Đã hủy" và không thể hoàn tác.
                          </p>
                        </div>
                      ),
                      onOk: () => updateReturnRequestStatus(record.id, 'approved'),
                      okText: 'Xác nhận hủy',
                      cancelText: 'Hủy bỏ',
                      okType: 'danger'
                    });
                  } else {
                    updateReturnRequestStatus(record.id, 'approved');
                  }
                }}
              />
              <Button
                danger
                size="small"
                icon={<CloseOutlined />}
                loading={processingIds.has(record.id)}
                disabled={processingIds.has(record.id)}
                title="Từ chối"
                onClick={() => updateReturnRequestStatus(record.id, 'rejected')}
              />
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
          Quản lý yêu cầu hoàn hàng & Hủy đơn
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
        scroll={{ x: 1200 }}
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
              <Text strong>Loại yêu cầu: </Text>
              <Tag color={(selectedRequest as any).type === 'cancel_vnpay' ? 'blue' : 'orange'}>
                {(selectedRequest as any).type === 'cancel_vnpay' ? 'Hủy đơn VNPay' : 'Hoàn hàng'}
              </Tag>
            </div>
            <div style={{ marginBottom: 16 }}>
              <Text strong>Lý do: </Text>
              <Text>{selectedRequest.reason}</Text>
            </div>
            {(selectedRequest as any).type === 'cancel_vnpay' && (
              <div style={{ marginBottom: 16 }}>
                <Text strong>Số tiền hoàn: </Text>
                <Text style={{ color: '#52c41a', fontWeight: 'bold' }}>
                  {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
                    .format((selectedRequest as any).original_order?.total || 0)}
                </Text>
              </div>
            )}
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
                      if (String(selectedRequest.id).startsWith('cancel_')) {
                        Modal.confirm({
                          title: 'Xác nhận hủy đơn hàng',
                          content: (
                            <div>
                              <p>Bạn có chắc chắn muốn chấp nhận hủy đơn hàng #{selectedRequest.order_id}?</p>
                              <p style={{ color: '#ff4d4f', fontSize: '12px' }}>
                                ⚠️ Đơn hàng sẽ chuyển thành trạng thái "Đã hủy" và không thể hoàn tác.
                              </p>
                            </div>
                          ),
                          onOk: () => {
                            updateReturnRequestStatus(selectedRequest.id, 'approved');
                            setDetailModalVisible(false);
                          },
                          okText: 'Xác nhận hủy',
                          cancelText: 'Hủy bỏ',
                          okType: 'danger'
                        });
                      } else {
                        updateReturnRequestStatus(selectedRequest.id, 'approved');
                        setDetailModalVisible(false);
                      }
                    }}
                  >
                    {String(selectedRequest.id).startsWith('cancel_') ? 'Chấp nhận hủy đơn' : 'Chấp nhận hoàn hàng'}
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