import { useEffect, useState } from "react";
import { Table, Button, Space, Input, Modal, message, Card, Form, Tag } from "antd";
import { EditOutlined, DeleteOutlined, PlusOutlined, PlusCircleOutlined, MinusCircleOutlined, AppstoreAddOutlined } from "@ant-design/icons";
import { getAllAttributes, createAttribute, updateAttribute, deleteAttribute, createAttributeValue, deleteAttributeValue } from "../services/attribute.service";
import type { Attribute, AttributeValue } from "../types/attribute.type";

export default function AttributeList() {
  const [attributes, setAttributes] = useState<Attribute[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingAttribute, setEditingAttribute] = useState<Attribute | null>(null);
  const [form] = Form.useForm();
  const [attributeValues, setAttributeValues] = useState<string[]>(['']);
  const [addValueModalVisible, setAddValueModalVisible] = useState(false);
  const [selectedAttributeForValue, setSelectedAttributeForValue] = useState<Attribute | null>(null);
  const [newValueForm] = Form.useForm();

  const fetchAttributes = async () => {
    setLoading(true);
    try {
      const response = await getAllAttributes();
      setAttributes(response.data || []);
    } catch (error) {
      console.error("Error fetching attributes:", error);
      message.error("Không thể tải danh sách thuộc tính");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleAdd = () => {
    setEditingAttribute(null);
    setAttributeValues(['']);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (attribute: Attribute) => {
    setEditingAttribute(attribute);
    form.setFieldsValue({ name: attribute.name });
    setAttributeValues(attribute.values?.map(v => v.value) || ['']);
    setModalVisible(true);
  };

  const handleDelete = (id: number, name: string) => {
    Modal.confirm({
      title: "Xác nhận xóa thuộc tính",
      content: `Bạn có chắc chắn muốn xóa thuộc tính "${name}"? Tất cả giá trị thuộc tính sẽ bị xóa.`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteAttribute(id);
          message.success("Xóa thuộc tính thành công");
          fetchAttributes();
        } catch (error) {
          console.error("Error deleting attribute:", error);
          message.error("Lỗi khi xóa thuộc tính");
        }
      }
    });
  };

  const handleDeleteValue = async (valueId: number, valueName: string) => {
    Modal.confirm({
      title: "Xác nhận xóa giá trị",
      content: `Bạn có chắc chắn muốn xóa giá trị "${valueName}"?`,
      okText: "Xóa",
      okType: "danger",
      cancelText: "Hủy",
      onOk: async () => {
        try {
          await deleteAttributeValue(valueId);
          message.success("Xóa giá trị thành công");
          fetchAttributes();
        } catch (error) {
          console.error("Error deleting attribute value:", error);
          message.error("Lỗi khi xóa giá trị");
        }
      }
    });
  };

  const handleSubmit = async (values: { name: string }) => {
    const validValues = attributeValues.filter(v => v.trim() !== '');
    
    if (validValues.length === 0) {
      message.error("Vui lòng nhập ít nhất một giá trị thuộc tính");
      return;
    }

    // Kiểm tra trùng lặp trong danh sách giá trị
    if (checkDuplicateValues(validValues)) {
      message.error("Có giá trị bị trùng lặp trong danh sách!");
      return;
    }

    try {
      if (editingAttribute) {
        // Update attribute
        await updateAttribute(editingAttribute.id!, { name: values.name });
        
        // Add new values if any
        const existingValues = editingAttribute.values?.map(v => v.value) || [];
        const newValues = validValues.filter(v => !existingValues.includes(v));
        
        for (const value of newValues) {
          await createAttributeValue({
            attribute_id: editingAttribute.id!,
            value
          });
        }
        
        message.success("Cập nhật thuộc tính thành công");
      } else {
        // Create new attribute
        const attributeRes = await createAttribute({ name: values.name });
        const newAttribute = attributeRes.data;
        
        if (newAttribute && newAttribute.id) {
          // Create attribute values
          for (const value of validValues) {
            await createAttributeValue({
              attribute_id: newAttribute.id,
              value
            });
          }
        }
        
        message.success("Thêm thuộc tính thành công");
      }
      
      setModalVisible(false);
      form.resetFields();
      setAttributeValues(['']);
      fetchAttributes();
    } catch (error) {
      console.error("Error saving attribute:", error);
      message.error("Lỗi khi lưu thuộc tính");
    }
  };

  const handleAddValue = () => {
    setAttributeValues([...attributeValues, '']);
  };

  const handleRemoveValue = (index: number) => {
    if (attributeValues.length > 1) {
      const newValues = [...attributeValues];
      newValues.splice(index, 1);
      setAttributeValues(newValues);
    }
  };

  const handleValueChange = (index: number, value: string) => {
    const newValues = [...attributeValues];
    newValues[index] = value;
    setAttributeValues(newValues);
  };

  const checkDuplicateValues = (values: string[]) => {
    const lowerCaseValues = values.map(v => v.toLowerCase().trim()).filter(v => v !== '');
    const uniqueValues = [...new Set(lowerCaseValues)];
    return lowerCaseValues.length !== uniqueValues.length;
  };

  const handleAddValueToExisting = (attribute: Attribute) => {
    setSelectedAttributeForValue(attribute);
    newValueForm.resetFields();
    setAddValueModalVisible(true);
  };

  const handleSubmitNewValue = async (values: { value: string }) => {
    if (!selectedAttributeForValue) return;
    
    // Kiểm tra trùng lặp
    const existingValues = selectedAttributeForValue.values?.map(v => v.value.toLowerCase()) || [];
    if (existingValues.includes(values.value.toLowerCase())) {
      message.error(`Giá trị "${values.value}" đã tồn tại trong thuộc tính này!`);
      return;
    }
    
    try {
      await createAttributeValue({
        attribute_id: selectedAttributeForValue.id!,
        value: values.value
      });
      
      message.success(`Đã thêm giá trị "${values.value}" vào thuộc tính "${selectedAttributeForValue.name}"`);
      setAddValueModalVisible(false);
      newValueForm.resetFields();
      fetchAttributes();
    } catch (error) {
      console.error("Error adding value:", error);
      message.error("Lỗi khi thêm giá trị");
    }
  };

  const columns = [
    {
      title: "Tên thuộc tính",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Giá trị",
      dataIndex: "values",
      key: "values",
      render: (values: AttributeValue[]) => (
        <div>
          {values?.map(value => (
            <Tag 
              key={value.id} 
              closable
              onClose={() => handleDeleteValue(value.id!, value.value)}
              style={{ marginBottom: 4 }}
            >
              {value.value}
            </Tag>
          ))}
        </div>
      ),
    },
    {
      title: "Hành động",
      key: "action",
      render: (_: any, record: Attribute) => (
        <Space>
          <Button 
            icon={<AppstoreAddOutlined />} 
            onClick={() => handleAddValueToExisting(record)}
            type="dashed"
          >
            Thêm giá trị
          </Button>
          <Button 
            icon={<EditOutlined />} 
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button 
            icon={<DeleteOutlined />} 
            danger 
            onClick={() => handleDelete(record.id!, record.name)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<span style={{ color: "#1890ff", fontWeight: 700, fontSize: 22 }}>Quản lý Thuộc tính</span>}
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
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAdd}
          style={{ background: "linear-gradient(90deg,#1890ff 0%,#52c41a 100%)", border: "none" }}
        >
          Thêm thuộc tính
        </Button>
      }
    >
      <Table
        columns={columns}
        dataSource={attributes}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 10 }}
        style={{ borderRadius: 12, overflow: "hidden" }}
      />

      <Modal
        title={editingAttribute ? "Sửa thuộc tính" : "Thêm thuộc tính"}
        open={modalVisible}
        onCancel={() => {
          setModalVisible(false);
          form.resetFields();
          setAttributeValues(['']);
        }}
        onOk={() => form.submit()}
        okText={editingAttribute ? "Cập nhật" : "Thêm"}
        cancelText="Hủy"
      >
        <Form form={form} onFinish={handleSubmit} layout="vertical">
          <Form.Item
            name="name"
            label="Tên thuộc tính"
            rules={[{ required: true, message: 'Vui lòng nhập tên thuộc tính!' }]}
          >
            <Input placeholder="Nhập tên thuộc tính" />
          </Form.Item>
          
          <Form.Item label="Giá trị thuộc tính" required>
            {attributeValues.map((value, index) => (
              <div key={index} style={{ display: 'flex', marginBottom: 8 }}>
                <Input
                  placeholder="Nhập giá trị thuộc tính"
                  value={value}
                  onChange={(e) => handleValueChange(index, e.target.value)}
                  style={{ marginRight: 8 }}
                />
                {attributeValues.length > 1 && (
                  <Button
                    icon={<MinusCircleOutlined />}
                    onClick={() => handleRemoveValue(index)}
                  />
                )}
              </div>
            ))}
            <Button
              type="dashed"
              onClick={handleAddValue}
              icon={<PlusCircleOutlined />}
              style={{ width: '100%' }}
            >
              Thêm giá trị
            </Button>
          </Form.Item>
        </Form>
      </Modal>

      {/* Modal thêm giá trị mới vào thuộc tính có sẵn */}
      <Modal
        title={`Thêm giá trị mới cho "${selectedAttributeForValue?.name}"`}
        open={addValueModalVisible}
        onCancel={() => {
          setAddValueModalVisible(false);
          newValueForm.resetFields();
        }}
        onOk={() => newValueForm.submit()}
        okText="Thêm giá trị"
        cancelText="Hủy"
      >
        <Form form={newValueForm} onFinish={handleSubmitNewValue} layout="vertical">
          <Form.Item
            name="value"
            label="Giá trị mới"
            rules={[{ required: true, message: 'Vui lòng nhập giá trị!' }]}
          >
            <Input placeholder="Nhập giá trị mới" />
          </Form.Item>
          
          {selectedAttributeForValue && (
            <div style={{ marginBottom: 16 }}>
              <p><strong>Giá trị hiện có:</strong></p>
              <div>
                {selectedAttributeForValue.values?.map(value => (
                  <Tag key={value.id} style={{ marginBottom: 4 }}>
                    {value.value}
                  </Tag>
                ))}
              </div>
            </div>
          )}
        </Form>
      </Modal>
    </Card>
  );
}