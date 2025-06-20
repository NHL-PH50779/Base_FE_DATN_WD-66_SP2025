import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Upload, Switch, Card, Divider, Space, InputNumber, Table, message, Tabs, Modal } from 'antd';
import { PlusOutlined, MinusCircleOutlined, UploadOutlined, DeleteOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { createProduct, getProductById, updateProduct } from '../services/product.service';
import { getAllBrands } from '../services/brand.service';
import { getAllCategories } from '../services/category.service';
import { getAllAttributes, createAttribute, createAttributeValue } from '../services/attribute.service';
import type { Product } from '../types/product.type';
import type { Attribute, AttributeValue } from '../types/attribute.type';

const { TextArea } = Input;
const { Option } = Select;

interface ProductFormProps {
  isEdit?: boolean;
}

interface VariantAttribute {
  attribute_id: number;
  attribute_name: string;
  value_id?: number;
  value: string;
}

interface ProductVariant {
  id: number;
  sku: string;
  price: number;
  stock: number;
  is_active: boolean;
  color?: string;
  attributes?: VariantAttribute[];
}

const ProductForm: React.FC<ProductFormProps> = ({ isEdit = false }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState(false);
  const [brands, setBrands] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  
  // State cho modal thêm thuộc tính mới
  const [attributeModalVisible, setAttributeModalVisible] = useState(false);
  const [newAttributeName, setNewAttributeName] = useState('');
  const [newAttributeValues, setNewAttributeValues] = useState<string[]>(['']);
  
  // State cho các thuộc tính đã chọn
  const [selectedAttributes, setSelectedAttributes] = useState<{
    attribute_id: number;
    values: number[];
  }[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch brands, categories, and attributes
        const [brandsRes, categoriesRes, attributesRes] = await Promise.all([
          getAllBrands(),
          getAllCategories(),
          getAllAttributes()
        ]);
        
        setBrands(brandsRes.data || []);
        setCategories(categoriesRes.data || []);
        setAttributes(Array.isArray(attributesRes.data) ? attributesRes.data : []);

        // If editing, fetch product details
        if (isEdit && id) {
          setLoading(true);
          const productRes = await getProductById(parseInt(id));
          const product = productRes.data;
          
          if (product) {
            // Set form values
            form.setFieldsValue({
              name: product.name,
              description: product.description,
              brand_id: product.brand_id,
              category_id: product.category_id,
              is_active: product.is_active,
            });
            
            // Set variants if available
            if (product.variants && product.variants.length > 0) {
              setVariants(product.variants);
            }
            
            // Set thumbnail if available
            if (product.thumbnail) {
              setFileList([{
                uid: '-1',
                name: 'thumbnail.png',
                status: 'done',
                url: product.thumbnail.startsWith('http') 
                  ? product.thumbnail 
                  : `http://localhost/storage/products/${product.thumbnail}`
              }]);
            }
          }
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        message.error("Không thể tải dữ liệu");
        setLoading(false);
      }
    };

    fetchData();
  }, [isEdit, id, form]);

  // Xử lý chọn thuộc tính
  const handleSelectAttribute = (attribute_id: number, values: number[]) => {
    const existingIndex = selectedAttributes.findIndex(a => a.attribute_id === attribute_id);
    
    if (existingIndex >= 0) {
      const newSelectedAttributes = [...selectedAttributes];
      newSelectedAttributes[existingIndex].values = values;
      setSelectedAttributes(newSelectedAttributes);
    } else {
      setSelectedAttributes([...selectedAttributes, { attribute_id, values }]);
    }
  };

  // Tạo các biến thể từ thuộc tính đã chọn
  const generateVariants = () => {
    if (selectedAttributes.length === 0) {
      message.warning("Vui lòng chọn ít nhất một thuộc tính");
      return;
    }

    // Lấy thông tin chi tiết của các thuộc tính đã chọn
    const selectedAttributesDetails = selectedAttributes.map(sa => {
      const attribute = attributes.find(a => a.id === sa.attribute_id);
      if (!attribute) return null;
      
      const selectedValues = attribute.values?.filter(v => sa.values.includes(v.id!)) || [];
      return {
        attribute_id: sa.attribute_id,
        attribute_name: attribute.name,
        values: selectedValues
      };
    }).filter(Boolean) as { attribute_id: number; attribute_name: string; values: AttributeValue[] }[];

    if (selectedAttributesDetails.some(a => a.values.length === 0)) {
      message.warning("Vui lòng chọn ít nhất một giá trị cho mỗi thuộc tính");
      return;
    }

    // Hàm đệ quy để tạo tổ hợp các giá trị thuộc tính
    const generateCombinations = (
      attributes: { attribute_id: number; attribute_name: string; values: AttributeValue[] }[],
      index: number,
      current: VariantAttribute[],
      result: VariantAttribute[][]
    ) => {
      if (index === attributes.length) {
        result.push([...current]);
        return;
      }

      const attribute = attributes[index];
      for (const value of attribute.values) {
        current.push({
          attribute_id: attribute.attribute_id,
          attribute_name: attribute.attribute_name,
          value_id: value.id,
          value: value.value
        });
        generateCombinations(attributes, index + 1, current, result);
        current.pop();
      }
    };

    // Tạo tất cả các tổ hợp thuộc tính
    const combinations: VariantAttribute[][] = [];
    generateCombinations(selectedAttributesDetails, 0, [], combinations);

    // Tạo các biến thể từ các tổ hợp
    const newVariants = combinations.map((combination, index) => {
      // Tạo SKU từ tên sản phẩm và các giá trị thuộc tính
      const productName = form.getFieldValue('name') || '';
      const sku = `${productName.substring(0, 3).toUpperCase()}-${combination.map(c => c.value.substring(0, 2)).join('-')}-${index + 1}`;
      
      return {
        id: Date.now() + index,
        sku,
        price: 0,
        stock: 0,
        is_active: true,
        attributes: combination
      };
    });

    setVariants([...variants, ...newVariants]);
    message.success(`Đã tạo ${newVariants.length} biến thể`);
  };

  // Xử lý thêm thuộc tính mới
  const handleAddAttribute = async () => {
    if (!newAttributeName.trim()) {
      message.error("Vui lòng nhập tên thuộc tính");
      return;
    }

    const validValues = newAttributeValues.filter(v => v.trim() !== '');
    if (validValues.length === 0) {
      message.error("Vui lòng nhập ít nhất một giá trị thuộc tính");
      return;
    }

    try {
      // Tạo thuộc tính mới
      const attributeRes = await createAttribute({ name: newAttributeName });
      const newAttribute = attributeRes.data;
      
      if (newAttribute && newAttribute.id) {
        // Tạo các giá trị thuộc tính
        const valuePromises = validValues.map(value => 
          createAttributeValue({ 
            attribute_id: newAttribute.id!, 
            value 
          })
        );
        
        await Promise.all(valuePromises);
        
        // Cập nhật danh sách thuộc tính
        const attributesRes = await getAllAttributes();
        setAttributes(Array.isArray(attributesRes.data) ? attributesRes.data : []);
        
        // Reset form
        setNewAttributeName('');
        setNewAttributeValues(['']);
        setAttributeModalVisible(false);
        
        message.success("Thêm thuộc tính thành công");
      }
    } catch (error) {
      console.error("Error adding attribute:", error);
      message.error("Lỗi khi thêm thuộc tính");
    }
  };

  const handleAddVariant = () => {
    setVariants([...variants, {
      id: Date.now(),
      sku: '',
      price: 0,
      stock: 0,
      is_active: true,
      color: ''
    }]);
  };

  const handleRemoveVariant = (variantId: number) => {
    setVariants(variants.filter(v => v.id !== variantId));
  };

  const handleVariantChange = (variantId: number, field: string, value: any) => {
    setVariants(variants.map(v => 
      v.id === variantId ? { ...v, [field]: value } : v
    ));
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      
      // Tạo object data thay vì FormData để tránh lỗi "không có dữ liệu"
      const productData: any = {
        name: values.name,
        description: values.description || '',
        brand_id: values.brand_id,
        category_id: values.category_id,
        is_active: values.is_active ? 1 : 0,
      };
      
      // Thêm variants nếu có
      if (variants.length > 0) {
        productData.variants = variants;
      }
      
      console.log('Submitting product data:', productData);
      
      if (isEdit && id) {
        await updateProduct(parseInt(id), productData);
        message.success('Cập nhật sản phẩm thành công');
      } else {
        // Với create vẫn dùng FormData nếu có file
        if (fileList.length > 0 && fileList[0].originFileObj) {
          const formData = new FormData();
          Object.keys(productData).forEach(key => {
            if (key === 'variants') {
              formData.append(key, JSON.stringify(productData[key]));
            } else {
              formData.append(key, productData[key]);
            }
          });
          formData.append('thumbnail', fileList[0].originFileObj);
          await createProduct(formData);
        } else {
          await createProduct(productData);
        }
        message.success('Thêm sản phẩm thành công');
      }
      
      navigate('/admin/products');
    } catch (error) {
      console.error("Error saving product:", error);
      message.error('Lỗi khi lưu sản phẩm');
    } finally {
      setLoading(false);
    }
  };

  const variantColumns = [
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      render: (text: string, record: ProductVariant) => (
        <Input
          value={text}
          onChange={(e) => handleVariantChange(record.id, 'sku', e.target.value)}
          placeholder="SKU"
        />
      )
    },
    {
      title: 'Màu sắc',
      dataIndex: 'color',
      key: 'color',
      render: (text: string, record: ProductVariant) => (
        <Input
          value={text}
          onChange={(e) => handleVariantChange(record.id, 'color', e.target.value)}
          placeholder="Nhập màu sắc"
        />
      )
    },
    {
      title: 'Thuộc tính',
      dataIndex: 'attributes',
      key: 'attributes',
      render: (attributes: VariantAttribute[] | undefined) => (
        attributes && attributes.length > 0 ? (
          <div>
            {attributes.map((attr, index) => (
              <span key={index} style={{ 
                display: 'inline-block', 
                background: '#f0f0f0', 
                padding: '2px 8px', 
                margin: '2px', 
                borderRadius: '4px',
                fontSize: '12px'
              }}>
                {attr.attribute_name}: {attr.value}
              </span>
            ))}
          </div>
        ) : '-'
      )
    },
    {
      title: 'Giá',
      dataIndex: 'price',
      key: 'price',
      render: (text: number, record: ProductVariant) => (
        <InputNumber
          value={text}
          onChange={(value) => handleVariantChange(record.id, 'price', value)}
          min={0}
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'Số lượng',
      dataIndex: 'stock',
      key: 'stock',
      render: (text: number, record: ProductVariant) => (
        <InputNumber
          value={text}
          onChange={(value) => handleVariantChange(record.id, 'stock', value)}
          min={0}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'Trạng thái',
      dataIndex: 'is_active',
      key: 'is_active',
      render: (checked: boolean, record: ProductVariant) => (
        <Switch
          checked={checked}
          onChange={(value) => handleVariantChange(record.id, 'is_active', value)}
        />
      )
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: ProductVariant) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => handleRemoveVariant(record.id)}
        />
      )
    }
  ];

  const tabItems = [
    {
      key: '1',
      label: 'Tạo biến thể từ thuộc tính',
      children: (
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
            <h3>Chọn thuộc tính</h3>
            <Button 
              type="primary" 
              icon={<PlusOutlined />} 
              onClick={() => setAttributeModalVisible(true)}
            >
              Thêm thuộc tính mới
            </Button>
          </div>
          
          {attributes.map(attribute => (
            <div key={attribute.id} style={{ marginBottom: 16 }}>
              <h4>{attribute.name}</h4>
              <Select
                mode="multiple"
                style={{ width: '100%' }}
                placeholder={`Chọn giá trị cho ${attribute.name}`}
                onChange={(values) => handleSelectAttribute(attribute.id!, values)}
              >
                {attribute.values?.map(value => (
                  <Option key={value.id} value={value.id!}>{value.value}</Option>
                ))}
              </Select>
            </div>
          ))}
          
          <Button 
            type="primary" 
            onClick={generateVariants} 
            style={{ marginTop: 16 }}
          >
            Tạo biến thể
          </Button>
        </div>
      )
    },
    {
      key: '2',
      label: 'Thêm biến thể thủ công',
      children: (
        <Button 
          type="dashed" 
          onClick={handleAddVariant} 
          icon={<PlusOutlined />}
          style={{ marginBottom: 16 }}
        >
          Thêm biến thể
        </Button>
      )
    }
  ];

  return (
    <Card
      title={
        <span style={{ color: "#1890ff", fontWeight: 700, fontSize: 22 }}>
          {isEdit ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
        </span>
      }
      style={{
        background: "linear-gradient(135deg, #f0f5ff 0%, #e6fffb 100%)",
        borderRadius: 16,
        boxShadow: "0 4px 24px rgba(24,144,255,0.08)",
      }}
      styles={{
        header: {
          borderRadius: "16px 16px 0 0",
          background: "#fff",
        }
      }}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        initialValues={{
          is_active: true
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          <Form.Item
            name="name"
            label="Tên sản phẩm"
            rules={[{ required: true, message: 'Vui lòng nhập tên sản phẩm' }]}
          >
            <Input placeholder="Nhập tên sản phẩm" />
          </Form.Item>

          <Form.Item
            name="thumbnail"
            label="Hình ảnh"
          >
            <Upload
              listType="picture"
              maxCount={1}
              fileList={fileList}
              onChange={({ fileList }) => setFileList(fileList)}
              beforeUpload={() => false}
            >
              <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>
          </Form.Item>

          <Form.Item
            name="brand_id"
            label="Thương hiệu"
            rules={[{ required: true, message: 'Vui lòng chọn thương hiệu' }]}
          >
            <Select placeholder="Chọn thương hiệu">
              {brands.map(brand => (
                <Option key={brand.id} value={brand.id}>{brand.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="category_id"
            label="Danh mục"
            rules={[{ required: true, message: 'Vui lòng chọn danh mục' }]}
          >
            <Select placeholder="Chọn danh mục">
              {categories.map(category => (
                <Option key={category.id} value={category.id}>{category.name}</Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            name="description"
            label="Mô tả"
            className="col-span-2"
          >
            <TextArea rows={4} placeholder="Nhập mô tả sản phẩm" />
          </Form.Item>

          <Form.Item
            name="is_active"
            label="Trạng thái"
            valuePropName="checked"
          >
            <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
          </Form.Item>
        </div>

        <Divider orientation="left">Biến thể sản phẩm</Divider>
        
        <Tabs defaultActiveKey="1" items={tabItems} />
        
        <div style={{ marginTop: 16 }}>
          <Table
            dataSource={variants}
            columns={variantColumns}
            rowKey="id"
            pagination={false}
            size="small"
            bordered
          />
        </div>

        <Divider />
        
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? 'Cập nhật' : 'Thêm mới'}
            </Button>
            <Button onClick={() => navigate('/admin/products')}>Hủy</Button>
          </Space>
        </Form.Item>
      </Form>
      
      <Modal
        title="Thêm thuộc tính mới"
        open={attributeModalVisible}
        onOk={handleAddAttribute}
        onCancel={() => setAttributeModalVisible(false)}
        okText="Thêm"
        cancelText="Hủy"
      >
        <Form layout="vertical">
          <Form.Item label="Tên thuộc tính" required>
            <Input 
              placeholder="Nhập tên thuộc tính" 
              value={newAttributeName}
              onChange={(e) => setNewAttributeName(e.target.value)}
            />
          </Form.Item>
          
          <Form.Item label="Giá trị thuộc tính" required>
            {newAttributeValues.map((value, index) => (
              <div key={index} style={{ display: 'flex', marginBottom: 8 }}>
                <Input
                  placeholder="Nhập giá trị thuộc tính"
                  value={value}
                  onChange={(e) => {
                    const newValues = [...newAttributeValues];
                    newValues[index] = e.target.value;
                    setNewAttributeValues(newValues);
                  }}
                  style={{ marginRight: 8 }}
                />
                {newAttributeValues.length > 1 && (
                  <Button
                    icon={<MinusCircleOutlined />}
                    onClick={() => {
                      const newValues = [...newAttributeValues];
                      newValues.splice(index, 1);
                      setNewAttributeValues(newValues);
                    }}
                  />
                )}
              </div>
            ))}
            <Button
              type="dashed"
              onClick={() => setNewAttributeValues([...newAttributeValues, ''])}
              icon={<PlusCircleOutlined />}
              style={{ width: '100%' }}
            >
              Thêm giá trị
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default ProductForm;