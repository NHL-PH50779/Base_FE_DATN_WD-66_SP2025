import { useEffect, useState, useCallback, useMemo } from "react";
import { Table, Button, Space, Tag, Input, Modal, message, Card, Switch, Tabs } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, SearchOutlined, EyeOutlined, UndoOutlined } from "@ant-design/icons";
import { useNavigate, useSearchParams } from "react-router-dom";
import { getAllProducts, deleteProduct, toggleActiveProduct, searchProducts, restoreProduct, forceDeleteProduct } from "../services/product.service";
import { getAllBrands } from "../services/brand.service";
import { getAllCategories } from "../services/category.service";
import { ProductListSkeleton } from "../../../components/common/LoadingSkeleton";
import type { Product } from "../types/product.type";
import { debounce } from "lodash";

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [allProducts, setAllProducts] = useState<Product[]>([]); // Lưu tất cả sản phẩm
  const [trashedProducts, setTrashedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('active');

  const [searchKeyword, setSearchKeyword] = useState("");
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const fetchAllData = useCallback(async () => {
    setLoading(true);
    try {
      // Load products trước để hiển thị nhanh
      const productsResponse = await getAllProducts();
      
      const allProductData = (productsResponse.data || []).sort((a: Product, b: Product) => {
        const aTime = new Date(a.updated_at || a.created_at || 0).getTime();
        const bTime = new Date(b.updated_at || b.created_at || 0).getTime();
        return bTime - aTime;
      });
      
      const activeProducts = allProductData.filter((p: Product) => !p.deleted_at);
      const deletedProducts = allProductData.filter((p: Product) => p.deleted_at);
      
      setProducts(activeProducts);
      setAllProducts(activeProducts);
      setTrashedProducts(deletedProducts);
      setLoading(false);
      
      // Load brands và categories sau
      setTimeout(async () => {
        try {
          const [brandsResponse, categoriesResponse] = await Promise.all([
            getAllBrands(),
            getAllCategories()
          ]);
          setBrands(brandsResponse.data || []);
          setCategories(categoriesResponse.data || []);
        } catch (error) {
          console.error("Error loading brands/categories:", error);
        }
      }, 100);
    } catch (error) {
      console.error("Error fetching data:", error);
      message.error("Không thể tải dữ liệu");
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAllData();
  }, []);
  
  // Detect refresh param from create/update/restore
  useEffect(() => {
    const refreshParam = searchParams.get('refresh');
    if (refreshParam) {
      console.log('Refreshing product list due to refresh param');
      fetchAllData();
      // Clear URL param
      navigate('/admin/products', { replace: true });
    }
  }, [searchParams, navigate]);



  // Tìm kiếm local (không gọi API)
  const handleSearch = (value: string) => {
    setSearchKeyword(value);
    
    if (!value.trim()) {
      // Nếu không có từ khóa, hiển thị tất cả
      setProducts(allProducts);
      return;
    }
    
    // Tìm kiếm trong dữ liệu đã có (chỉ trong sản phẩm active)
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

  const handleSoftDelete = (id: number) => {
    Modal.confirm({
      title: "Xác nhận xóa sản phẩm",
      content: "Sản phẩm sẽ được chuyển vào thùng rác và có thể khôi phục sau này.",
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteProduct(id);
          message.success("Đã chuyển sản phẩm vào thùng rác");
          await fetchAllData();
          // Scroll to top để thấy sản phẩm vừa xóa
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          console.error("Error soft deleting product:", error);
          message.error("Lỗi khi xóa sản phẩm");
        }
      }
    });
  };

  const handleRestore = (id: number) => {
    Modal.confirm({
      title: "Khôi phục sản phẩm",
      content: "Bạn có chắc chắn muốn khôi phục sản phẩm này?",
      okText: "Khôi phục",
      okType: "primary",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await restoreProduct(id);
          message.success("Khôi phục sản phẩm thành công");
          await fetchAllData();
          // Scroll to top để thấy sản phẩm vừa khôi phục
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          console.error("Error restoring product:", error);
          message.error("Lỗi khi khôi phục sản phẩm");
        }
      }
    });
  };

  const handleForceDelete = (id: number) => {
    Modal.confirm({
      title: "Xóa vĩnh viễn sản phẩm",
      content: "Sản phẩm sẽ bị xóa vĩnh viễn và không thể khôi phục. Bạn có chắc chắn?",
      okText: "Xóa vĩnh viễn",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await forceDeleteProduct(id);
          message.success("Xóa vĩnh viễn sản phẩm thành công");
          await fetchAllData();
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
          console.error("Error force deleting product:", error);
          message.error("Lỗi khi xóa vĩnh viễn sản phẩm");
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
          src={thumbnail.startsWith('http') ? thumbnail : `http://127.0.0.1:8000/storage/${thumbnail.replace('products/', '')}`} 
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
            icon={<EyeOutlined />} 
            onClick={() => navigate(`/admin/products/detail/${record.id}`)}
            type="default"
          >
            Chi tiết
          </Button>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => navigate(`/admin/products/edit/${record.id}`)}
          >
            Sửa
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            danger
            onClick={() => handleSoftDelete(record.id!)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  // Columns cho sản phẩm đã xóa
  const trashedColumns = [
    {
      title: "Hình ảnh",
      dataIndex: "thumbnail",
      key: "thumbnail",
      render: (thumbnail: string) => (
        thumbnail ? 
        <img 
          src={thumbnail.startsWith('http') ? thumbnail : `http://127.0.0.1:8000/storage/${thumbnail.replace('products/', '')}`} 
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
      title: "Ngày xóa",
      dataIndex: "deleted_at",
      key: "deleted_at",
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Product) => (
        <Space>
          <Button 
            icon={<UndoOutlined />} 
            type="primary"
            onClick={() => handleRestore(record.id!)}
          >
            Khôi phục
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            danger
            onClick={() => handleForceDelete(record.id!)}
          >
            Xóa vĩnh viễn
          </Button>
        </Space>
      ),
    },
  ];

  const tabItems = [
    {
      key: 'active',
      label: `Sản phẩm hoạt động (${products.length})`,
      children: (
        <div>
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
          
          {loading ? (
            <ProductListSkeleton />
          ) : (
            <Table
              columns={columns}
              dataSource={products}
              rowKey="id"
              pagination={{ 
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => `${range[0]}-${range[1]} của ${total} sản phẩm`,
                pageSizeOptions: ['5', '10', '20', '50']
              }}
              scroll={{ y: 500 }}
              size="small"
              style={{ borderRadius: 12, overflow: "hidden" }}
            />
          )}
        </div>
      )
    }
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
            icon={<DeleteOutlined />}
            onClick={() => navigate("/admin/products/trashed")}
            style={{ borderColor: '#ff4d4f', color: '#ff4d4f' }}
          >
            Thùng rác
          </Button>
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
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab} 
        items={tabItems}
      />
    </Card>
  );
}