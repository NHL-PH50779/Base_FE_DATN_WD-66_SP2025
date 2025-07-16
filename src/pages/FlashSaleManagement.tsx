import React, { useState, useEffect } from 'react';
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  InputNumber,
  message,
  Popconfirm,
  Tag,
  Space,
  Typography
} from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, FireOutlined } from '@ant-design/icons';
import axios from 'axios';
import dayjs from 'dayjs';

// Setup axios interceptor
axios.defaults.baseURL = 'http://localhost:8000/api';
axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface FlashSale {
  id: number;
  name: string;
  description: string;
  start_time: string;
  end_time: string;
  is_active: boolean;
  status: string;
  items: FlashSaleItem[];
}

interface FlashSaleItem {
  id: number;
  product: {
    id: number;
    name: string;
    thumbnail: string;
  };
  original_price: number;
  sale_price: number;
  discount_percentage: number;
  quantity_limit: number;
  sold_quantity: number;
  sold_percentage: number;
}

interface Product {
  id: number;
  name: string;
  price: number;
}

const FlashSaleManagement: React.FC = () => {
  const [flashSales, setFlashSales] = useState<FlashSale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingFlashSale, setEditingFlashSale] = useState<FlashSale | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchFlashSales();
    fetchProducts();
  }, []);

  const fetchFlashSales = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/admin/flash-sales');
      setFlashSales(response.data.data || []);
    } catch (error) {
      message.error('Không thể tải danh sách Flash Sale');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/products', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = response.data.data || response.data || [];
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching products:', error);
      message.error('Không thể tải danh sách sản phẩm');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const payload = {
        name: values.name,
        description: values.description,
        start_time: values.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        end_time: values.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
        products: values.products.map((p: any) => ({
          product_id: p.product_id,
          sale_price: p.sale_price,
          quantity_limit: p.quantity_limit,
          discount_percentage: p.discount_percentage
        }))
      };

      if (editingFlashSale) {
        await axios.put(`/admin/flash-sales/${editingFlashSale.id}`, payload);
        message.success('Cập nhật Flash Sale thành công');
      } else {
        await axios.post('/admin/flash-sales', payload);
        message.success('Tạo Flash Sale thành công');
      }

      setModalVisible(false);
      setEditingFlashSale(null);
      form.resetFields();
      fetchFlashSales();
    } catch (error: any) {
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (flashSale: FlashSale) => {
    setEditingFlashSale(flashSale);
    form.setFieldsValue({
      name: flashSale.name,
      description: flashSale.description,
      dateRange: [dayjs(flashSale.start_time), dayjs(flashSale.end_time)],
      products: flashSale.items.map(item => ({
        product_id: item.product.id,
        sale_price: item.sale_price,
        quantity_limit: item.quantity_limit,
        discount_percentage: item.discount_percentage,
        original_price: item.original_price
      }))
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`/admin/flash-sales/${id}`);
      message.success('Xóa Flash Sale thành công');
      fetchFlashSales();
    } catch (error) {
      message.error('Không thể xóa Flash Sale');
    }
  };

  const getStatusTag = (status: string) => {
    const statusConfig = {
      upcoming: { color: 'blue', text: 'Sắp diễn ra' },
      active: { color: 'green', text: 'Đang diễn ra' },
      ended: { color: 'red', text: 'Đã kết thúc' },
      inactive: { color: 'gray', text: 'Không hoạt động' }
    };
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.inactive;
    return <Tag color={config.color}>{config.text}</Tag>;
  };

  const columns = [
    {
      title: 'Tên chương trình',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <strong>{text}</strong>
    },
    {
      title: 'Thời gian',
      key: 'time',
      render: (record: FlashSale) => (
        <div>
          <div>Bắt đầu: {dayjs(record.start_time).format('DD/MM/YYYY HH:mm')}</div>
          <div>Kết thúc: {dayjs(record.end_time).format('DD/MM/YYYY HH:mm')}</div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => getStatusTag(status)
    },
    {
      title: 'Sản phẩm',
      key: 'products',
      render: (record: FlashSale) => `${record.items.length} sản phẩm`
    },
    {
      title: 'Đã bán',
      key: 'sold',
      render: (record: FlashSale) => {
        const totalSold = record.items.reduce((sum, item) => sum + item.sold_quantity, 0);
        return totalSold;
      }
    },
    {
      title: 'Thao tác',
      key: 'actions',
      render: (record: FlashSale) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
            size="small"
          >
            Sửa
          </Button>
          <Popconfirm
            title="Bạn có chắc muốn xóa Flash Sale này?"
            onConfirm={() => handleDelete(record.id)}
            okText="Có"
            cancelText="Không"
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
      )
    }
  ];

  return (
    <div style={{ padding: 24 }}>
      <div style={{ marginBottom: 16, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Title level={2}>
          <FireOutlined style={{ color: '#ff4d4f' }} /> Quản lý Flash Sale
        </Title>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => {
            setEditingFlashSale(null);
            form.resetFields();
            setModalVisible(true);
          }}
        >
          Tạo Flash Sale
        </Button>
      </div>

      <Card>
        <Table
          columns={columns}
          dataSource={flashSales}
          rowKey="id"
          loading={loading}
          pagination={{ pageSize: 10 }}
        />
      </Card>

      <Modal
        title={editingFlashSale ? 'Sửa Flash Sale' : 'Tạo Flash Sale'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingFlashSale(null);
          form.resetFields();
        }}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="name"
            label="Tên chương trình"
            rules={[{ required: true, message: 'Vui lòng nhập tên chương trình' }]}
          >
            <Input placeholder="Ví dụ: Flash Sale Cuối Tuần" />
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea placeholder="Mô tả về chương trình Flash Sale" />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Thời gian diễn ra"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
          >
            <RangePicker
              showTime
              format="DD/MM/YYYY HH:mm"
              placeholder={['Thời gian bắt đầu', 'Thời gian kết thúc']}
              style={{ width: '100%' }}
            />
          </Form.Item>

          <Form.List name="products">
            {(fields, { add, remove }) => (
              <>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                  <label style={{ fontWeight: 600 }}>Sản phẩm tham gia</label>
                  <Button type="dashed" onClick={() => add()} icon={<PlusOutlined />}>
                    Thêm sản phẩm
                  </Button>
                </div>
                {fields.map(({ key, name, ...restField }) => (
                  <div key={key} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'flex-start', padding: '12px', border: '1px solid #d9d9d9', borderRadius: '6px', backgroundColor: '#fafafa' }}>
                    <Form.Item
                      {...restField}
                      name={[name, 'product_id']}
                      rules={[{ required: true, message: 'Chọn sản phẩm' }]}
                      style={{ flex: 2 }}
                    >
                      <Select 
                        placeholder="Chọn sản phẩm" 
                        showSearch
                        filterOption={(input, option) =>
                          (option?.children as string)?.toLowerCase().includes(input.toLowerCase())
                        }
                        onChange={(value) => {
                          const selectedProduct = products.find(p => p.id === value);
                          if (selectedProduct) {
                            const currentProducts = form.getFieldValue('products') || [];
                            currentProducts[name] = {
                              ...currentProducts[name],
                              product_id: value,
                              original_price: selectedProduct.price || 0
                            };
                            form.setFieldValue('products', currentProducts);
                          }
                        }}
                      >
                        {products.map(product => (
                          <Select.Option key={product.id} value={product.id}>
                            {product.name} - {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(product.price || 0)}
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'discount_percentage']}
                      rules={[{ required: true, message: 'Chọn % giảm giá' }]}
                      style={{ flex: 1 }}
                    >
                      <Select
                        placeholder="% Giảm giá"
                        onChange={(value) => {
                          const selectedProduct = products.find(p => p.id === form.getFieldValue(['products', name, 'product_id']));
                          if (selectedProduct) {
                            const originalPrice = selectedProduct.price || 0;
                            const salePrice = originalPrice * (100 - value) / 100;
                            const currentProducts = form.getFieldValue('products') || [];
                            currentProducts[name] = {
                              ...currentProducts[name],
                              discount_percentage: value,
                              sale_price: Math.round(salePrice)
                            };
                            form.setFieldValue('products', currentProducts);
                          }
                        }}
                      >
                        {[10, 15, 20, 25, 30, 35, 40, 45, 50, 60, 70].map(percent => (
                          <Select.Option key={percent} value={percent}>
                            {percent}%
                          </Select.Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'sale_price']}
                      rules={[{ required: true, message: 'Giá được tính tự động' }]}
                      style={{ flex: 1 }}
                    >
                      <InputNumber
                        placeholder="Giá sau giảm"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                        style={{ width: '100%' }}
                        readOnly
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'quantity_limit']}
                      rules={[{ required: true, message: 'Nhập số lượng' }]}
                      style={{ flex: 1 }}
                    >
                      <InputNumber
                        placeholder="Số lượng"
                        min={1}
                        style={{ width: '100%' }}
                      />
                    </Form.Item>
                    <Button
                      type="text"
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => remove(name)}
                    />
                  </div>
                ))}
              </>
            )}
          </Form.List>

          <Form.Item style={{ marginTop: 24, textAlign: 'right' }}>
            <Space>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
              <Button type="primary" htmlType="submit">
                {editingFlashSale ? 'Cập nhật' : 'Tạo mới'}
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default FlashSaleManagement;