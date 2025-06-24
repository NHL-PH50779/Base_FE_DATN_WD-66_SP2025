// src/pages/admin/laptop/LaptopListPage.tsx
import {
  Button,
  Card,
  Popconfirm,
  Space,
  Switch,
  Table,
  Tag,
  message,
} from "antd";
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import type { Laptop } from "../types/laptop.type";
import { deleteLaptop, getAllLaptops, toggleActiveLaptop } from "../services/laptop.service";

const LaptopListPage = () => {
  const [data, setData] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchLaptops = async () => {
    setLoading(true);
    try {
      const res = await getAllLaptops();
      setData(res.data.data);
    } catch {
      message.error("Lỗi khi tải danh sách laptop");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteLaptop(id);
      message.success("Đã xóa sản phẩm");
      fetchLaptops();
    } catch {
      message.error("Xóa thất bại");
    }
  };

  const handleToggle = async (id: number) => {
    try {
      await toggleActiveLaptop(id);
      fetchLaptops();
    } catch {
      message.error("Lỗi khi đổi trạng thái");
    }
  };

  useEffect(() => {
    fetchLaptops();
  }, []);

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand_id",
      key: "brand_id",
    },
    {
      title: "Danh mục",
      dataIndex: "category_id",
      key: "category_id",
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      render: (val: boolean, record: Laptop) => (
        <Switch
          checked={val}
          onChange={() => handleToggle(record.id!)}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: Laptop) => (
        <Space>
          <Button onClick={() => navigate(`/admin/laptops/${record.id}`)}>
            Chi tiết
          </Button>
          <Button onClick={() => navigate(`/admin/laptops/edit/${record.id}`)}>
            Sửa
          </Button>
          <Popconfirm
            title="Bạn chắc chắn muốn xóa?"
            onConfirm={() => handleDelete(record.id!)}
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<span style={{ color: "#1890ff", fontWeight: 700, fontSize: 22 }}>Quản lý Laptop</span>}
      extra={
        <Button type="primary" onClick={() => navigate("/admin/laptops/create")}
          style={{ background: "linear-gradient(90deg,#1890ff 0%,#52c41a 100%)", border: "none" }}>
          Thêm laptop
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
        columns={columns}
        rowKey="id"
        dataSource={data}
        loading={loading}
        style={{ borderRadius: 12, overflow: "hidden" }}
      />
    </Card>
  );
};

export default LaptopListPage;
