import React, { useState, useEffect } from 'react';
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  InputNumber,
  message,
  Popconfirm,
  Tag,
  Space,
  Typography,
  Card
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  GiftOutlined
} from '@ant-design/icons';
import { axiosInstance } from '../utils/axios.util';
import dayjs from 'dayjs';

const { Title } = Typography;
const { RangePicker } = DatePicker;

interface Voucher {
  id: number;
  code: string;
  name: string;
  description: string;
  type: 'fixed' | 'percent';
  value: number;
  min_order_amount: number;
  max_discount_amount: number;
  quantity: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const VoucherList = () => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingVoucher, setEditingVoucher] = useState<Voucher | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      // Thử cả 2 endpoint
      let response;
      try {
        response = await axiosInstance.get(`/admin/vouchers?t=${Date.now()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch {
        response = await axiosInstance.get(`/vouchers?t=${Date.now()}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
      }
      console.log('Vouchers API response:', response.data);
      const vouchersData = response.data.data || response.data || [];
      console.log('Vouchers data:', vouchersData);
      setVouchers(vouchersData);
    } catch (error) {
      console.error('Voucher API error:', error);
      // Hiện thị empty state thay vì lỗi
      setVouchers([]);
      message.warning('Chức năng voucher chưa sẵn sàng');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      console.log('Raw form values:', values);
      
      const data = {
        ...values,
        start_date: values.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        end_date: values.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
        value: typeof values.value === 'string' ? parseFloat(values.value) : Number(values.value), // Đảm bảo convert thành số
        min_order_amount: Number(values.min_order_amount),
        quantity: Number(values.quantity),
        max_discount_amount: values.max_discount_amount ? Number(values.max_discount_amount) : null
      };
      delete data.dateRange;

      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      };
      
      console.log('Submitting voucher data:', data);
      console.log('Form values before submit:', values);
      console.log('Data after processing:', {
        ...data,
        value: Number(data.value),
        min_order_amount: Number(data.min_order_amount),
        quantity: Number(data.quantity)
      });
      
      if (editingVoucher) {
        console.log('Updating voucher ID:', editingVoucher.id);
        console.log('API URL:', `/admin/vouchers/${editingVoucher.id}`);
        console.log('Request data:', JSON.stringify(data, null, 2));
        console.log('Request config:', config);
        
        const response = await axiosInstance.put(`/admin/vouchers/${editingVoucher.id}`, data, config);
        console.log('Update response status:', response.status);
        console.log('Update response data:', response.data);
        
        // Fetch lại dữ liệu từ server để đảm bảo chính xác
        await fetchVouchers();
        
        message.success('Cập nhật voucher thành công');
      } else {
        const response = await axiosInstance.post('/admin/vouchers', data, config);
        console.log('Create response:', response.data);
        
        // Fetch lại dữ liệu từ server
        await fetchVouchers();
        
        message.success('Tạo voucher thành công');
      }

      setModalVisible(false);
      setEditingVoucher(null);
      form.resetFields();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error('API Error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra: ' + error.message);
    }
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    
    // Đảm bảo hiển thị đúng giá trị hiện tại
    const formData = {
      code: voucher.code,
      name: voucher.name,
      description: voucher.description,
      type: voucher.type,
      value: typeof voucher.value === 'string' ? parseFloat(voucher.value) : Number(voucher.value), // Đảm bảo là số
      min_order_amount: Number(voucher.min_order_amount),
      max_discount_amount: voucher.max_discount_amount ? Number(voucher.max_discount_amount) : undefined,
      quantity: Number(voucher.quantity),
      is_active: voucher.is_active,
      dateRange: [dayjs(voucher.start_date), dayjs(voucher.end_date)]
    };
    
    console.log('Setting form values for edit:', formData);
    form.setFieldsValue(formData);
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/admin/vouchers/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      message.success('Xóa voucher thành công');
      await fetchVouchers();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      message.error('Lỗi khi xóa voucher');
    }
  };

  const columns = [
    {
      title: 'Mã voucher',
      dataIndex: 'code',
      key: 'code',
      render: (code: string) => <Tag color="blue">{code}</Tag>
    },
    {
      title: 'Tên voucher',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Loại',
      dataIndex: 'type',
      key: 'type',
      render: (type: string) => (
        <Tag color={type === 'fixed' ? 'green' : 'orange'}>
          {type === 'fixed' ? 'Giảm cố định' : 'Giảm %'}
        </Tag>
      )
    },
    {
      title: 'Giá trị',
      dataIndex: 'value',
      key: 'value',
      render: (value: number | string, record: Voucher) => {
        console.log('Rendering voucher value:', { code: record.code, type: record.type, value, valueType: typeof value });
        const numValue = typeof value === 'string' ? parseFloat(value) : value;
        if (record.type === 'fixed') {
          return `${Math.round(numValue).toLocaleString('vi-VN')}đ`;
        } else {
          return `${Math.round(numValue)}%`;
        }
      }
    },
    {
      title: 'Đơn tối thiểu',
      dataIndex: 'min_order_amount',
      key: 'min_order_amount',
      render: (amount: number) => `${Math.round(amount).toLocaleString('vi-VN')}đ`
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      render: (record: Voucher) => `${record.used_count}/${record.quantity}`
    },
    {
      title: 'Thời gian',
      key: 'date',
      render: (record: Voucher) => (
        <div>
          <div>{dayjs(record.start_date).format('DD/MM/YYYY')}</div>
          <div>{dayjs(record.end_date).format('DD/MM/YYYY')}</div>
        </div>
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (isActive: boolean) => (
        <Tag color={isActive ? 'green' : 'red'}>
          {isActive ? 'Hoạt động' : 'Tạm dừng'}
        </Tag>
      )
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (record: Voucher) => (
        <Space>
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Popconfirm
            title="Xác nhận xóa voucher?"
            onConfirm={() => handleDelete(record.id)}
          >
            <Button type="text" icon={<DeleteOutlined />} danger />
          </Popconfirm>
        </Space>
      )
    }
  ];

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <Title level={2}>
            <GiftOutlined /> Quản lý Voucher
          </Title>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setEditingVoucher(null);
              form.resetFields();
              setModalVisible(true);
            }}
          >
            Thêm voucher
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={vouchers}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng ${total} voucher`
          }}
        />
      </Card>

      <Modal
        title={editingVoucher ? 'Sửa voucher' : 'Thêm voucher'}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          setEditingVoucher(null);
          form.resetFields();
        }}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            type: 'fixed',
            is_active: true,
            quantity: 1,
            min_order_amount: 0
          }}
        >
          <Form.Item
            name="code"
            label="Mã voucher"
            rules={[{ required: true, message: 'Vui lòng nhập mã voucher' }]}
          >
            <Input placeholder="VD: SAVE10, WELCOME" />
          </Form.Item>

          <Form.Item
            name="name"
            label="Tên voucher"
            rules={[{ required: true, message: 'Vui lòng nhập tên voucher' }]}
          >
            <Input placeholder="VD: Giảm giá 10%" />
          </Form.Item>

          <Form.Item name="description" label="Mô tả">
            <Input.TextArea rows={2} placeholder="Mô tả voucher" />
          </Form.Item>

          <Form.Item
            name="type"
            label="Loại giảm giá"
            rules={[{ required: true }]}
          >
            <Select onChange={(value) => {
              // Chỉ reset giá trị khi tạo mới, không reset khi edit
              if (!editingVoucher) {
                if (value === 'percent') {
                  form.setFieldsValue({ value: 10 }); // Mặc định 10%
                } else {
                  form.setFieldsValue({ value: 50000 }); // Mặc định 50.000đ
                }
              }
            }}>
              <Select.Option value="fixed">Giảm cố định</Select.Option>
              <Select.Option value="percent">Giảm phần trăm</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="value"
            label="Giá trị giảm"
            rules={[{ required: !editingVoucher, message: 'Vui lòng nhập giá trị' }]}
          >
            <Form.Item noStyle shouldUpdate={(prev, curr) => prev.type !== curr.type}>
              {({ getFieldValue }) => {
                const type = getFieldValue('type');
                return (
                  <InputNumber
                    min={0}
                    max={type === 'percent' ? 100 : undefined}
                    style={{ width: '100%' }}
                    formatter={(value) => {
                      if (!value) return '';
                      return type === 'percent' ? `${value}%` : `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
                    }}
                    parser={(value) => {
                      if (!value) return 0;
                      // Chỉ xóa ký tự không phải số và dấu chấm
                      const parsed = value.replace(/[^\d.]/g, '');
                      return parsed ? Number(parsed) : 0;
                    }}
                    placeholder={type === 'percent' ? 'VD: 10, 20, 50' : 'VD: 50000, 100000'}
                    step={type === 'percent' ? 1 : 1000}
                  />
                );
              }}
            </Form.Item>
          </Form.Item>

          <Form.Item
            name="min_order_amount"
            label="Giá trị đơn hàng tối thiểu"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\D/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="max_discount_amount"
            label="Giá trị giảm tối đa (chỉ cho giảm %)"
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value) => value!.replace(/\D/g, '')}
            />
          </Form.Item>

          <Form.Item
            name="quantity"
            label="Số lượng"
            rules={[{ required: true }]}
          >
            <InputNumber min={1} style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="dateRange"
            label="Thời gian hiệu lực"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
          >
            <RangePicker
              showTime
              style={{ width: '100%' }}
              format="DD/MM/YYYY HH:mm"
            />
          </Form.Item>

          <Form.Item name="is_active" label="Trạng thái">
            <Select>
              <Select.Option value={true}>Hoạt động</Select.Option>
              <Select.Option value={false}>Tạm dừng</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                {editingVoucher ? 'Cập nhật' : 'Tạo voucher'}
              </Button>
              <Button onClick={() => setModalVisible(false)}>
                Hủy
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default VoucherList;