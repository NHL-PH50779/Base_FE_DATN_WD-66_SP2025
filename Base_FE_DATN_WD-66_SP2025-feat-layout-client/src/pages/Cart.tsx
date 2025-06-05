import React, { useState } from "react";

// Giả lập dữ liệu giỏ hàng
const cartData = [
  { id: 1, variant: { name: "Laptop Dell XPS 13 9310", price: 29990000, image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/323920/hp-15-fd0234tu-i5-9q969pa-170225-105831-192-600x600.jpg" }, quantity: 1 },
];

const Cart: React.FC = () => {
  const [cartItems, setCartItems] = useState(cartData);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setCartItems(cartItems.map(item => item.id === id ? { ...item, quantity: newQuantity } : item));
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id));
  };

  const total = cartItems.reduce((sum, item) => sum + item.variant.price * item.quantity, 0);

  const handleCheckout = () => {
    console.log("Tiến hành thanh toán:", cartItems);
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">GIỎ HÀNG</h1>
      {cartItems.length === 0 ? (
        <p className="text-gray-600">Giỏ hàng của bạn đang trống.</p>
      ) : (
        <>
          <div className="space-y-4">
            {cartItems.map(item => (
              <div key={item.id} className="flex items-center border-b py-4">
                <img src={item.variant.image} alt={item.variant.name} className="w-24 h-24 object-cover rounded mr-4" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800">{item.variant.name}</h3>
                  <p className="text-gray-600">{item.variant.price.toLocaleString()}đ</p>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="border p-1 rounded hover:bg-gray-100"
                  >
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="border p-1 rounded hover:bg-gray-100"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => removeItem(item.id)}
                  className="ml-4 text-red-500 hover:text-red-700"
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
          <div className="mt-8 flex justify-end">
            <div className="text-right">
              <p className="text-xl font-semibold text-gray-800 mb-4">Tổng cộng: {total.toLocaleString()}đ</p>
              <button
                onClick={handleCheckout}
                className="bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 transition-colors"
              >
                Thanh toán
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;