import { Table, Image } from "antd";
import type { Laptop } from "../types/laptop.type";
import { mockLaptops } from "../constants/mockLaptops";
import type { ColumnsType } from "antd/es/table";


const columns: ColumnsType<Laptop> = [
  {
    title: "ID",
    dataIndex: "id",
    key: "id",
  },
  {
    title: "Tên sản phẩm",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "Hãng",
    dataIndex: "brand",
    key: "brand",
  },
  {
    title: "Giá",
    dataIndex: "price",
    key: "price",
    render: (price: number) => `${price.toLocaleString()} VND`,
  },
  {
    title: "Tồn kho",
    dataIndex: "stock",
    key: "stock",
  },
  {
    title: "Danh mục",
    dataIndex: "category",
    key: "category",
  },
  {
    title: "Ảnh",
    dataIndex: "image_url",
    key: "image_url",
    render: (url: string) => <Image width={80} src={url} alt="Laptop Image" />,
  },
];

export default function LaptopList() {
  console.log("Render LaptopList"); // <-- thêm dòng này để test
  return (
    <div>
      <h2>Danh sách Laptop (Fake Data)</h2>
      <Table<Laptop>
        dataSource={mockLaptops}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
