import { useEffect, useState } from "react";
import { Table, Button, Space, Input, Modal, message, Card, Form } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { getAllCategories, createCategory } from "../services/category.service";
import type { Category } from "../types/category.type";

export default function CategoryList() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const [form] = Form.useForm();

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getAllCategories();
      setCategories(response.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
      message.error("Không thể tải danh sách danh mục");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleAdd = () => {
    form.resetFields();
    setModalVisible(true);
  };

  const handleSubmit = async (values: { name: string }) => {
    try {
      await createCategory(values);
      message.success("Thêm danh mục thành công");
      setModalVisible(false);
      form.resetFields();
      fetchCategories();
    } catch (error) {
      console.error("Error creating category:", error);
      message.error("Lỗi khi thêm danh mục");
    }
  };

  // Tìm kiếm local
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchKeyword.toLowerCase())
  );

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Tên danh mục",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Ngày tạo",
      dataIndex: "created_at",
      key: "created_at",
      render: (date: string) => date ? new Date(date).toLocaleDateString('vi-VN') : '-',
    },
    // Tạm ẩn cột hành động vì backend chưa có API update/delete
    // {
    //   title: "Hành động",
    //   key: "action",
    //   render: (_: any, record: Category) => (
    //     <Space>
    //       <Button 
    //         icon={<EditOutlined />}
    //         size="small"
    //         disabled
    //         title="Chức năng sửa chưa khả dụng"
    //       >
    //         Sửa
    //       </Button>
    //       <Button 
    //         icon={<DeleteOutlined />}
    //         danger
    //         size="small"
    //         disabled
    //         title="Chức năng xóa chưa khả dụng"
    //       >
    //         Xóa
    //       </Button>
    //     </Space>
    //   ),
    // },
  ];

  return (
    <Card
      title={<span style={{ color: "#1890ff", fontWeight: 700, fontSize: 22 }}>Quản lý Danh mục</span>}
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
          Thêm danh mục
        </Button>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm danh mục..."
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
            Tìm thấy {filteredCategories.length} danh mục
          </span>
        )}
      </Space>
      
      <Table
        columns={columns}
        dataSource={filteredCategories}
        rowKey="id"
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} danh mục`
        }}
        style={{ borderRadius: 12, overflow: "hidden" }}
      />

      <Modal
        title="Thêm danh mục mới"
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
            label="Tên danh mục"
            rules={[{ required: true, message: 'Vui lòng nhập tên danh mục!' }]}
          >
            <Input placeholder="Nhập tên danh mục" />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}