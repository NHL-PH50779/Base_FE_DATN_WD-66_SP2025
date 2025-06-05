import React, { useState } from "react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState<string | null>(null);

  // Xử lý thay đổi dữ liệu trong biểu mẫu
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // Xử lý gửi biểu mẫu
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage(null);

    try {
      // Giả lập gửi dữ liệu (thay bằng API thực tế nếu cần)
      await new Promise((resolve) => setTimeout(resolve, 1000)); // Giả lập delay 1 giây
      console.log("Form submitted:", formData);
      setSubmitMessage("Cảm ơn bạn! Chúng tôi sẽ liên hệ sớm nhất.");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (error) {
      setSubmitMessage("Có lỗi xảy ra. Vui lòng thử lại sau.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">LIÊN HỆ VỚI CHÚNG TÔI</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Thông tin liên hệ */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">THÔNG TIN LIÊN HỆ</h2>
          <p className="text-gray-600 mb-2">
            <strong>Email:</strong> support@techstore.com
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Số điện thoại:</strong> 0123 456 789
          </p>
          <p className="text-gray-600 mb-2">
            <strong>Địa chỉ:</strong> 123 Đường Công Nghệ, TP. Hồ Chí Minh, Việt Nam
          </p>
          <p className="text-gray-600">
            <strong>Giờ làm việc:</strong> 8:00 - 20:00 (Thứ 2 - Chủ nhật)
          </p>
        </div>

        {/* Biểu mẫu liên hệ */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">GỬI TIN NHẮN CHO CHÚNG TÔI</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Họ và tên
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                Chủ đề
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                Tin nhắn
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                required
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white p-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              {isSubmitting ? "Đang gửi..." : "Gửi tin nhắn"}
            </button>
            {submitMessage && (
              <p className="mt-2 text-center text-sm text-green-600">{submitMessage}</p>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Contact;