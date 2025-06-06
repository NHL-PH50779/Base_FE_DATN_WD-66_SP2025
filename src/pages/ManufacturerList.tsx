import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space } from "antd";
import type { Manufacturer } from "../types/manufacturer.type";
import { manufacturerApi } from "../api/manufacturer.api";

export default function ManufacturerList() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Manufacturer | null>(null);
  const [form] = Form.useForm();

  const fetchData = async () => {
    const data = await manufacturerApi.getAll();
    setManufacturers(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onFinish = async (values: Manufacturer) => {
    if (editing) {
      await manufacturerApi.update(editing.id, values);
    } else {
      await manufacturerApi.create({ ...values, id: Date.now() });
    }
    setIsModalOpen(false);
    form.resetFields();
    setEditing(null);
    fetchData();
  };

  const handleEdit = (record: Manufacturer) => {
    form.setFieldsValue(record);
    setEditing(record);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    await manufacturerApi.delete(id);
    fetchData();
  };

  return (
    <div>
      <h1>Quản lý Hãng sản xuất</h1>
      <Button type="primary" onClick={() => setIsModalOpen(true)} style={{ marginBottom: 16 }}>
        Thêm hãng
      </Button>
      <Table dataSource={manufacturers} rowKey="id" pagination={false}>
        <Table.Column title="Tên hãng" dataIndex="name" />
        <Table.Column title="Quốc gia" dataIndex="country" />
        <Table.Column
          title="Hành động"
          render={(_, record: Manufacturer) => (
            <Space>
              <Button onClick={() => handleEdit(record)}>Sửa</Button>
              <Button danger onClick={() => handleDelete(record.id)}>Xóa</Button>
            </Space>
          )}
        />
      </Table>

      <Modal
        title={editing ? "Sửa hãng sản xuất" : "Thêm hãng sản xuất"}
        open={isModalOpen}
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="name" label="Tên hãng" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
          <Form.Item name="country" label="Quốc gia" rules={[{ required: true }]}>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
