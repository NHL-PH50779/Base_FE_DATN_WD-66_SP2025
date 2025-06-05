import React, { useState } from "react";

// Giả lập dữ liệu laptop
const laptopData = [
  {
    id: 1,
    name: "Laptop Dell XPS 13 9310",
    price: 34990000,
    discountPrice: 29990000,
    discount: 14,
    image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/323920/hp-15-fd0234tu-i5-9q969pa-170225-105831-192-600x600.jpg",
    brand: "Dell",
    ram: "16GB",
    cpu: "Intel i7",
    color: "Bạc",
    stock: 16,
  },
  {
    id: 2,
    name: "Laptop MacBook Pro 14 M1 Pro",
    price: 52990000,
    discountPrice: 49990000,
    discount: 6,
    image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/323920/hp-15-fd0234tu-i5-9q969pa-170225-105831-192-600x600.jpg",
    brand: "Apple",
    ram: "16GB",
    cpu: "M1 Pro",
    color: "Xám",
    stock: 8,
  },
  {
    id: 3,
    name: "Laptop ASUS ROG Zephyrus G14",
    price: 39990000,
    discountPrice: 34990000,
    discount: 13,
    image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/323920/hp-15-fd0234tu-i5-9q969pa-170225-105831-192-600x600.jpg",
    brand: "ASUS",
    ram: "32GB",
    cpu: "AMD Ryzen 9",
    color: "Đen",
    stock: 2,
  },
  {
    id: 4,
    name: "Laptop Lenovo ThinkPad X1 Carbon Gen 9",
    price: 45990000,
    discountPrice: 42990000,
    discount: 7,
    image: "https://cdnv2.tgdd.vn/mwg-static/tgdd/Products/Images/44/323920/hp-15-fd0234tu-i5-9q969pa-170225-105831-192-600x600.jpg",
    brand: "Lenovo",
    ram: "16GB",
    cpu: "Intel i5",
    color: "Đen",
    stock: 4,
  },
];

