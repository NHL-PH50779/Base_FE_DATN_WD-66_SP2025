import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Card,
  Button,
  Row,
  Col,
  Typography,
  Tag,
  Space,
  Table,
  Modal,
  message,
  Spin,
  Alert,
  Descriptions,
  Image
} from 'antd';
import {
  ArrowLeftOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  ShopOutlined,
  TagOutlined,
  DollarOutlined,
  CalendarOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import axios from 'axios';

const { Title, Text, Paragraph } = Typography;

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState(false);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  useEffect(() => {
    if (id) {
      fetchProduct();
    }
  }, [id]);

  const fetchProduct = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const [productRes, categoriesRes, brandsRes] = await Promise.all([
        axios.get(`http://127.0.0.1:8000/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://127.0.0.1:8000/api/categories', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://127.0.0.1:8000/api/brands', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      
      setProduct(productRes.data.data);
      setCategories(categoriesRes.data.data || []);
      setBrands(brandsRes.data.data || []);
      
      console.log('Product data:', productRes.data.data);
      console.log('Categories:', categoriesRes.data.data);
      console.log('Brands:', brandsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
      message.error('Không thể tải thông tin sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Modal.confirm({
      title: 'Xác nhận xóa sản phẩm',
      content: `Bạn có chắc chắn muốn xóa sản phẩm "${product.name}"? Hành động này không thể hoàn tác.`,
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          const token = localStorage.getItem('token');
          await axios.delete(`http://127.0.0.1:8000/api/products/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          message.success('Xóa sản phẩm thành công');
          navigate('/admin/products');
        } catch (error) {
          console.error('Error deleting product:', error);
          message.error('Lỗi khi xóa sản phẩm');
        }
      }
    });
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const variantColumns = [
    {
      title: 'Tên biến thể',
      dataIndex: 'Name',
      key: 'Name',
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (price: number) => formatPrice(price),
    },
    {
      title: 'Tồn kho',
      dataIndex: 'stock',
      key: 'stock',
      render: (stock: number) => (
        <Tag color={stock > 0 ? 'green' : 'red'}>
          {stock} sản phẩm
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: any, record: any) => {
        // Kiểm tra nhiều trường hợp có thể
        const isActive = status === 'active' || status === 1 || status === true || record.is_active === 1 || record.is_active === true;
        return (
          <Tag color={isActive ? 'green' : 'red'}>
            {isActive ? 'Hoạt động' : 'Không hoạt động'}
          </Tag>
        );
      },
    },
  ];

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!product) {
    return (
      <div style={{ padding: '20px' }}>
        <Alert message="Không tìm thấy sản phẩm" type="error" />
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', backgroundColor: '#f0f2f5', minHeight: '100vh' }}>
      {/* Header */}
      <Card style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/admin/products')}
            >
              Quay lại danh sách
            </Button>
            <Title level={3} style={{ margin: 0 }}>
              Chi tiết sản phẩm
            </Title>
          </div>
          
          <Space>
            <Button
              type="primary"
              icon={<EditOutlined />}
              onClick={() => navigate(`/admin/products/edit/${id}`)}
            >
              Chỉnh sửa
            </Button>
            <Button
              danger
              icon={<DeleteOutlined />}
              onClick={handleDelete}
            >
              Xóa
            </Button>
          </Space>
        </div>
      </Card>

      <Row gutter={[24, 24]}>
        {/* Product Image */}
        <Col xs={24} md={10}>
          <Card title="Hình ảnh sản phẩm">
            <Image
              width="100%"
              height={400}
              src={product.thumbnail || '/placeholder-image.jpg'}
              alt={product.name}
              style={{ objectFit: 'cover', borderRadius: '8px' }}
            />
          </Card>
        </Col>

        {/* Product Info */}
        <Col xs={24} md={14}>
          <Card title="Thông tin sản phẩm">
            <Title level={4}>{product.name}</Title>
            
            <Descriptions column={1} bordered>
              <Descriptions.Item 
                label={<><ShopOutlined /> Danh mục</>}
              >
                {categories.find(c => c.id === product.category_id)?.name || product.category?.name || 'Chưa phân loại'}
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={<><TagOutlined /> Thương hiệu</>}
              >
                {brands.find(b => b.id === product.brand_id)?.name || product.brand?.name || 'Chưa có thương hiệu'}
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={<><DollarOutlined /> Giá</>}
              >
                {product.price ? formatPrice(product.price) : 'Liên hệ'}
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={<><CalendarOutlined /> Ngày tạo</>}
              >
                {formatDate(product.created_at)}
              </Descriptions.Item>
              
              <Descriptions.Item 
                label={<><EyeOutlined /> Trạng thái</>}
              >
                <Tag color={(product.status === 'active' || product.is_active === 1 || product.is_active === true) ? 'green' : 'red'}>
                  {(product.status === 'active' || product.is_active === 1 || product.is_active === true) ? 'Hoạt động' : 'Không hoạt động'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            {product.description && (
              <div style={{ marginTop: '24px' }}>
                <Title level={5}>Mô tả sản phẩm:</Title>
                <Paragraph>{product.description}</Paragraph>
              </div>
            )}
          </Card>
        </Col>

        {/* Product Variants */}
        {product.variants && product.variants.length > 0 && (
          <Col xs={24}>
            <Card title={`Biến thể sản phẩm (${product.variants.length})`}>
              <Table
                columns={variantColumns}
                dataSource={product.variants}
                rowKey="id"
                pagination={false}
              />
            </Card>
          </Col>
        )}

        {/* Additional Info */}
        <Col xs={24}>
          <Card title="Thông tin bổ sung">
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12}>
                <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                  <Text type="secondary">ID sản phẩm</Text>
                  <Title level={4} style={{ margin: '8px 0 0 0' }}>
                    #{product.id}
                  </Title>
                </Card>
              </Col>
              
              <Col xs={24} sm={12}>
                <Card size="small" style={{ backgroundColor: '#fafafa' }}>
                  <Text type="secondary">Cập nhật lần cuối</Text>
                  <Title level={4} style={{ margin: '8px 0 0 0' }}>
                    {formatDate(product.updated_at)}
                  </Title>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>


    </div>
  );
};

export default ProductDetail;