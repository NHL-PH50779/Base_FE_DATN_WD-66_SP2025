import { useEffect, useState } from "react";
import { Table, Button, Space, Input, Modal, message, Card, Form } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllBrands, createBrand } from "../services/brand.service";
import type { Brand } from "../types/brand.type";

export default function BrandList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [form] = Form.useForm();

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const response = await getAllBrands();
      setBrands(response.data || []);
    } catch (error) {
      console.error("Error fetching brands:", error);
      message.error("Không thể tải danh sách thương hiệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrands();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values: { name: string }) => {
    try {
      await createBrand(values);
      message.success("Thêm thương hiệu thành công");
      setModalVisible(false);
      form.resetFields();
      fetchBrands();
    } catch (error) {
      console.error("Error creating brand:", error);
      message.error("Lỗi khi thêm thương hiệu");
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa thương hiệu",
      content: "Bạn có chắc chắn muốn xóa thương hiệu này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          const response = await fetch(`http://localhost:8000/api/admin/brands/${id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });
          
          if (response.ok) {
            message.success('Xóa thương hiệu thành công');
            await fetchBrands();
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Lỗi khi xóa thương hiệu');
          }
        } catch (error: any) {
          console.error('Delete brand error:', error);
          message.error(error.message || 'Lỗi khi xóa thương hiệu');
        }
      }
    });
  };

  // Tìm kiếm local
  const filteredBrands = brands.filter(brand =>
    brand.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tên thương hiệu",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Brand) => (
        <Space>
          <Button 
            icon={<DeleteOutlined />}
            danger
            size="small"
            onClick={() => handleDelete(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<span style={{ color: "#1890ff", fontWeight: 700, fontSize: 22 }}>Quản lý Thương hiệu</span>}
      style={{
        background: "linear-gradient(135deg, #f0f5ff 0%, #e6fffb 100%)",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(24,144,255,0.08)",
        marginBottom: 24,
      }}
      styles={{
        header: {
          borderRadius: "16px 16px 0 0",
          background: "#fff",
        }
      }}
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ background: "linear-gradient(90deg,#1890ff 0%,#52c41a 100%)", border: "none" }}
        >
          Thêm thương hiệu
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm thương hiệu..."
          allowClear
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          style={{ width: 300 }}
          enterButton={
            <Button type="primary" icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
          }
        />
        {searchKeyword && (
          <span style={{ color: '#666', fontSize: '14px' }}>
            Tìm thấy {filteredBrands.length} thương hiệu
          </span>
        )}
      </Space>
      
      <Table
        columns={columns}
        dataSource={filteredBrands}
        rowKey="id"
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} thương hiệu`
        }}
        style={{ borderRadius: 12, overflow: "hidden" }}
      />

      <Modal
        title="Thêm thương hiệu mới"
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Tên thương hiệu"
            rules={[{ required: true, message: 'Vui lòng nhập tên thương hiệu!' }]}
          >
            <Input placeholder="Nhập tên thương hiệu" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}