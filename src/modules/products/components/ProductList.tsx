import { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Input, Modal, message, Card, Switch } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, UndoOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct, restoreProduct, toggleActiveProduct, getTrashedProducts, searchProducts } from "../services/product.service";
import type { Product } from "../types/product.type";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showTrashed, setShowTrashed] = useState(false);
  const [searchKeyword, setSearchKeyword] = useState("");
  const navigate = useNavigate();

  const fetchProducts = async (trashed = false) => {
    setLoading(true);
    try {
      const response = trashed ? await getTrashedProducts() : await getAllProducts();
      console.log("Products response:", response); // Debugging
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      message.error("Không thể tải danh sách sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts(showTrashed);
  }, [showTrashed]);

  const handleSearch = async () => {
    if (!searchKeyword.trim()) {
      fetchProducts(showTrashed);
      return;
    }
    
    setLoading(true);
    try {
      const response = await searchProducts(searchKeyword);
      setProducts(response.data || []);
    } catch (error) {
      console.error("Error searching products:", error);
      message.error("Lỗi khi tìm kiếm sản phẩm");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa sản phẩm",
      content: "Bạn có chắc chắn muốn xóa sản phẩm này?",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteProduct(id);
          message.success("Xóa sản phẩm thành công");
          fetchProducts(showTrashed);
        } catch (error) {
          console.error("Error deleting product:", error);
          message.error("Lỗi khi xóa sản phẩm");
        }
      }
    });
  };

  const handleRestore = async (id: number) => {
    try {
      await restoreProduct(id);
      message.success("Khôi phục sản phẩm thành công");
      fetchProducts(showTrashed);
    } catch (error) {
      console.error("Error restoring product:", error);
      message.error("Lỗi khi khôi phục sản phẩm");
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await toggleActiveProduct(id);
      message.success(`Đã ${currentStatus ? 'tắt' : 'bật'} sản phẩm`);
      fetchProducts(showTrashed);
    } catch (error) {
      console.error("Error toggling product status:", error);
      message.error("Lỗi khi thay đổi trạng thái sản phẩm");
    }
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail: string) => (
        thumbnail ? 
        <img 
          src={thumbnail.startsWith('http') ? thumbnail : `http://127.0.0.1:8000/storage/${thumbnail}`} 
          alt="Thumbnail" 
          style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }} 
        /> : 
        <div style={{ width: 50, height: 50, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          No image
        </div>
      )
    },
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Thương hiệu",
      dataIndex: "brand",
      key: "brand",
      render: (brand: any) => brand?.name || '-',
    },
    {
      title: "Danh mục",
      dataIndex: "category",
      key: "category",
      render: (category: any) => category?.name || '-',
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive: boolean, record: Product) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleActive(record.id!, isActive)}
          disabled={showTrashed}
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Product) => (
        <Space>
          {showTrashed ? (
            <Button 
              icon={<UndoOutlined />} 
              onClick={() => handleRestore(record.id!)}
              type="primary"
            >
              Khôi phục
            </Button>
          ) : (
            <>
              <Button 
                icon={<EditOutlined />} 
                onClick={() => navigate(`/admin/products/edit/${record.id}`)}
              >
                Sửa
              </Button>
              <Button 
                icon={<DeleteOutlined />} 
                danger 
                onClick={() => handleDelete(record.id!)}
              >
                Xóa
              </Button>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<span style={{ color: "#1890ff", fontWeight: 700, fontSize: 22 }}>Quản lý Sản phẩm</span>}
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
        <Space>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => navigate("/admin/products/create")}
            style={{ background: "linear-gradient(90deg,#1890ff 0%,#52c41a 100%)", border: "none" }}
          >
            Thêm sản phẩm
          </Button>
          <Button
            type={showTrashed ? "primary" : "default"}
            onClick={() => setShowTrashed(!showTrashed)}
          >
            {showTrashed ? "Sản phẩm đang bán" : "Sản phẩm đã xóa"}
          </Button>
        </Space>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          allowClear
          enterButton={<Button icon={<SearchOutlined />}>Tìm kiếm</Button>}
          size="large"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
          onSearch={handleSearch}
          style={{ width: 400 }}
        />
      </Space>
      
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ borderRadius: 12, overflow: "hidden" }}
      />
    </Card>
  );
}