// Component Shop
const Shop: React.FC = () => {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 60000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedRams, setSelectedRams] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);

  // Hàm xử lý khi thay đổi khoảng giá
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name === "min") {
      setPriceRange([Number(value), priceRange[1]]);
    } else {
      setPriceRange([priceRange[0], Number(value)]);
    }
  };

  // Hàm xử lý chọn lọc
  const handleBrandChange = (brand: string) => {
    setSelectedBrands((prev) =>
      prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
    );
  };

  const handleRamChange = (ram: string) => {
    setSelectedRams((prev) =>
      prev.includes(ram) ? prev.filter((r) => r !== ram) : [...prev, ram]
    );
  };

  const handleColorChange = (color: string) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  // Lọc sản phẩm dựa trên bộ lọc
  const filteredLaptops = laptopData.filter((laptop) => {
    const inPriceRange =
      laptop.discountPrice >= priceRange[0] && laptop.discountPrice <= priceRange[1];
    const inBrand =
      selectedBrands.length === 0 || selectedBrands.includes(laptop.brand);
    const inRam = selectedRams.length === 0 || selectedRams.includes(laptop.ram);
    const inColor =
      selectedColors.length === 0 || selectedColors.includes(laptop.color);

    return inPriceRange && inBrand && inRam && inColor;
  });

  return (
    <div className="max-w-7xl mx-auto py-8 flex">
      {/* Bộ lọc bên trái */}
      <div className="w-1/4 pr-8">
        <h2 className="text-2xl font-bold mb-4">BỘ LỌC</h2>

        {/* Danh mục sản phẩm */}
        <div className="mb-4">
          <h3 className="font-semibold">DANH MỤC SẢN PHẨM</h3>
          <p className="text-gray-600">Laptop</p>
        </div>

        {/* Danh mục phụ */}
        <div className="mb-4">
          <h3 className="font-semibold">Sản phẩm mới</h3>
          <div className="flex space-x-2">
            <a href="#" className="text-blue-500 hover:underline">
              Sản phẩm mới
            </a>
            <a href="#" className="text-blue-500 hover:underline">
              Sản phẩm nổi bật
            </a>
          </div>
        </div>

        {/* Khoảng giá */}
        <div className="mb-4">
          <h3 className="font-semibold">KHOẢNG GIÁ</h3>
          <div className="flex items-center justify-between space-x-2">
            <input
              type="number"
              name="min"
              min="0"
              max="60000000"
              value={priceRange[0]}
              onChange={handlePriceChange}
              className="w-1/2 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span>-</span>
            <input
              type="number"
              name="max"
              min="0"
              max="60000000"
              value={priceRange[1]}
              onChange={handlePriceChange}
              className="w-1/2 p-1 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="text-sm text-gray-600 mt-1">
            {priceRange[0].toLocaleString()}đ - {priceRange[1].toLocaleString()}đ
          </div>
        </div>

        {/* Hãng */}
        <div className="mb-4">
          <h3 className="font-semibold">HÃNG</h3>
          <div>
            {["Dell", "Apple", "ASUS", "Lenovo"].map((brand) => (
              <label key={brand} className="block mb-1">
                <input
                  type="checkbox"
                  checked={selectedBrands.includes(brand)}
                  onChange={() => handleBrandChange(brand)}
                  className="mr-2"
                />
                <span className="text-gray-700">{brand}</span>
              </label>
            ))}
          </div>
        </div>

        {/* RAM */}
        <div className="mb-4">
          <h3 className="font-semibold">RAM</h3>
          <div>
            {["16GB", "32GB"].map((ram) => (
              <label key={ram} className="block mb-1">
                <input
                  type="checkbox"
                  checked={selectedRams.includes(ram)}
                  onChange={() => handleRamChange(ram)}
                  className="mr-2"
                />
                <span className="text-gray-700">{ram}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Màu sắc */}
        <div className="mb-4">
          <h3 className="font-semibold">MÀU SẮC</h3>
          <div>
            {["Bạc", "Xám", "Đen"].map((color) => (
              <label key={color} className="block mb-1">
                <input
                  type="checkbox"
                  checked={selectedColors.includes(color)}
                  onChange={() => handleColorChange(color)}
                  className="mr-2"
                />
                <span className="text-gray-700">{color}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Kích thước màn hình */}
        <div className="mb-4">
          <h3 className="font-semibold">KÍCH THƯỚC MÀN HÌNH</h3>
          <div className="flex space-x-2">
            <button className="border p-1 rounded hover:bg-gray-100">13"</button>
            <button className="border p-1 rounded hover:bg-gray-100">14"</button>
            <button className="border p-1 rounded hover:bg-gray-100">15"</button>
          </div>
        </div>
      </div>

      {/* Danh sách sản phẩm bên phải */}
      <div className="w-3/4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">
            SẢN PHẨM KHUYẾN MÃI {filteredLaptops.length} SẢN PHẨM
          </h2>
          <div className="flex space-x-2">
            <select className="border p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Sắp xếp theo</option>
              <option>Sản phẩm nổi bật</option>
            </select>
            <select className="border p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option>Sản phẩm mới</option>
              <option>Sản phẩm nổi bật</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {filteredLaptops.map((laptop) => (
            <div key={laptop.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
              <div className="relative">
                <img
                  src={laptop.image}
                  alt={laptop.name}
                  className="w-full h-48 object-cover"
                />
                <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded">
                  -{laptop.discount}%
                </span>
                {laptop.stock > 0 && (
                  <span className="absolute top-2 right-2 bg-blue-500 text-white text-xs px-2 py-1 rounded">
                    {laptop.stock} SP
                  </span>
                )}
              </div>
              <div className="p-2">
                <h3 className="text-sm font-semibold line-clamp-2">{laptop.name}</h3>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-red-500 font-bold">
                    {laptop.discountPrice.toLocaleString()}đ
                  </span>
                  <span className="text-gray-500 line-through text-sm">
                    {laptop.price.toLocaleString()}đ
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Shop;