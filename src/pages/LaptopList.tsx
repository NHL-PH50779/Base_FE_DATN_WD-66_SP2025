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
  Input,
  Skeleton
} from "antd";
import { DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import { useEffect, useState, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Laptop } from "../types/laptop.type";
import { deleteLaptop, getAllLaptops, toggleActiveLaptop } from "../services/laptop.service";

const { Search } = Input;

const LaptopListPage = () => {
  const [data, setData] = useState<Laptop[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchText, setSearchText] = useState('');
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 15,
    total: 0
  });
  const navigate = useNavigate();

  const fetchLaptops = useCallback(async (page = 1, pageSize = 15, search = '') => {
    setLoading(true);
    try {
      // Thêm timestamp để tránh cache
      const res = await getAllLaptops(page, pageSize);
      console.log('Fetched products:', res.data);
      setData(res.data.data || []);
      if (res.data.pagination) {
        setPagination({
          current: res.data.pagination.current_page,
          pageSize: res.data.pagination.per_page,
          total: res.data.pagination.total
        });
      }
    } catch (error) {
      console.error('Fetch error:', error);
      message.error("Lỗi khi tải danh sách laptop");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTableChange = (paginationInfo: any) => {
    fetchLaptops(paginationInfo.current, paginationInfo.pageSize);
  };

  const handleSoftDelete = async (id: number) => {
    try {
      console.log('Attempting to delete product ID:', id);
      
      const product = data.find(p => p.id === id);
      if (!product) {
        message.error('Sản phẩm không tồn tại trong danh sách');
        return;
      }
      
      // Kiểm tra token
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }
      
      const response = await deleteLaptop(id);
      console.log('Delete response:', response.data);
      
      if (response.data.success) {
        message.success(response.data.message || `Đã xóa "${product.name}" thành công`);
        
        // Xóa khỏi danh sách ngay lập tức
        setData(prev => prev.filter(item => item.id !== id));
        
        // Cập nhật pagination
        setPagination(prev => ({
          ...prev,
          total: Math.max(0, prev.total - 1)
        }));
      } else {
        message.error(response.data.message || 'Xóa thất bại');
      }
      
    } catch (error: any) {
      console.error('Delete error details:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      if (error.response?.status === 401) {
        message.error('Phiên làm việc hết hạn, vui lòng đăng nhập lại');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      } else if (error.response?.status === 404) {
        message.error('Sản phẩm không tồn tại hoặc đã bị xóa');
        setData(prev => prev.filter(item => item.id !== id));
      } else if (error.response?.status === 403) {
        message.error('Bạn không có quyền thực hiện hành động này');
      } else {
        const errorMessage = error.response?.data?.message || error.message || 'Xóa thất bại';
        message.error(errorMessage);
      }
    }
  };

  const handleToggle = useCallback(async (id: number) => {
    try {
      const response = await toggleActiveLaptop(id);
      message.success(response.data.message || 'Đã cập nhật trạng thái');
      // Optimistic update
      setData(prev => prev.map(item => 
        item.id === id ? { ...item, is_active: !item.is_active } : item
      ));
    } catch (error: any) {
      console.error('Toggle error:', error);
      message.error(error.response?.data?.message || "Lỗi khi đổi trạng thái");
      fetchLaptops(pagination.current, pagination.pageSize);
    }
  }, [pagination.current, pagination.pageSize, fetchLaptops]);

  useEffect(() => {
    // Clear cache trước khi fetch
    Object.keys(localStorage).forEach(key => {
      if (key.includes('cache') || key.includes('products')) {
        localStorage.removeItem(key);
      }
    });
    
    fetchLaptops();
  }, [fetchLaptops]);

  const columns = useMemo(() => [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
      ellipsis: true,
    },
    {
      title: "Thương hiệu",
      dataIndex: ["brand", "name"],
      key: "brand",
      width: 120,
    },
    {
      title: "Danh mục",
      dataIndex: ["category", "name"],
      key: "category",
      width: 120,
    },
    {
      title: "Trạng thái",
      dataIndex: "is_active",
      width: 150,
      render: (val: boolean, record: Laptop) => (
        <Switch
          checked={val}
          onChange={() => handleToggle(record.id!)}
          size="small"
        />
      ),
    },
    {
      title: "Hành động",
      key: "action",
      width: 200,
      render: (_: unknown, record: Laptop) => (
        <Space size="small">
          <Button size="small" onClick={() => navigate(`/admin/laptops/edit/${record.id}`)}>
            Sửa
          </Button>
          <Popconfirm
            title="Chuyển vào thùng rác?"
            onConfirm={() => handleSoftDelete(record.id!)}
          >
            <Button size="small" danger>Xóa</Button>
          </Popconfirm>
        </Space>
      ),
    },
  ], [handleToggle, navigate, handleSoftDelete]);

  return (
    <Card
      title={<span style={{ color: "#1890ff", fontWeight: 700, fontSize: 22 }}>Quản lý Laptop</span>}
      extra={
        <Space>
          <Button 
            onClick={() => navigate("/admin/products/trashed")}
            style={{ marginRight: 8 }}
          >
            Thùng rác
          </Button>
          <Button type="primary" onClick={() => navigate("/admin/laptops/create"))
            style={{ background: "linear-gradient(90deg,#1890ff 0%,#52c41a 100%)", border: "none" }}>
            Thêm laptop
          </Button>
        </Space>
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
      <div style={{ marginBottom: 16 }}>
        <Search
          placeholder="Tìm kiếm sản phẩm..."
          allowClear
          enterButton={<SearchOutlined />}
          size="large"
          onSearch={(value) => {
            setSearchText(value);
            fetchLaptops(1, pagination.pageSize, value);
          }}
          style={{ maxWidth: 400 }}
        />
      </div>
      
      {loading ? (
        <Skeleton active paragraph={{ rows: 8 }} />
      ) : (
        <Table
          columns={columns}
          rowKey="id"
          dataSource={data}
          loading={false}
          size="small"
          pagination={{
            ...pagination,
            showSizeChanger: true,
            showQuickJumper: true,
            showTotal: (total, range) => `${range[0]}-${range[1]} của ${total}`,
            pageSizeOptions: ['15', '25', '50']
          }}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />
      )}
    </Card>
  );
};

export default LaptopListPage;
