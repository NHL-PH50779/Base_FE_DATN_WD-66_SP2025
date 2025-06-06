import { useEffect, useState } from "react";
import { Button, Input, Space, Table, Modal, Form } from "antd";
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
    <div>
      <h2>Quản lý Danh mục</h2>
      <Space style={{ marginBottom: 16 }}>
        <Input.Search placeholder="Tìm danh mục" onSearch={handleSearch} enterButton />
        <Button type="primary" onClick={() => { form.resetFields(); setEditing(null); setOpen(true); }}>
          Thêm danh mục
        </Button>
      </Space>
      <Table
        dataSource={filtered}
        rowKey="id"
        columns={[
          { title: "Tên danh mục", dataIndex: "name" },
          { title: "Mô tả", dataIndex: "description" },
          {
            title: "Hành động",
            render: (_, record) => (
              <Space>
                <Button onClick={() => handleEdit(record)}>Sửa</Button>
                <Button danger onClick={() => handleDelete(record.id)}>Xoá</Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal open={open} onCancel={() => setOpen(false)} onOk={handleSubmit} title={editing ? "Sửa danh mục" : "Thêm danh mục"}>
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên danh mục" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="description" label="Mô tả">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CategoryList;
