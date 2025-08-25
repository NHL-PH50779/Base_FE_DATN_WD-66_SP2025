import { Button, Card, Space, Table, message, Popconfirm } from 'antd';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UndoOutlined, DeleteOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { getTrashedProducts, restoreProduct } from '../modules/products/services/product.service';

interface TrashedProduct {
  id: number;
  name: string;
  brand: { name: string };
  category: { name: string };
  deleted_at: string;
}

const TrashedProducts = () => {
  const [data, setData] = useState<TrashedProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchTrashedProducts = async () => {
    setLoading(true);
    try {
      const response = await getTrashedProducts();
      
      // Parse response data correctly
      let products = [];
      if (response.data && response.data.data) {
        products = response.data.data;
      } else if (Array.isArray(response.data)) {
        products = response.data;
      } else if (response.data) {
        products = [response.data];
      }
      
      // Sắp xếp theo thời gian xóa mới nhất lên đầu
      const sortedProducts = products.sort((a: any, b: any) => {
        const aTime = new Date(a.deleted_at || 0).getTime();
        const bTime = new Date(b.deleted_at || 0).getTime();
        return bTime - aTime;
      });
      setData(sortedProducts);
    } catch (error) {
      console.error('Error fetching trashed products:', error);
      message.error('Lỗi khi tải danh sách sản phẩm đã xóa');
    } finally {
      setLoading(false);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      const response = await restoreProduct(id);
      console.log('Restore response:', response);
      
      message.success('Khôi phục sản phẩm thành công');
      
      // Xóa sản phẩm khỏi danh sách thùng rác
      setData(prev => prev.filter(item => item.id !== id));
      
      // Clear localStorage cache nếu có
      Object.keys(localStorage).forEach(key => {
        if (key.includes('products') || key.includes('cache')) {
          localStorage.removeItem(key);
        }
      });
      
      // Navigate về trang sản phẩm với force refresh
      setTimeout(() => {
        window.location.href = '/admin/products';
      }, 500);
      
    } catch (error: any) {
      console.error('Restore error:', error);
      message.error(error.response?.data?.message || 'Lỗi khi khôi phục sản phẩm');
    }
  };

  const handleForceDelete = async (id: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/admin/products/force-delete/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        message.success('Xóa vĩnh viễn thành công');
        await fetchTrashedProducts();
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Lỗi khi xóa sản phẩm');
      }
    } catch (error: any) {
      console.error('Force delete error:', error);
      message.error(error.message || 'Lỗi khi xóa vĩnh viễn sản phẩm');
    }
  };

  useEffect(() => {
    fetchTrashedProducts();
  }, []);

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      render: (thumbnail: string) => (
        thumbnail ? (
          <img 
            src={thumbnail} 
            alt="Product" 
            style={{ width: 50, height: 50, objectFit: 'cover', borderRadius: 4 }}
          />
        ) : (
          <div style={{ width: 50, height: 50, background: '#f0f0f0', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            No Image
          </div>
        )
      ),
    },
    {
      title: 'Tên sản phẩm',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Thương hiệu',
      dataIndex: ['brand', 'name'],
      key: 'brand',
    },
    {
      title: 'Danh mục',
      dataIndex: ['category', 'name'],
      key: 'category',
    },
    {
      title: 'Ngày xóa',
      dataIndex: 'deleted_at',
      key: 'deleted_at',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: TrashedProduct) => (
        <Space>
          <Popconfirm
            title="Khôi phục sản phẩm?"
            onConfirm={() => handleRestore(record.id)}
          >
            <Button type="primary" icon={<UndoOutlined />}>
              Khôi phục
            </Button>
          </Popconfirm>
          <Popconfirm
            title="Xóa vĩnh viễn? Không thể hoàn tác!"
            onConfirm={() => handleForceDelete(record.id)}
          >
            <Button danger icon={<DeleteOutlined />}>
              Xóa vĩnh viễn
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <span style={{ color: '#ff4d4f', fontWeight: 700, fontSize: 22 }}>
          Thùng rác sản phẩm
        </span>
      }
      extra={
        <Button 
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/products')}
        >
          Quay lại
        </Button>
      }
      style={{
        background: 'linear-gradient(135deg, #fff2f0 0%, #ffebe6 100%)',
        borderRadius: 16,
        boxShadow: '0 4px 24px rgba(255,77,79,0.08)',
      }}
    >
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        locale={{ emptyText: 'Không có sản phẩm nào trong thùng rác' }}
      />
    </Card>
  );
};

export default TrashedProducts;