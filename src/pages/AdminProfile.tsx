import React, { useState } from 'react';
import { Card, Descriptions, Avatar, Button, Row, Col, Modal, Form, Input, message } from 'antd';
import { UserOutlined, EditOutlined } from '@ant-design/icons';
import { authService } from '../services/auth.service';

const AdminProfile: React.FC = () => {
  const user = authService.getUser();
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [userInfo, setUserInfo] = useState({
    name: user?.name || 'Admin',
    email: user?.email || 'admin@techstore.com'
  });
  
  const handleEdit = () => {
    form.setFieldsValue(userInfo);
    setEditModalVisible(true);
  };
  
  const handleSave = async (values: any) => {
    try {
      // Cập nhật state để hiển thị thông tin mới
      setUserInfo(values);
      // Ở đây bạn có thể gọi API để cập nhật thông tin
      message.success('Cập nhật thông tin thành công!');
      setEditModalVisible(false);
    } catch (error) {
      message.error('Có lỗi xảy ra khi cập nhật thông tin!');
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Row gutter={24}>
        <Col span={8}>
          <Card>
            <div style={{ textAlign: 'center' }}>
              <Avatar 
                size={120} 
                icon={<UserOutlined />} 
                style={{ 
                  backgroundColor: '#1890ff',
                  marginBottom: 16
                }}
              />
              <h2>{userInfo.name}</h2>
              <p style={{ color: '#666' }}>Quản trị viên hệ thống</p>
              <Button type="primary" icon={<EditOutlined />} onClick={handleEdit}>
                Chỉnh sửa thông tin
              </Button>
            </div>
          </Card>
        </Col>
        
        <Col span={16}>
          <Card title="Thông tin tài khoản">
            <Descriptions column={1} bordered>
              <Descriptions.Item label="Họ và tên">
                {userInfo.name}
              </Descriptions.Item>
              <Descriptions.Item label="Email">
                {userInfo.email}
              </Descriptions.Item>
              <Descriptions.Item label="Vai trò">
                Quản trị viên
              </Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <span style={{ color: '#52c41a' }}>Đang hoạt động</span>
              </Descriptions.Item>
              <Descriptions.Item label="Ngày tạo tài khoản">
                {new Date().toLocaleDateString('vi-VN')}
              </Descriptions.Item>
              <Descriptions.Item label="Lần đăng nhập cuối">
                {new Date().toLocaleString('vi-VN')}
              </Descriptions.Item>
            </Descriptions>
          </Card>
        </Col>
      </Row>
      
      {/* Edit Modal */}
      <Modal
        title="Chỉnh sửa thông tin tài khoản"
        open={editModalVisible}
        onCancel={() => setEditModalVisible(false)}
        footer={null}
        width={500}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
        >
          <Form.Item
            label="Họ và tên"
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ và tên!' }]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input />
          </Form.Item>
          
          <Form.Item>
            <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
              <Button onClick={() => setEditModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                Lưu thay đổi
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminProfile;