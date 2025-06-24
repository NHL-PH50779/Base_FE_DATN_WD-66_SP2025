import { useEffect, useState } from "react";
import { Table, Button, Modal, Input, Space, Card, message } from "antd";
import { getLaptopVariants, createLaptopVariant, deleteLaptopVariant } from "../services/laptopVariant.service";
import type { LaptopVariant } from "../types/laptopVariant.type";

export default function VariantList() {
  const [variants, setVariants] = useState<LaptopVariant[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [editingVariant, setEditingVariant] = useState<LaptopVariant | null>(null);
  const [productId] = useState<number>(1);
  const [formValues, setFormValues] = useState({ sku: '', price: '', stock: '' });

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
  }, [productId]);

  const handleDelete = async (id: number) => {
    try {
      await deleteLaptopVariant(id);
      message.success("Đã xóa");
      loadData();
    } catch {
      message.error("Lỗi khi xóa");
    }
  };

  const handleEdit = (item: LaptopVariant) => {
    console.log("Editing variant:", item);
    setEditingVariant(item);
    setFormValues({
      sku: item.sku,
      price: item.price.toString(),
      stock: item.stock.toString()
    });
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditingVariant(null);
    setFormValues({ sku: '', price: '', stock: '' });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      // Simple validation
      if (!formValues.sku || !formValues.price || !formValues.stock) {
        message.error("Vui lòng điền đầy đủ thông tin");
        return;
      }
      
      const values = {
        sku: formValues.sku,
        price: parseFloat(formValues.price),
        stock: parseInt(formValues.stock)
      };
      
      console.log("Submitting values:", values);
      
      await createLaptopVariant(productId, values);
      setModalOpen(false);
      message.success(editingVariant ? "Cập nhật thành công" : "Thêm mới thành công");
      loadData();
    } catch (error) {
      console.error("Submit error:", error);
      message.error("Có lỗi xảy ra");
    }
  };

  const handleCancel = () => {
    setModalOpen(false);
    setEditingVariant(null);
    setFormValues({ sku: '', price: '', stock: '' });
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
      <Table
        dataSource={variants}
        rowKey="id"
        loading={loading}
        columns={[
          { title: "SKU", dataIndex: "sku" },
          { title: "Giá", dataIndex: "price", render: (v: number) => v.toLocaleString() + "₫" },
          { title: "Tồn kho", dataIndex: "stock" },
          { 
            title: "Thuộc tính", 
            dataIndex: "attributeValues", 
            render: (arr: LaptopVariant["attributeValues"]) => 
              arr?.map(a => a.attribute.name + ": " + a.value).join(", ") 
          },
          {
            title: "Hành động",
            render: (_, record) => (
              <Space>
                <Button onClick={() => handleEdit(record)} type="primary" ghost>
                  Sửa
                </Button>
                <Button danger onClick={() => handleDelete(record.id)}>
                  Xóa
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
            {editingVariant ? "Cập nhật Biến thể" : "Thêm mới Biến thể"}
          </span>
        }
        onCancel={handleCancel}
        onOk={handleSubmit}
        okButtonProps={{ style: { background: "#52c41a", border: "none" } }}
        cancelButtonProps={{ style: { borderRadius: 8 } }}
        bodyStyle={{ background: "#f0f5ff", borderRadius: 12 }}
        destroyOnClose={true}
      >
        <div>
          <div style={{ marginBottom: 16 }}>
            <Input 
              value={formValues.sku}
              onChange={(e) => setFormValues({...formValues, sku: e.target.value})}
              style={{ borderRadius: 8 }} 
              placeholder="SKU *" 
            />
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <Input 
              value={formValues.price}
              onChange={(e) => setFormValues({...formValues, price: e.target.value})}
              type="number" 
              style={{ borderRadius: 8 }} 
              placeholder="Giá *" 
            />
          </div>
          
          <div style={{ marginBottom: 16 }}>
            <Input 
              value={formValues.stock}
              onChange={(e) => setFormValues({...formValues, stock: e.target.value})}
              type="number" 
              min={0} 
              style={{ borderRadius: 8 }} 
              placeholder="Tồn kho *" 
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
}