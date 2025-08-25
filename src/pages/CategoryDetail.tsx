import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, Typography, Button, Table, Image, Tag, message } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { categoryService } from '../services/category.service';
import { getProductsByCategory } from '../modules/products/services/product.service';

const { Title } = Typography;

interface Product {
  id: number;
  name: string;
  price: number;
  thumbnail: string;
  is_active: boolean;
  brand: {
    name: string;
  };
}

interface Category {
  id: number;
  name: string;
  products_count: number;
}

const CategoryDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      fetchCategoryDetail();
      fetchCategoryProducts();
    }
  }, [id]);

  const fetchCategoryDetail = async () => {
    try {
      const response = await categoryService.getCategoryById(Number(id));
      setCategory(response.data);
    } catch (error) {
      message.error('Lỗi khi tải thông tin danh mục');
    }
  };

  const fetchCategoryProducts = async () => {
    setLoading(true);
    try {
      const response = await getProductsByCategory(Number(id));
      setProducts(response.data);
    } catch (error) {
      message.error('Lỗi khi tải danh sách sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Hình ảnh',
      dataIndex: 'thumbnail',
      key: 'thumbnail',
      width: 100,
      render: (thumbnail: string) => {
        const imageUrl = thumbnail 
          ? (thumbnail.startsWith('http') 
              ? thumbnail 
              : `http://127.0.0.1:8000/storage/${thumbnail.replace('products/', '')}`)
          : '/placeholder.jpg';
        
        return (
          <Image
            src={imageUrl}
            alt="Product"
            width={60}
            height={60}
            style={{ objectFit: 'cover', borderRadius: 4 }}
            fallback="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMIAAADDCAYAAADQvc6UAAABRWlDQ1BJQ0MgUHJvZmlsZQAAKJFjYGASSSwoyGFhYGDIzSspCnJ3UoiIjFJgf8LAwSDCIMogwMCcmFxc4BgQ4ANUwgCjUcG3awyMIPqyLsis7PPOq3QdDFcvjV3jOD1boQVTPQrgSkktTgbSf4A4LbmgqISBgTEFyFYuLykAsTuAbJEioKOA7DkgdjqEvQHEToKwj4DVhAQ5A9k3gGyB5IxEoBmML4BsnSQk8XQkNtReEOBxcfXxUQg1Mjc0dyHgXNJBSWpFCYh2zi+oLMpMzyhRcASGUqqCZ16yno6CkYGRAQMDKMwhqj/fAIcloxgHQqxAjIHBEugw5sUIsSQpBobtQPdLciLEVJYzMPBHMDBsayhILEqEO4DxG0txmrERhM29nYGBddr//5/DGRjYNRkY/l7////39v///y4Dmn+LgeHANwDrkl1AuO+pmgAAADhlWElmTU0AKgAAAAgAAYdpAAQAAAABAAAAGgAAAAAAAqACAAQAAAABAAAAwqADAAQAAAABAAAAwwAAAAD9b/HnAAAHlklEQVR4Ae3dP3Ik1RnG4W+FgYxN"
          />
        );
      }
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
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => `${price.toLocaleString('vi-VN')} ₫`,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (is_active: boolean) => (
        <Tag color={is_active ? 'green' : 'red'}>
          {is_active ? 'Hoạt động' : 'Không hoạt động'}
        </Tag>
      ),
    },
  ];

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button
          icon={<ArrowLeftOutlined />}
          onClick={() => navigate('/admin/categories')}
          style={{ marginBottom: 16 }}
        >
          Quay lại
        </Button>
        
        <Title level={2}>
          Chi tiết danh mục: {category?.name}
        </Title>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="id"
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng cộng ${total} sản phẩm`,
        }}
      />
    </Card>
  );
};

export default CategoryDetail;