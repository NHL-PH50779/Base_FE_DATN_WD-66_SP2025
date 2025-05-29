import React, { useEffect, useState } from "react";
import { Table, Tag } from "antd";

interface User {
  id: number;
  name: string;
  email: string;
  role: "admin" | "user";
  createdAt: string;
}

const mockUsers: User[] = [
  {
    id: 1,
    name: "Nguyễn Văn A",
    email: "a@example.com",
    role: "admin",
    createdAt: "2024-11-10",
  },
  {
    id: 2,
    name: "Trần Thị B",
    email: "b@example.com",
    role: "user",
    createdAt: "2025-01-05",
  },
];

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    // Simulate API
    setUsers(mockUsers);
  }, []);

  const columns = [
    { title: "ID", dataIndex: "id", key: "id" },
    { title: "Họ tên", dataIndex: "name", key: "name" },
    { title: "Email", dataIndex: "email", key: "email" },
    {
      title: "Quyền",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <Tag color={role === "admin" ? "volcano" : "blue"}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    { title: "Ngày tạo", dataIndex: "createdAt", key: "createdAt" },
  ];

  return (
    <div>
      <h2>Danh sách người dùng</h2>
      <Table dataSource={users} columns={columns} rowKey="id" />
    </div>
  );
};

export default UserList;
