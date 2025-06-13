import { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Space, Card, message } from "antd";
import { getLaptopVariants, createLaptopVariant, deleteLaptopVariant } from "../services/laptopVariant.service";
import type { LaptopVariant } from "../types/laptopVariant.type";

export default function VariantList() {
  const [variants, setVariants] = useState<LaptopVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [form] = Form.useForm();
  const [editItem, setEditItem] = useState<LaptopVariant | null>(null);
  const [productId] = useState<number>(1); // Nếu muốn chọn laptop khác, có thể bổ sung select sau

  const loadData = async () => {
    setLoading(true);
    try {
      const res = await getLaptopVariants(productId);
      setVariants(res.data.data || []);
    } catch {
      message.error("Lỗi tải biến thể");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId]);

  const handleDelete = async (id: number) => {
    await deleteLaptopVariant(id);
    message.success("Đã xoá");
    loadData();
  };

  const handleEdit = (item: LaptopVariant) => {
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
    await createLaptopVariant(productId, values);
    setModalOpen(false);
    message.success(editItem ? "Cập nhật thành công" : "Thêm mới thành công");
    loadData();
  };

  return (
    <Card
      title={<span style={{ color: "#1890ff", fontWeight: 700, fontSize: 22 }}>Quản lý Biến thể</span>}
      extra={
        <Button
          onClick={handleAdd}
          type="primary"
          style={{ background: "linear-gradient(90deg,#1890ff 0%,#52c41a 100%)", border: "none" }}
        >
          Thêm biến thể
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
      {/* Có thể thêm Select để chọn laptop cần xem biến thể */}
      <Table
        dataSource={variants}
        rowKey="id"
        loading={loading}
        columns={[
          { title: "SKU", dataIndex: "sku" },
          { title: "Giá", dataIndex: "price", render: (v: number) => v.toLocaleString() + "₫" },
          { title: "Tồn kho", dataIndex: "stock" },
          { title: "Thuộc tính", dataIndex: "attributeValues", render: (arr: LaptopVariant["attributeValues"]) => arr?.map(a => a.attribute.name + ": " + a.value).join(", ") },
          {
            title: "Hành động",
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
        pagination={{ pageSize: 10 }}
        style={{ borderRadius: 12, overflow: "hidden" }}
      />
      <Modal
        open={modalOpen}
        title={
          <span style={{ color: "#1890ff", fontWeight: 600 }}>
            {editItem ? "Cập nhật Biến thể" : "Thêm mới Biến thể"}
          </span>
        }
        onCancel={() => setModalOpen(false)}
        onOk={handleSubmit}
        okButtonProps={{ style: { background: "#52c41a", border: "none" } }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
        bodyStyle={{ background: "#f0f5ff", borderRadius: 12 }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="sku" label={<span style={{ color: "#1890ff" }}>SKU</span>} rules={[{ required: true }]}> <Input style={{ borderRadius: 8 }} /> </Form.Item>
          <Form.Item name="price" label={<span style={{ color: "#1890ff" }}>Giá</span>} rules={[{ required: true }]}> <Input type="number" style={{ borderRadius: 8 }} /> </Form.Item>
          <Form.Item name="stock" label={<span style={{ color: "#1890ff" }}>Tồn kho</span>} rules={[{ required: true }]}> <Input type="number" min={0} style={{ borderRadius: 8 }} /> </Form.Item>
          {/* Có thể bổ sung chọn thuộc tính động nếu có API thuộc tính */}
        </Form>
      </Modal>
    </Card>
  );
}
