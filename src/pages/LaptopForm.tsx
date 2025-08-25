// src/pages/admin/laptop/LaptopForm.tsx
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Switch,
  message,
  InputNumber,
  Space
} from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createLaptop, getLaptopById, updateLaptop } from "../services/laptop.service";


const LaptopForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  const [brands, setBrands] = useState<{ id: number; name: string }[]>([]);
  const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    // mock data brand & category, bạn thay bằng API thật nếu có
    setBrands([
      { id: 1, name: "Dell" },
      { id: 2, name: "HP" },
      { id: 3, name: "Asus" },
    ]);
    setCategories([
      { id: 1, name: "Gaming" },
      { id: 2, name: "Văn phòng" },
      { id: 3, name: "Đồ họa" },
    ]);
  }, []);

  useEffect(() => {
    if (id) {
      setIsEdit(true);
      getLaptopById(Number(id)).then((res) => {
        form.setFieldsValue(res.data.data);
      });
    }
  }, [id]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      console.log('Form submission:', { isEdit, id, values });
      
      // Kiểm tra token
      const token = localStorage.getItem('token');
      if (!token) {
        message.error('Vui lòng đăng nhập lại');
        return;
      }
      
      const processedValues = {
        ...values,
        price: values.price || null,
        stock: values.stock || null
      };
      
      console.log('Processed values:', processedValues);
      
      if (isEdit && id) {
        const response = await updateLaptop(Number(id), processedValues);
        console.log('Update response:', response.data);
        
        message.success(response.data.message || "Cập nhật thành công!");
        
        // Clear cache và force refresh
        Object.keys(localStorage).forEach(key => {
          if (key.includes('cache') || key.includes('products')) {
            localStorage.removeItem(key);
          }
        });
        
        // Force refresh trang
        setTimeout(() => {
          window.location.href = '/admin/laptops';
        }, 500);
      } else {
        const response = await createLaptop(processedValues);
        console.log('Create response:', response.data);
        
        if (response.data.message?.includes('thành công')) {
          message.success(response.data.message);
          form.resetFields();
          form.setFieldsValue({ is_active: true });
        } else {
          message.error(response.data.message || "Tạo sản phẩm thất bại");
        }
      }
    } catch (error: any) {
      console.error('Form submission error:', {
        error: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      
      if (error.response?.status === 401) {
        message.error('Phiên làm việc hết hạn, vui lòng đăng nhập lại');
      } else if (error.response?.status === 422 && error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.keys(errors).forEach(key => {
          message.error(`${key}: ${errors[key][0]}`);
        });
      } else {
        const errorMessage = error.response?.data?.message || error.message || "Đã xảy ra lỗi";
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    form.resetFields();
    form.setFieldsValue({ is_active: true });
    message.info('Đã reset form');
  };

  return (
    <Card title={isEdit ? "Cập nhật laptop" : "Thêm mới laptop"}>
      <Form
        layout="vertical"
        form={form}
        onFinish={onFinish}
        initialValues={{ is_active: true }}
      >
        <Form.Item
          label="Tên laptop"
          name="name"
          rules={[{ required: true, message: "Nhập tên laptop" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item label="Mô tả" name="description">
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Thumbnail (URL)" name="thumbnail">
          <Input />
        </Form.Item>

        <Form.Item
          label="Thương hiệu"
          name="brand_id"
          rules={[{ required: true, message: "Chọn thương hiệu" }]}
        >
          <Select options={brands.map((b) => ({ value: b.id, label: b.name }))} />
        </Form.Item>

        <Form.Item
          label="Danh mục"
          name="category_id"
          rules={[{ required: true, message: "Chọn danh mục" }]}
        >
          <Select options={categories.map((c) => ({ value: c.id, label: c.name }))} />
        </Form.Item>

        <Form.Item label="Giá bán chung" name="price">
          <InputNumber
            style={{ width: '100%' }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
            placeholder="Nhập giá bán (có thể để trống)"
            min={0}
          />
        </Form.Item>

        <Form.Item label="Số lượng tồn kho" name="stock">
          <InputNumber
            style={{ width: '100%' }}
            placeholder="Nhập số lượng (có thể để trống)"
            min={0}
          />
        </Form.Item>

        <Form.Item label="Kích hoạt" name="is_active" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEdit ? "Cập nhật" : "Tạo mới"}
            </Button>
            {!isEdit && (
              <Button onClick={handleReset}>
                Reset Form
              </Button>
            )}
            <Button onClick={() => navigate("/admin/laptops")}>
              Quay lại
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LaptopForm;
