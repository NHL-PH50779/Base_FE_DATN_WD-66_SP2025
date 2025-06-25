import { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Modal, message, Card, Select, Form, Input } from "antd";
import { EditOutlined, DeleteOutlined, UserOutlined, PlusOutlined, EyeOutlined, ReloadOutlined } from "@ant-design/icons";
import { userService } from "../services/user.service";

const { Option } = Select;

interface User {
  id: number;
  name: string;
  email: string;
  role: 'client' | 'admin' | 'super_admin';
  created_at: string;
}

export default function UserList() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [viewingUser, setViewingUser] = useState<User | null>(null);
  const [viewModalVisible, setViewModalVisible] = useState(false);
  const [form] = Form.useForm();
  
  // Lấy role của user hiện tại
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const currentUserRole = currentUser.role;

  const fetchUsers = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const response = await userService.getAllUsers();
      console.log('Users API response:', response);
      console.log('Users data:', response.data);
      
      // Debug: Kiểm tra user atun@gmail.com
      const atunUser = response.data?.find((user: User) => user.email === 'atun@gmail.com');
      if (atunUser) {
        console.log('Found atun user:', atunUser);
      }
      
      setUsers(response.data || []);
      
      if (forceRefresh) {
        message.success('Dữ liệu đã được cập nhật!');
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      message.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role
    });
    setModalVisible(true);
  };

  const handleView = (user: User) => {
    setViewingUser(user);
    setViewModalVisible(true);
  };

  const handleSubmit = async (values: any) => {
    try {
      if (editingUser) {
        await userService.updateUser(editingUser.id, values);
        if (editingUser.role !== values.role) {
          message.success(`Đã thay đổi vai trò thành ${values.role === 'admin' ? 'Quản trị viên' : 'Khách hàng'}`);
        } else {
          message.success('Cập nhật người dùng thành công');
        }
      } else {
        await userService.createUser(values);
        message.success('Thêm người dùng thành công');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await userService.deleteUser(id);
      message.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Họ tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) => {
        const roleConfig = {
          'super_admin': { color: 'purple', text: 'Siêu quản trị' },
          'admin': { color: 'red', text: 'Quản trị viên' },
          'client': { color: 'blue', text: 'Khách hàng' }
        };
        const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.client;
        return (
          <Tag color={config.color}>
            {config.text}
          </Tag>
        );
      },
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: "Thao tác",
      key: "actions",
      width: 200,
      render: (_: any, record: User) => (
        <Space>
          {/* Chỉ super_admin mới được xem thông tin */}
          {currentUserRole === 'super_admin' && (
            <Button
              type="primary"
              size="small"
              icon={<EyeOutlined />}
              onClick={() => handleView(record)}
            >
              Xem
            </Button>
          )}
          <Button
            type="default"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="primary"
            danger
            size="small"
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record.id)}
            disabled={
              // Admin chỉ xóa được client, super_admin xóa được tất cả
              currentUserRole === 'admin' ? record.role !== 'client' : false
            }
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Space>
          <UserOutlined />
          <span style={{ color: "#1890ff", fontWeight: 700, fontSize: 22 }}>
            Quản lý người dùng
          </span>
        </Space>
        <Space>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => fetchUsers(true)}
            loading={loading}
          >
            Làm mới
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleAdd}
          >
            Thêm người dùng
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng cộng ${total} người dùng`,
        }}
      />

      {/* Add/Edit Modal */}
      <Modal
        title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}
        open={modalVisible}
        onCancel={() => setModalVisible(false)}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên"
            rules={[
              { required: true, message: 'Vui lòng nhập tên' },
              { max: 255, message: 'Tên không được quá 255 ký tự' }
            ]}
          >
            <Input placeholder="Nhập tên người dùng" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập email" />
          </Form.Item>

          {!editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}

          {editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu mới (tùy chọn)"
              rules={[
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu mới (bỏ trống nếu không đổi)" />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="client">Khách hàng</Option>
              {/* Admin có thể tạo admin khác */}
              {(currentUserRole === 'admin' || currentUserRole === 'super_admin') && (
                <Option value="admin">Quản trị viên</Option>
              )}
              {/* Chỉ super_admin mới tạo được super_admin khác */}
              {currentUserRole === 'super_admin' && (
                <Option value="super_admin">Siêu quản trị</Option>
              )}
            </Select>
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingUser ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* View Modal */}
      <Modal
        title="Chi tiết người dùng"
        open={viewModalVisible}
        onCancel={() => setViewModalVisible(false)}
        footer={[
          <Button key="close" onClick={() => setViewModalVisible(false)}>
            Đóng
          </Button>
        ]}
      >
        {viewingUser && (
          <div>
            <p><strong>ID:</strong> {viewingUser.id}</p>
            <p><strong>Tên:</strong> {viewingUser.name}</p>
            <p><strong>Email:</strong> {viewingUser.email}</p>
            <p><strong>Vai trò:</strong> 
              {(() => {
                const roleConfig = {
                  'super_admin': { color: 'purple', text: 'Siêu quản trị' },
                  'admin': { color: 'red', text: 'Quản trị viên' },
                  'client': { color: 'blue', text: 'Khách hàng' }
                };
                const config = roleConfig[viewingUser.role as keyof typeof roleConfig] || roleConfig.client;
                return (
                  <Tag color={config.color} style={{ marginLeft: 8 }}>
                    {config.text}
                  </Tag>
                );
              })()} 
            </p>
            <p><strong>Ngày tạo:</strong> {new Date(viewingUser.created_at).toLocaleString('vi-VN')}</p>
          </div>
        )}
      </Modal>
    </Card>
  );
}