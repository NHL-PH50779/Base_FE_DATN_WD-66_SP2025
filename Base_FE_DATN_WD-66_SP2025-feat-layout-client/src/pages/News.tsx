import React from "react";
import { Link } from "react-router-dom";

// Giả lập dữ liệu tin tức
const newsData = [
  { id: 1, title: "Khuyến mãi lớn tháng 6!", content: "Giảm giá lên đến 50% cho tất cả laptop.", thumbnail: "https://via.placeholder.com/300x200.png?text=News", created_at: "2025-06-05" },
];

const News: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">TIN TỨC</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {newsData.map(news => (
          <div key={news.id} className="border rounded-lg shadow-sm">
            <img src={news.thumbnail} alt={news.title} className="w-full h-48 object-cover rounded-t-lg" />
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">{news.title}</h3>
              <p className="text-gray-600 mb-2">{news.content.substring(0, 100)}...</p>
              <p className="text-sm text-gray-500 mb-2">{news.created_at}</p>
              <Link to={`/news/${news.id}`} className="text-blue-500 hover:underline">
                Đọc thêm
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default News;