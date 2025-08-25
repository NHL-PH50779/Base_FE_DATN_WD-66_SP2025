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
import { brandService } from '../services/brand.service';

const { Title } = Typography;

interface Brand {
  id: number;
  name: string;
  products_count?: number;
  created_at: string;
  updated_at: string;
}

const BrandList = () => {
  const navigate = useNavigate();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchBrands(true); // Force refresh khi load trang
  }, []);

  const fetchBrands = async (forceRefresh = false) => {
    setLoading(true);
    try {
      const response = await brandService.getAllBrands(forceRefresh);
      setBrands(response.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách thương hiệu');
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingBrand(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (brand: Brand) => {
    setEditingBrand(brand);
    form.setFieldsValue({ name: brand.name });
    setModalVisible(true);
  };

  const handleSubmit = async (values: { name: string }) => {
    try {
      if (editingBrand) {
        await brandService.updateBrand(editingBrand.id, values);
        message.success('Cập nhật thương hiệu thành công');
      } else {
        await brandService.createBrand(values);
        message.success('Thêm thương hiệu thành công');
      }
      setModalVisible(false);
      fetchBrands(true); // Force refresh
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await brandService.deleteBrand(id);
      message.success('Xóa thương hiệu thành công');
      fetchBrands();
    } catch (error: any) {
      if (error.response?.status === 404) {
        message.warning('Thương hiệu đã được xóa trước đó');
      } else if (error.response?.status === 400) {
        message.error(error.response?.data?.message || 'Không thể xóa thương hiệu này');
      } else {
        message.error(error.response?.data?.message || 'Có lỗi xảy ra');
      }
      // Force refresh sau mọi lỗi
      fetchBrands(true);
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
      title: 'Tên thương hiệu',
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
      render: (_: any, record: Brand) => (
        <Space>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/brands/${record.id}`)}
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
          {record.name !== 'Không xác định' && (
            <Popconfirm
              title="Bạn có chắc muốn xóa thương hiệu này?"
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
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>Quản lý thương hiệu</Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
        >
          Thêm thương hiệu
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={brands}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Tổng cộng ${total} thương hiệu`,
        }}
      />

      <Modal
        title={editingBrand ? 'Sửa thương hiệu' : 'Thêm thương hiệu'}
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
            label="Tên thương hiệu"
            rules={[
              { required: true, message: 'Vui lòng nhập tên thương hiệu' },
              { max: 255, message: 'Tên thương hiệu không được quá 255 ký tự' }
            ]}
          >
            <Input placeholder="Nhập tên thương hiệu" />
          </Form.Item>

          <Form.Item style={{ marginBottom: 0, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingBrand ? 'Cập nhật' : 'Thêm'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default BrandList;