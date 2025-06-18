import { useEffect, useState } from "react";
import { Table, Button, Space, Input, Modal, Form, message, Card, Image } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined } from "@ant-design/icons";
import { getAllBrands, createBrand, updateBrand, deleteBrand } from "../services/brand.service";
import type { Brand } from "../types/brand.type";

export default function BrandList() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
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

  const handleAddBrand = () => {
    setEditingBrand(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditBrand = (brand: Brand) => {
    setEditingBrand(brand);
    form.setFieldsValue({
      name: brand.name,
      logo: brand.logo,
    });
    setModalVisible(true);
  };

  const handleDeleteBrand = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa thương hiệu",
      content: "Bạn có chắc chắn muốn xóa thương hiệu này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteBrand(id);
          message.success("Xóa thương hiệu thành công");
          fetchBrands();
        } catch (error) {
          console.error("Error deleting brand:", error);
          message.error("Lỗi khi xóa thương hiệu");
        }
      }
    });
  };

  const handleSaveBrand = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingBrand) {
        await updateBrand(editingBrand.id!, values);
        message.success("Cập nhật thương hiệu thành công");
      } else {
        await createBrand(values);
        message.success("Thêm thương hiệu thành công");
      }
      
      setModalVisible(false);
      fetchBrands();
    } catch (error) {
      console.error("Error saving brand:", error);
      message.error("Lỗi khi lưu thương hiệu");
    }
  };

  const columns = [
    {
      title: "Logo",
      dataIndex: "logo",
      key: "logo",
      render: (logo: string) => (
        logo ? 
        <Image 
          src={logo.startsWith('http') ? logo : `http://127.0.0.1:8000/storage/${logo}`} 
          alt="Brand" 
          style={{ width: 80, height: 40, objectFit: 'contain' }} 
          preview={{ mask: <div>Xem</div> }}
        /> : 
        <div style={{ width: 80, height: 40, background: '#f0f0f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          No logo
        </div>
      )
    },
    {
      title: "Tên thương hiệu",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Brand) => (
        <Space>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEditBrand(record)}
          >
            Sửa
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            danger 
            onClick={() => handleDeleteBrand(record.id!)}
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
          onClick={handleAddBrand}
          style={{ background: "linear-gradient(90deg,#1890ff 0%,#52c41a 100%)", border: "none" }}
        >
          Thêm thương hiệu
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={brands}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ borderRadius: 12, overflow: "hidden" }}
      />
      
      <Modal
        title={editingBrand ? "Chỉnh sửa thương hiệu" : "Thêm thương hiệu mới"}
        open={modalVisible}
        onOk={handleSaveBrand}
        onCancel={() => setModalVisible(false)}
        okText={editingBrand ? "Cập nhật" : "Thêm mới"}
        cancelText="Hủy"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên thương hiệu"
            rules={[{ required: true, message: "Vui lòng nhập tên thương hiệu" }]}
          >
            <Input placeholder="Nhập tên thương hiệu" />
          </Form.Item>
          
          <Form.Item
            name="logo"
            label="URL logo"
          >
            <Input placeholder="Nhập URL logo" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}