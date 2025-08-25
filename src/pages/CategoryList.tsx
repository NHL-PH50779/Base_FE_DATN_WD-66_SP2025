import React, { useEffect, useState } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  message,
  Popconfirm,
  Space,
  Card,
  Typography
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { categoryService } from '../services/category.service';

const { Title } = Typography;

interface Category {
  id: number;
  name: string;
  products_count?: number;
  created_at: string;
  updated_at: string;
}

const CategoryList = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await categoryService.getAllCategories();
      setCategories(response.data);
      
      // Hiển thị thông báo nếu có lỗi nhưng vẫn có data
      if (response.error) {
        message.warning(response.error);
      }
    } catch (error: any) {
      const errorMsg = error.message.includes('timeout') || error.message.includes('chậm')
        ? 'Kết nối chậm - Vui lòng kiểm tra mạng'
        : 'Lỗi khi tải danh sách danh mục';
      message.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    form.setFieldsValue({ name: category.name });
    setModalVisible(true);
  };

  const handleSubmit = async (values: { name: string }) => {
    try {
      if (editingCategory) {
        await categoryService.updateCategory(editingCategory.id, values);
        message.success('Cập nhật danh mục thành công');
      } else {
        await categoryService.createCategory(values);
        message.success('Thêm danh mục thành công');
      }
      setModalVisible(false);
      fetchCategories();
    } catch (error: any) {
      console.log('Error caught:', error);
      console.log('Error response:', error.response?.data);
      
      let errorMsg = 'Có lỗi xảy ra';
      
      if (error.message.includes('timeout') || error.message.includes('chậm')) {
        errorMsg = 'Kết nối chậm - Vui lòng thử lại';
      } else if (error.response?.data?.errors?.name) {
        errorMsg = 'Tên danh mục đã tồn tại, vui lòng chọn tên khác';
      } else if (error.response?.data?.message) {
        errorMsg = error.response.data.message;
      }
      
      console.log('Final error message:', errorMsg);
      message.error(errorMsg);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await categoryService.deleteCategory(id);
      message.success('Xóa danh mục thành công');
      fetchCategories();
    } catch (error: any) {
      const errorMsg = error.message.includes('timeout') || error.message.includes('chậm')
        ? 'Kết nối chậm - Vui lòng thử lại'
        : error.response?.data?.message || 'Có lỗi xảy ra';
      message.error(errorMsg);
    }
  };

  const columns = [
    {
      title: 'STT',
      key: 'stt',
      width: 60,
      render: (_: any, __: any, index: number) => index + 1,
    },
    {
      title: 'Tên danh mục',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Số lượng sản phẩm',
      dataIndex: 'products_count',
      key: 'products_count',
      width: 150,
      render: (count: number) => count || 0,
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
      width: 150,
      render: (_: any, record: Category) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/categories/${record.id}`)}
          >
            Chi tiết
          </Button>
          <Button
            type="primary"
            size="small"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa danh mục này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
          >
            <Button
              type="primary"
              danger
              size="small"
              icon={<DeleteOutlined />}
            >
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Quản lý danh mục</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm danh mục
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={categories}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng cộng ${total} danh mục`,
        }}
      />

      <Modal
        title={editingCategory ? 'Sửa danh mục' : 'Thêm danh mục'}
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
            label="Tên danh mục"
            rules={[
              { required: true, message: 'Vui lòng nhập tên danh mục' },
              { max: 255, message: 'Tên danh mục không được quá 255 ký tự' }
            ]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingCategory ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CategoryList;