import { useEffect, useState } from "react";
import { Button, Input, Space, Table, Modal, Form, Card } from "antd";
import type { Category } from "../types/category.type";
import { categoryApi } from "../api/category.api";

const CategoryList = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [filtered, setFiltered] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [form] = Form.useForm();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const data = await categoryApi.getAll();
    setCategories(data);
    setFiltered(data);
  };

  const handleSearch = (value: string) => {
    setSearch(value);
    setFiltered(categories.filter((cat) => cat.name.toLowerCase().includes(value.toLowerCase())));
  };

  const handleEdit = (record: Category) => {
    setEditing(record);
    form.setFieldsValue(record);
    setOpen(true);
  };

  const handleDelete = async (id: number) => {
    await categoryApi.delete(id);
    fetchData();
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editing) {
      await categoryApi.update(editing.id, values);
    } else {
      await categoryApi.create({ id: Date.now(), ...values });
    }
    setOpen(false);
    setEditing(null);
    form.resetFields();
    fetchData();
  };

  return (
    <Card
      title={<span style={{ color: "#1890ff", fontWeight: 700, fontSize: 22 }}>Quản lý Danh mục</span>}
      extra={
        <Button
          type="primary"
          style={{ background: "linear-gradient(90deg,#1890ff 0%,#52c41a 100%)", border: "none" }}
          onClick={() => { form.resetFields(); setEditing(null); setOpen(true); }}
        >
          Thêm danh mục
        </Button>
      }
      style={{
        background: "linear-gradient(135deg, #f0f5ff 0%, #e6fffb 100%)",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(24,144,255,0.08)",
        marginBottom: 24,
      }}
      headStyle={{
        borderRadius: "16px 16px 0 0",
        background: "#fff",
      }}
    >
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm danh mục"
          onSearch={handleSearch}
          enterButton
          style={{ borderRadius: 8, borderColor: "#1890ff" }}
        />
      </Space>
      <Table
        dataSource={filtered}
        rowKey="id"
        columns={[
          { title: <span style={{ color: "#1890ff" }}>Tên danh mục</span>, dataIndex: "name" },
          { title: <span style={{ color: "#1890ff" }}>Mô tả</span>, dataIndex: "description" },
          {
            title: <span style={{ color: "#1890ff" }}>Hành động</span>,
            render: (_, record) => (
              <Space>
                <Button onClick={() => handleEdit(record)} type="primary" ghost>
                  Sửa
                </Button>
                <Button danger onClick={() => handleDelete(record.id)}>
                  Xoá
                </Button>
              </Space>
            ),
          },
        ]}
        pagination={{ pageSize: 5 }}
        style={{ borderRadius: 12, overflow: "hidden" }}
      />

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        onOk={handleSubmit}
        title={
          <span style={{ color: "#1890ff", fontWeight: 600 }}>
            {editing ? "Sửa danh mục" : "Thêm danh mục"}
          </span>
        }
        okButtonProps={{ style: { background: "#52c41a", border: "none" } }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
        bodyStyle={{ background: "#f0f5ff", borderRadius: 12 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label={<span style={{ color: "#1890ff" }}>Tên danh mục</span>} rules={[{ required: true }]}>
            <Input style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="description" label={<span style={{ color: "#1890ff" }}>Mô tả</span>}>
            <Input style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CategoryList;
