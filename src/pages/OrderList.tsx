import { useEffect, useState } from "react";
import { Table, Button, Select, Space, Tag } from "antd";
import type { Order } from "../types/order.type";
import { orderApi } from "../api/order.api";

const statusColors = {
  pending: "orange",
  processing: "blue",
  completed: "green",
  cancelled: "red",
};

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchData = async () => {
    const data = await orderApi.getAll();
    setOrders(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id: number, status: Order["status"]) => {
    await orderApi.update(id, { status });
    fetchData();
  };

  const handleDelete = async (id: number) => {
    await orderApi.delete(id);
    fetchData();
  };

  return (
    <div>
      <h1>Quản lý Đơn hàng</h1>
      <Table dataSource={orders} rowKey="id" pagination={{ pageSize: 5 }}>
        <Table.Column title="Tên khách hàng" dataIndex="customerName" />
        <Table.Column title="SĐT" dataIndex="phone" />
        <Table.Column title="Địa chỉ" dataIndex="address" />
        <Table.Column title="Tổng tiền" dataIndex="total" render={(total: number) => total.toLocaleString() + "₫"} />
        <Table.Column
          title="Trạng thái"
          dataIndex="status"
          render={(status: Order["status"], record: Order) => (
            <Select value={status} onChange={(value) => handleStatusChange(record.id, value)} style={{ width: 150 }}>
              <Select.Option value="pending">Chờ xử lý</Select.Option>
              <Select.Option value="processing">Đang xử lý</Select.Option>
              <Select.Option value="completed">Hoàn thành</Select.Option>
              <Select.Option value="cancelled">Đã hủy</Select.Option>
            </Select>
          )}
        />
        <Table.Column title="Ngày tạo" dataIndex="createdAt" />
        <Table.Column
          title="Hành động"
          render={(_, record: Order) => (
            <Space>
              <Button danger onClick={() => handleDelete(record.id)}>
                Xóa
              </Button>
            </Space>
          )}
        />
      </Table>
    </div>
  );
}
