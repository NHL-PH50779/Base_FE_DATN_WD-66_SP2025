import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Card } from "antd";
import type { Manufacturer } from "../types/manufacturer.type";
import { manufacturerApi } from "../api/manufacturer.api";

export default function ManufacturerList() {
  const [manufacturers, setManufacturers] = useState<Manufacturer[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editing, setEditing] = useState<Manufacturer | null>(null);
  const [form] = Form.useForm();
  const [search, setSearch] = useState("");
  const [filtered, setFiltered] = useState<Manufacturer[]>([]);

  const fetchData = async () => {
    const data = await manufacturerApi.getAll();
    setManufacturers(data);
    setFiltered(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (!search) setFiltered(manufacturers);
    else setFiltered(manufacturers.filter(m => m.name.toLowerCase().includes(search.toLowerCase())));
  }, [search, manufacturers]);

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

  const handleAdd = () => {
    form.resetFields();
    setEditing(null);
    setIsModalOpen(true);
  };

  return (
    <Card
      title={<span style={{ color: "#1890ff", fontWeight: 700, fontSize: 22 }}>Quản lý Hãng sản xuất</span>}
      extra={
        <Button
          onClick={handleAdd}
          type="primary"
          style={{ background: "linear-gradient(90deg,#1890ff 0%,#52c41a 100%)", border: "none" }}
        >
          Thêm hãng
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
          placeholder="Tìm hãng sản xuất"
          onSearch={setSearch}
          allowClear
          style={{ borderRadius: 8, borderColor: "#1890ff" }}
        />
      </Space>
      <Table
        dataSource={filtered}
        rowKey="id"
        columns={[
          { title: <span style={{ color: "#1890ff" }}>Tên hãng</span>, dataIndex: "name" },
          { title: <span style={{ color: "#1890ff" }}>Quốc gia</span>, dataIndex: "country" },
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
        pagination={false}
        style={{ borderRadius: 12, overflow: "hidden" }}
      />
      <Modal
        open={isModalOpen}
        title={
          <span style={{ color: "#1890ff", fontWeight: 600 }}>
            {editing ? "Sửa hãng sản xuất" : "Thêm hãng sản xuất"}
          </span>
        }
        onCancel={() => {
          setIsModalOpen(false);
          setEditing(null);
          form.resetFields();
        }}
        onOk={() => form.submit()}
        okButtonProps={{ style: { background: "#52c41a", border: "none" } }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
        bodyStyle={{ background: "#f0f5ff", borderRadius: 12 }}
      >
        <Form form={form} onFinish={onFinish} layout="vertical">
          <Form.Item name="name" label={<span style={{ color: "#1890ff" }}>Tên hãng</span>} rules={[{ required: true }]}>
            <Input style={{ borderRadius: 8 }} />
          </Form.Item>
          <Form.Item name="country" label={<span style={{ color: "#1890ff" }}>Quốc gia</span>} rules={[{ required: true }]}>
            <Input style={{ borderRadius: 8 }} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
}
