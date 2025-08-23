import React, { useState, useEffect } from 'react';
import { Card, List, Input, Button, Avatar, Badge, message, Typography, Space, Tag } from 'antd';
import { MessageOutlined, UserOutlined, RobotOutlined, SendOutlined } from '@ant-design/icons';
import { axiosInstance } from '../utils/axios.util';

const { Text } = Typography;
const { TextArea } = Input;

interface Chat {
  id: number;
  user: { id: number; name: string };
  admin?: { id: number; name: string };
  messages_count: number;
  updated_at: string;
}

interface Message {
  id: number;
  sender_id: number;
  message: string;
  created_at: string;
  sender: { id: number; name: string };
}

const ChatManagement = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);

  const fetchChats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get('/admin/chats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setChats(response.data.data || []);
    } catch (error) {
      console.error('Lỗi khi tải danh sách chat:', error);
      message.error('Lỗi khi tải danh sách chat');
    }
  };

  const claimChat = async (chat: Chat) => {
    try {
      const token = localStorage.getItem('token');
      await axiosInstance.post(`/admin/chats/${chat.id}/claim`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      message.success('Đã nhận chat');
      fetchChats();
      setSelectedChat({ ...chat, admin: { id: 1, name: 'Admin' } });
    } catch (error) {
      message.error('Lỗi khi nhận chat');
    }
  };

  const fetchMessages = async (chatId: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axiosInstance.get(`/admin/chats/${chatId}/messages`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setMessages(response.data.data || []);
      
      // Mark as read
      await axiosInstance.post(`/admin/chats/${chatId}/read`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
    } catch (error) {
      message.error('Lỗi khi tải tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;
    
    try {
      setSending(true);
      const token = localStorage.getItem('token');
      await axiosInstance.post(`/admin/chats/${selectedChat.id}/send`, {
        message: newMessage
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      
      setNewMessage('');
      fetchMessages(selectedChat.id);
    } catch (error) {
      message.error('Lỗi khi gửi tin nhắn');
    } finally {
      setSending(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  useEffect(() => {
    if (selectedChat) {
      fetchMessages(selectedChat.id);
      
      // Polling for new messages
      const interval = setInterval(() => {
        fetchMessages(selectedChat.id);
      }, 3000);
      
      return () => clearInterval(interval);
    }
  }, [selectedChat]);

  return (
    <div style={{ display: 'flex', height: '70vh', gap: 16 }}>
      {/* Chat List */}
      <Card title="Danh sách Chat" style={{ width: 350 }}>
        <List
          dataSource={chats}
          renderItem={(chat) => (
            <List.Item
              onClick={() => setSelectedChat(chat)}
              style={{ 
                cursor: 'pointer',
                backgroundColor: selectedChat?.id === chat.id ? '#f0f0f0' : 'transparent'
              }}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={
                  <Space>
                    {chat.user.name}
                    {!chat.admin && <Tag color="orange">Chưa nhận</Tag>}
                    <Badge count={chat.messages_count} size="small" />
                  </Space>
                }
                description={`Cập nhật: ${new Date(chat.updated_at).toLocaleString('vi-VN')}`}
              />
              {!chat.admin && (
                <Button 
                  size="small" 
                  type="primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    claimChat(chat);
                  }}
                >
                  Nhận
                </Button>
              )}
            </List.Item>
          )}
        />
      </Card>

      {/* Chat Messages */}
      <Card 
        title={selectedChat ? `Chat với ${selectedChat.user.name}` : 'Chọn một cuộc trò chuyện'}
        style={{ flex: 1 }}
      >
        {selectedChat ? (
          <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
            {/* Messages */}
            <div style={{ flex: 1, overflowY: 'auto', marginBottom: 16, maxHeight: 400 }}>
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    display: 'flex',
                    justifyContent: msg.sender_id !== selectedChat.user.id ? 'flex-end' : 'flex-start',
                    marginBottom: 8
                  }}
                >
                  <div
                    style={{
                      maxWidth: '70%',
                      padding: '8px 12px',
                      borderRadius: 8,
                      backgroundColor: msg.sender_id !== selectedChat.user.id ? '#1890ff' : '#f0f0f0',
                      color: msg.sender_id !== selectedChat.user.id ? '#fff' : '#000'
                    }}
                  >
                    <div>{msg.message}</div>
                    <div style={{ fontSize: 10, opacity: 0.7, marginTop: 4 }}>
                      {new Date(msg.created_at).toLocaleTimeString('vi-VN')}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Send Message */}
            {selectedChat.admin && (
              <div style={{ display: 'flex', gap: 8 }}>
                <TextArea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Nhập tin nhắn..."
                  autoSize={{ minRows: 1, maxRows: 3 }}
                  onPressEnter={(e) => {
                    if (!e.shiftKey) {
                      e.preventDefault();
                      sendMessage();
                    }
                  }}
                />
                <Button
                  type="primary"
                  icon={<SendOutlined />}
                  loading={sending}
                  onClick={sendMessage}
                >
                  Gửi
                </Button>
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', color: '#999', marginTop: 100 }}>
            <MessageOutlined style={{ fontSize: 48, marginBottom: 16 }} />
            <div>Chọn một cuộc trò chuyện để bắt đầu</div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatManagement;