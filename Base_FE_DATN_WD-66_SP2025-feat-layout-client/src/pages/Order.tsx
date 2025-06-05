import React from "react";

// Giả lập dữ liệu đơn hàng
const ordersData = [
  { id: 1, total: 29990000, status: "Đang xử lý", payment_status: "Đã thanh toán", created_at: "2025-06-05", items: [{ name: "Laptop Dell XPS 13 9310", quantity: 1, price: 29990000 }] },
];

const Orders: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">LỊCH SỬ ĐƠN HÀNG</h1>
      {ordersData.length === 0 ? (
        <p className="text-gray-600">Bạn chưa có đơn hàng nào.</p>
      ) : (
        <div className="space-y-4">
          {ordersData.map(order => (
            <div key={order.id} className="border rounded-lg p-4 shadow-sm">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-gray-800">Đơn hàng #{order.id}</h3>
                <span className={`text-sm ${order.status === "Đang xử lý" ? "text-yellow-500" : "text-green-500"}`}>{order.status}</span>
              </div>
              <p className="text-gray-600 mb-1">Ngày đặt: {order.created_at}</p>
              <p className="text-gray-600 mb-1">Thanh toán: {order.payment_status}</p>
              <p className="text-gray-600 mb-2">Tổng cộng: {order.total.toLocaleString()}đ</p>
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700">Sản phẩm:</h4>
                {order.items.map((item, index) => (
                  <p key={index} className="text-gray-600">
                    {item.name} x {item.quantity} - {item.price.toLocaleString()}đ
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Orders;