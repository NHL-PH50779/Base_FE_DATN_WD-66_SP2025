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
  Card,
  Row,
  Col
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
  max_discount_amount?: number;
  quantity: number;
  used_count: number;
  start_date: string;
  end_date: string;
  is_active: boolean;
}

const VoucherManagement = () => {
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
      const response = await axiosInstance.get('/admin/vouchers', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setVouchers(response.data.data || []);
    } catch (error) {
      console.error('Error fetching vouchers:', error);
      message.error('Lỗi khi tải danh sách voucher');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      const token = localStorage.getItem('token');
      const data = {
        code: values.code,
        name: values.name,
        description: values.description || '',
        type: values.type,
        value: Number(values.value),
        min_order_amount: Number(values.min_order_amount || 0),
        max_discount_amount: values.max_discount_amount ? Number(values.max_discount_amount) : null,
        quantity: Number(values.quantity),
        start_date: values.dateRange[0].format('YYYY-MM-DD HH:mm:ss'),
        end_date: values.dateRange[1].format('YYYY-MM-DD HH:mm:ss'),
        is_active: values.is_active
      };

      if (editingVoucher) {
        await axiosInstance.put(`/admin/vouchers/${editingVoucher.id}`, data, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        message.success('Cập nhật voucher thành công');
      } else {
        await axiosInstance.post('/admin/vouchers', data, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        message.success('Tạo voucher thành công');
      }

      setModalVisible(false);
      setEditingVoucher(null);
      form.resetFields();
      fetchVouchers();
    } catch (error: any) {
      console.error('Error saving voucher:', error);
      message.error(error.response?.data?.message || 'Có lỗi xảy ra');
    }
  };

  const handleEdit = (voucher: Voucher) => {
    setEditingVoucher(voucher);
    form.setFieldsValue({
      code: voucher.code,
      name: voucher.name,
      description: voucher.description,
      type: voucher.type,
      value: voucher.value,
      min_order_amount: voucher.min_order_amount,
      max_discount_amount: voucher.max_discount_amount,
      quantity: voucher.quantity,
      is_active: voucher.is_active,
      dateRange: [dayjs(voucher.start_date), dayjs(voucher.end_date)]
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.delete(`/admin/vouchers/${id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      message.success('Xóa voucher thành công');
      fetchVouchers();
    } catch (error) {
      message.error('Lỗi khi xóa voucher');
    }
  };

  const openCreateModal = () => {
    setEditingVoucher(null);
    form.resetFields();
    setModalVisible(true);
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
      render: (value: number, record: Voucher) => {
        const numValue = Math.round(Number(value));
        if (record.type === 'fixed') {
          return `${numValue.toLocaleString('vi-VN')}đ`;
        } else {
          return `${numValue}%`;
        }
      }
    },
    {
      title: 'Đơn tối thiểu',
      dataIndex: 'min_order_amount',
      key: 'min_order_amount',
      render: (amount: number) => `${Math.round(Number(amount)).toLocaleString('vi-VN')}đ`
    },
    {
      title: 'Số lượng',
      key: 'quantity',
      render: (record: Voucher) => `${record.used_count}/${record.quantity}`
    },
    {
      title: 'Giảm tối đa',
      dataIndex: 'max_discount_amount',
      key: 'max_discount_amount',
      render: (amount: number) => amount ? `${Math.round(Number(amount)).toLocaleString('vi-VN')}đ` : 'Không giới hạn'
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
        <Row justify="space-between" align="middle" style={{ marginBottom: 16 }}>
          <Col>
            <Title level={2}>
              <GiftOutlined /> Quản lý Voucher
            </Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
            >
              Thêm voucher
            </Button>
          </Col>
        </Row>

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

          {/* 1. Loại voucher: Giảm cố định hoặc Giảm % */}
          <Form.Item
            name="type"
            label="Loại voucher"
            rules={[{ required: true, message: 'Vui lòng chọn loại voucher' }]}
          >
            <Select placeholder="Chọn loại voucher">
              <Select.Option value="fixed">💰 Giảm cố định (VND)</Select.Option>
              <Select.Option value="percent">📊 Giảm phần trăm (%)</Select.Option>
            </Select>
          </Form.Item>

          {/* 2. Giá trị giảm */}
          <Form.Item noStyle shouldUpdate={(prev, curr) => prev.type !== curr.type}>
            {({ getFieldValue }) => {
              const type = getFieldValue('type');
              return (
                <Form.Item
                  name="value"
                  label="Giá trị giảm"
                  rules={[{ required: true, message: 'Vui lòng nhập giá trị giảm' }]}
                >
                  <InputNumber
                    min={1}
                    max={type === 'percent' ? 100 : undefined}
                    style={{ width: '100%' }}
                    placeholder={type === 'percent' ? 'Nhập % giảm (1-100)' : 'Nhập số tiền giảm'}
                    addonAfter={type === 'percent' ? '%' : 'VND'}
                  />
                </Form.Item>
              );
            }}
          </Form.Item>

          {/* 3. Giá trị đơn hàng tối thiểu */}
          <Form.Item
            name="min_order_amount"
            label="Giá trị đơn hàng tối thiểu"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị đơn hàng tối thiểu' }]}
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="Đơn hàng tối thiểu để áp dụng voucher"
              addonAfter="VND"
            />
          </Form.Item>

          {/* 4. Giá trị giảm tối đa (cho voucher %) */}
          <Form.Item
            name="max_discount_amount"
            label="Giá trị giảm tối đa"
            tooltip="Chỉ áp dụng cho voucher giảm %. Để trống nếu không giới hạn."
          >
            <InputNumber
              min={0}
              style={{ width: '100%' }}
              placeholder="Số tiền giảm tối đa (tùy chọn)"
              addonAfter="VND"
            />
          </Form.Item>

          {/* 5. Số lượng voucher */}
          <Form.Item
            name="quantity"
            label="Số lượng voucher"
            rules={[{ required: true, message: 'Vui lòng nhập số lượng voucher' }]}
          >
            <InputNumber 
              min={1} 
              style={{ width: '100%' }} 
              placeholder="Số lượng voucher có thể sử dụng"
            />
          </Form.Item>

          {/* 6. Ngày bắt đầu và kết thúc */}
          <Form.Item
            name="dateRange"
            label="Thời gian hiệu lực"
            rules={[{ required: true, message: 'Vui lòng chọn thời gian hiệu lực' }]}
          >
            <RangePicker
              showTime
              style={{ width: '100%' }}
              format="DD/MM/YYYY HH:mm"
              placeholder={['Ngày bắt đầu', 'Ngày kết thúc']}
            />
          </Form.Item>

          {/* 7. Trạng thái voucher */}
          <Form.Item name="is_active" label="Trạng thái voucher">
            <Select>
              <Select.Option value={true}>✅ Hoạt động</Select.Option>
              <Select.Option value={false}>⏸️ Tạm dừng</Select.Option>
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

export default VoucherManagement;