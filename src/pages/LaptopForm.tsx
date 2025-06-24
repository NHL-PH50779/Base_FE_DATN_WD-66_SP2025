// src/pages/admin/laptop/LaptopForm.tsx
import {
  Button,
  Card,
  Form,
  Input,
  Select,
  Switch,
  message,
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
      if (isEdit) {
        await updateLaptop(Number(id), values);
        message.success("Cập nhật thành công!");
      } else {
        await createLaptop(values);
        message.success("Tạo sản phẩm thành công!");
      }
      navigate("/admin/laptops");
    } catch {
      message.error("Đã xảy ra lỗi");
    } finally {
      setLoading(false);
    }
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

        <Form.Item label="Kích hoạt" name="is_active" valuePropName="checked">
          <Switch />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            {isEdit ? "Cập nhật" : "Tạo mới"}
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default LaptopForm;
