import { useEffect, useState } from "react";

import {
  Button,
  Card,
  Form,
  Input,
  Modal,
  Select,
  Space,
  Table,
  message,
} from "antd";
import type { Laptop } from "../types/product";
import { laptopApi } from "../api/laptop.api";

export default function LaptopList() {
  const [laptops, setLaptops] = useState<Laptop[]>([]);
  const [filtered, setFiltered] = useState<Laptop[]>([]);
  const [filter, setFilter] = useState({ name: "", brand: "", category: "" });
  const [form] = Form.useForm();
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<Laptop | null>(null);

  const loadData = async () => {
    const data = await laptopApi.getAll();
    setLaptops(data);
    setFiltered(data);
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    const filteredData = laptops.filter((laptop) => {
      return (
        laptop.name.toLowerCase().includes(filter.name.toLowerCase()) &&
        laptop.brand.includes(filter.brand) &&
        laptop.category.includes(filter.category)
      );
    });
    setFiltered(filteredData);
  }, [filter, laptops]);

  const handleDelete = async (id: number) => {
    await laptopApi.delete(id);
    message.success("Đã xoá");
    loadData();
  };

  const handleEdit = (item: Laptop) => {
    setEditItem(item);
    form.setFieldsValue(item);
    setModalOpen(true);
  };

  const handleAdd = () => {
    form.resetFields();
    setEditItem(null);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    const values = await form.validateFields();
    if (editItem) {
      await laptopApi.update(editItem.id, values);
      message.success("Cập nhật thành công");
    } else {
      await laptopApi.create({ ...values, id: Date.now() });
      message.success("Thêm mới thành công");
    }
    setModalOpen(false);
    loadData();
  };

  return (
    <Card title="Quản lý Laptop" extra={<Button onClick={handleAdd}>Thêm mới</Button>}>
      <Space style={{ marginBottom: 16 }}>
        <Input
          placeholder="Tìm theo tên"
          onChange={(e) => setFilter({ ...filter, name: e.target.value })}
        />
        <Select
          placeholder="Chọn hãng"
          allowClear
          style={{ width: 150 }}
          onChange={(value) => setFilter({ ...filter, brand: value || "" })}
        >
          <Select.Option value="Dell">Dell</Select.Option>
          <Select.Option value="HP">HP</Select.Option>
          <Select.Option value="Apple">Apple</Select.Option>
        </Select>
        <Select
          placeholder="Chọn danh mục"
          allowClear
          style={{ width: 150 }}
          onChange={(value) => setFilter({ ...filter, category: value || "" })}
        >
          <Select.Option value="Ultrabook">Ultrabook</Select.Option>
          <Select.Option value="Gaming">Gaming</Select.Option>
        </Select>
      </Space>

      <Table
        dataSource={filtered}
        rowKey="id"
        columns={[
          { title: "Tên", dataIndex: "name" },
          { title: "Giá", dataIndex: "price" },
          { title: "Hãng", dataIndex: "brand" },
          { title: "Danh mục", dataIndex: "category" },
          {
            title: "Hành động",
            render: (_, record) => (
              <Space>
                <Button onClick={() => handleEdit(record)}>Sửa</Button>
                <Button danger onClick={() => handleDelete(record.id)}>
                  Xoá
                </Button>
              </Space>
            ),
          },
        ]}
      />

      <Modal
        open={modalOpen}
        title={editItem ? "Cập nhật Laptop" : "Thêm mới Laptop"}
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="name" label="Tên" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="price" label="Giá" rules={[{ required: true }]}>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="brand" label="Hãng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="category" label="Danh mục" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
