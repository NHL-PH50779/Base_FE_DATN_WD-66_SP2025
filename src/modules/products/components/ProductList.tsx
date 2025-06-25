import { useEffect, useState } from "react";
import { Table, Button, Space, Tag, Input, Modal, message, Card, Switch } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { getAllProducts, deleteProduct, toggleActiveProduct, searchProducts } from "../services/product.service";
import { getAllBrands } from "../services/brand.service";
import { getAllCategories } from "../services/category.service";
import type { Product } from "../types/product.type";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Lưu tất cả sản phẩm
  const [loading, setLoading] = useState(false);

  const [searchKeyword, setSearchKeyword] = useState("");
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();

  const fetchAllData = async () => {
    setLoading(true);
    try {
      // Call products API first
      const productsResponse = await getAllProducts();
      
      console.log("Products response:", productsResponse);
      const productData = productsResponse.data || [];
      setProducts(productData);
      setAllProducts(productData); // Lưu dữ liệu gốc
      
      // Call other APIs
      const [brandsResponse, categoriesResponse] = await Promise.all([
        getAllBrands(),
        getAllCategories()
      ]);
      
      console.log("Brands response:", brandsResponse);
      console.log("Categories response:", categoriesResponse);
      setBrands(brandsResponse.data || []);
      setCategories(categoriesResponse.data || []);
      console.log("All APIs called successfully");
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  // Tìm kiếm local (không gọi API)
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    
    if (!value.trim()) {
      // Nếu không có từ khóa, hiển thị tất cả
      setProducts(allProducts);
      return;
    }
    
    // Tìm kiếm trong dữ liệu đã có
    const filtered = allProducts.filter(product => {
      const searchTerm = value.toLowerCase();
      const productName = product.name?.toLowerCase() || '';
      const brandName = getBrandName(product.brand_id).toLowerCase();
      const categoryName = getCategoryName(product.category_id).toLowerCase();
      
      return productName.includes(searchTerm) || 
             brandName.includes(searchTerm) || 
             categoryName.includes(searchTerm);
    });
    
    setProducts(filtered);
  };

  // Reset search khi clear
  const handleSearchClear = () => {
    setSearchKeyword("");
    setProducts(allProducts);
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
          fetchAllData();
        } catch (error) {
          console.error("Error deleting product:", error);
          message.error("Lỗi khi xóa sản phẩm");
        }
      }
    });
  };



  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      await toggleActiveProduct(id);
      message.success(`Đã ${currentStatus ? 'tắt' : 'bật'} sản phẩm`);
      fetchAllData();
    } catch (error) {
      console.error("Error toggling product status:", error);
      message.error("Lỗi khi thay đổi trạng thái sản phẩm");
    }
  };

  // Helper function để tìm brand/category theo ID
  const getBrandName = (brandId: number) => {
    const brand = brands.find(b => b.id === brandId);
    return brand?.name || `Brand ID: ${brandId}`;
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || `Category ID: ${categoryId}`;
  };

  const columns = [
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail: string) => (
        thumbnail ? 
        <img 
          src={thumbnail.startsWith('http') ? thumbnail : `http://localhost/storage/products/${thumbnail}`} 
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
      dataIndex: "brand_id",
      key: "brand_id",
      render: (brandId: number) => getBrandName(brandId),
    },
    {
      title: "Danh mục",
      dataIndex: "category_id", 
      key: "category_id",
      render: (categoryId: number) => getCategoryName(categoryId),
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      key: "is_active",
      render: (isActive: boolean, record: Product) => (
        <Switch 
          checked={isActive} 
          onChange={() => handleToggleActive(record.id!, isActive)}

        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Product) => (
        <Space>
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
        </Space>
      }
    >
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm theo tên sản phẩm, thương hiệu, danh mục..."
          allowClear
          value={searchKeyword}
          onChange={(e) => handleSearch(e.target.value)}
          onSearch={handleSearch}
          onClear={handleSearchClear}
          style={{ width: 400 }}
          enterButton={
            <Button type="primary" icon={<SearchOutlined />}>
              Tìm kiếm
            </Button>
          }
        />
        {searchKeyword && (
          <span style={{ color: '#666', fontSize: '14px' }}>
            Tìm thấy {products.length} sản phẩm
          </span>
        )}
      </Space>
      
      <Table
        columns={columns}
        dataSource={products}
        rowKey="id"
        loading={loading}
        pagination={{ 
          pageSize: 10,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`
        }}
        style={{ borderRadius: 12, overflow: "hidden" }}
      />
    </Card>
  );
}