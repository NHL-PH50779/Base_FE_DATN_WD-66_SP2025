import { useEffect, useState } from "react";
import { Table, Button, Select, Space, Tag, Input, Modal, DatePicker, message, Card } from "antd";
import type { Order } from "../types/order.type";
import { orderApi } from "../api/order.api";
import dayjs, { Dayjs } from "dayjs";

const statusOptions = [
  { value: "pending", label: "Chờ xử lý", color: "orange" },
  { value: "processing", label: "Đã xác nhận", color: "blue" },
  { value: "shipping", label: "Đang giao hàng", color: "purple" },
  { value: "completed", label: "Hoàn thành", color: "green" },
  { value: "cancelled", label: "Đã hủy", color: "red" },
];

const paymentOptions = [
  { value: "cod", label: "COD" },
  { value: "bank", label: "Chuyển khoản" },
  { value: "online", label: "Online" },
];

type PaymentMethod = "cod" | "bank" | "online";

type DateRange = [Dayjs, Dayjs] | null;

export default function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filtered, setFiltered] = useState<Order[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Order["status"] | undefined>();
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | undefined>();
  const [dateRange, setDateRange] = useState<DateRange>(null);
  const [detailOrder, setDetailOrder] = useState<Order | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  // Giả lập phương thức thanh toán cho demo
  const getPaymentMethod = (id: number): PaymentMethod => {
    if (id % 3 === 0) return "online";
    if (id % 3 === 1) return "cod";
    return "bank";
  };

  const fetchData = async () => {
    const data = await orderApi.getAll();
    setOrders(data);
    setFiltered(data);
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let data = [...orders];
    if (search) {
      data = data.filter(
        (o) =>
          o.id.toString().includes(search) ||
          o.customerName.toLowerCase().includes(search.toLowerCase()) ||
          o.phone.includes(search)
      );
    }
    if (statusFilter) {
      data = data.filter((o) => o.status === statusFilter);
    }
    if (paymentFilter) {
      data = data.filter((o) => getPaymentMethod(o.id) === paymentFilter);
    }
    if (dateRange && dateRange.length === 2) {
      data = data.filter((o) => {
        const d = dayjs(o.createdAt);
        return d.isAfter(dateRange[0].startOf("day")) && d.isBefore(dateRange[1].endOf("day"));
      });
    }
    setFiltered(data);
  }, [orders, search, statusFilter, paymentFilter, dateRange]);

  const handleStatusChange = async (id: number, status: Order["status"]) => {
    Modal.confirm({
      title: "Xác nhận cập nhật trạng thái?",
      onOk: async () => {
        await orderApi.update(id, { status });
        message.success("Cập nhật trạng thái thành công");
        fetchData();
      },
    });
  };

  const handleDelete = async (id: number, status: Order["status"]) => {
    if (status !== "pending") {
      message.warning("Chỉ có thể xóa đơn hàng chờ xử lý!");
      return;
    }
    Modal.confirm({
      title: "Bạn chắc chắn muốn xóa đơn hàng này?",
      onOk: async () => {
        await orderApi.delete(id);
        message.success("Đã xóa đơn hàng");
        fetchData();
      },
    });
  };

  const columns = [
    { title: "Mã đơn", dataIndex: "id", key: "id" },
    { title: "Tên khách hàng", dataIndex: "customerName", key: "customerName" },
    { title: "SĐT", dataIndex: "phone", key: "phone" },
    { title: "Tổng tiền", dataIndex: "total", key: "total", render: (total: number) => total.toLocaleString() + "₫" },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: Order["status"], record: Order) => (
        <Select
          value={status}
          onChange={(value) => handleStatusChange(record.id, value as Order["status"])}
          style={{ width: 150 }}
        >
          {statusOptions.map((opt) => (
            <Select.Option value={opt.value} key={opt.value}>
              <Tag color={opt.color}>{opt.label}</Tag>
            </Select.Option>
          ))}
        </Select>
      ),
    },
    {
      title: "Phương thức thanh toán",
      dataIndex: "paymentMethod",
      key: "paymentMethod",
      render: (_: unknown, record: Order) => {
        const method = getPaymentMethod(record.id);
        return paymentOptions.find((p) => p.value === method)?.label;
      },
    },
    { title: "Ngày đặt", dataIndex: "createdAt", key: "createdAt" },
    {
      title: "Hành động",
      key: "action",
      render: (_: unknown, record: Order) => (
        <Space>
          <Button onClick={() => { setDetailOrder(record); setDetailOpen(true); }}>Chi tiết</Button>
          <Button danger onClick={() => handleDelete(record.id, record.status)} disabled={record.status !== "pending"}>
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={<span style={{ color: "#1890ff", fontWeight: 700, fontSize: 22 }}>Quản lý Đơn hàng</span>}
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
      <Space style={{ marginBottom: 16 }}>
        <Input.Search
          placeholder="Tìm kiếm theo mã đơn, tên khách, SĐT"
          allowClear
          onSearch={setSearch}
          style={{ borderRadius: 8, borderColor: "#1890ff" }}
        />
        <Select
          placeholder="Lọc trạng thái"
          allowClear
          style={{ width: 150, borderRadius: 8 }}
          onChange={setStatusFilter}
        >
          {statusOptions.map((opt) => (
            <Select.Option value={opt.value} key={opt.value}>{opt.label}</Select.Option>
          ))}
        </Select>
        <Select
          placeholder="Lọc thanh toán"
          allowClear
          style={{ width: 150, borderRadius: 8 }}
          onChange={setPaymentFilter}
        >
          {paymentOptions.map((opt) => (
            <Select.Option value={opt.value} key={opt.value}>{opt.label}</Select.Option>
          ))}
        </Select>
        <DatePicker.RangePicker
          format="YYYY-MM-DD"
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) setDateRange([dates[0], dates[1]]);
            else setDateRange(null);
          }}
          style={{ width: 250, borderRadius: 8 }}
        />
      </Space>
      <Table dataSource={filtered} rowKey="id" columns={columns} pagination={{ pageSize: 5 }} style={{ borderRadius: 12, overflow: "hidden" }} />
      <Modal
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        footer={<Button onClick={() => setDetailOpen(false)}>Đóng</Button>}
        title={detailOrder ? `Chi tiết đơn hàng #${detailOrder.id}` : ""}
        bodyStyle={{ background: "#f0f5ff", borderRadius: 12 }}
      >
        {detailOrder && (
          <div>
            <p><b>Khách hàng:</b> {detailOrder.customerName}</p>
            <p><b>Email:</b> {detailOrder.email}</p>
            <p><b>SĐT:</b> {detailOrder.phone}</p>
            <p><b>Địa chỉ:</b> {detailOrder.address}</p>
            <p><b>Ngày đặt:</b> {detailOrder.createdAt}</p>
            <p><b>Trạng thái:</b> {statusOptions.find(s => s.value === detailOrder.status)?.label}</p>
            <p><b>Phương thức thanh toán:</b> {paymentOptions.find(p => p.value === detailOrder.paymentMethod)?.label}</p>
            <p><b>Tổng tiền:</b> {detailOrder.total.toLocaleString()}₫</p>
            {detailOrder.note && <p><b>Ghi chú:</b> {detailOrder.note}</p>}
            <div style={{ marginTop: 16 }}>
              <b>Danh sách sản phẩm:</b>
              <Table
                dataSource={detailOrder.products}
                rowKey="id"
                pagination={false}
                style={{ marginTop: 8 }}
                columns={[
                  {
                    title: "Ảnh",
                    dataIndex: "image",
                    render: (url: string) => url ? <img src={url} alt="sp" style={{ width: 50, borderRadius: 8 }} /> : null,
                  },
                  { title: "Tên sản phẩm", dataIndex: "name" },
                  { title: "Số lượng", dataIndex: "quantity" },
                  { title: "Đơn giá", dataIndex: "price", render: (v: number) => v.toLocaleString() + "₫" },
                  { title: "Thành tiền", render: (_: unknown, r: { price: number; quantity: number }) => (r.price * r.quantity).toLocaleString() + "₫" },
                ]}
              />
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
}
