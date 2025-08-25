import React, { useState, useEffect, useRef } from 'react';
import { Card, List, Avatar, Input, Button, Badge, Typography, Space, Divider, message } from 'antd';
import { SendOutlined, UserOutlined, MessageOutlined } from '@ant-design/icons';
import { axiosInstance } from '../utils/axios.util';
import { ChatListSkeleton, MessageSkeleton } from '../components/LoadingSkeleton';
// import Pusher from 'pusher-js';

const { Title, Text } = Typography;
const { TextArea } = Input;

interface Chat {
  id: number;
  user: { id: number; name: string; email: string };
  admin: { id: number; name: string } | null;
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

const ChatAdmin: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    fetchChats();
    
    // Only start polling if not already started
    if (!intervalRef.current) {
      startPolling();
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  const startPolling = () => {
    // Poll for new messages every 10 seconds (reduced frequency)
    intervalRef.current = setInterval(() => {
      if (selectedChat) {
        fetchMessages(selectedChat.id);
      }
      fetchChats();
    }, 10000);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchChats = async () => {
    try {
      const response = await axiosInstance.get('/admin/chats');
      const newChats = response.data.data || [];
      
      // Only update if data actually changed
      setChats(prevChats => {
        if (JSON.stringify(prevChats) !== JSON.stringify(newChats)) {
          return newChats;
        }
        return prevChats;
      });
    } catch (error) {
      console.error('Error fetching chats:', error);
    } finally {
      setChatsLoading(false);
    }
  };

  const fetchMessages = async (chatId: number) => {
    try {
      const response = await axiosInstance.get(`/admin/chats/${chatId}/messages`);
      const newMessages = response.data.data || [];
      
      // Only update if messages changed
      setMessages(prevMessages => {
        if (JSON.stringify(prevMessages) !== JSON.stringify(newMessages)) {
          setTimeout(scrollToBottom, 100);
          return newMessages;
        }
        return prevMessages;
      });
    } catch (error) {
      console.error('Error fetching messages:', error);
    } finally {
      setMessagesLoading(false);
    }
  };

  const claimChat = async (chat: Chat) => {
    try {
      await axiosInstance.post(`/admin/chats/${chat.id}/claim`);
      setSelectedChat(chat);
      fetchMessages(chat.id);
      fetchChats();
    } catch (error) {
      message.error('Không thể nhận chat này');
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedChat) return;

    setLoading(true);
    try {
      const response = await axiosInstance.post(`/admin/chats/${selectedChat.id}/send`, {
        message: newMessage
      });
      
      // Add message immediately for better UX
      setMessages(prev => [...prev, response.data.data]);
      setNewMessage('');
      scrollToBottom();
      
      // Don't fetch chats immediately to avoid reload
      setTimeout(() => {
        fetchChats();
      }, 1000);
    } catch (error) {
      message.error('Không thể gửi tin nhắn');
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('vi-VN', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCurrentUserId = () => {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return user.id;
  };

  return (
    <div style={{ height: '80vh', display: 'flex', gap: 16 }}>
      {/* Chat List */}
      <Card 
        title={<><MessageOutlined /> Danh sách chat</>}
        style={{ width: 350, height: '100%' }}
        bodyStyle={{ padding: 0, height: 'calc(100% - 57px)', overflow: 'auto' }}
      >
        {chatsLoading ? (
          <ChatListSkeleton />
        ) : (
          <List
            dataSource={chats}
            renderItem={(chat) => (
            <List.Item
              onClick={() => claimChat(chat)}
              style={{
                cursor: 'pointer',
                backgroundColor: selectedChat?.id === chat.id ? '#f0f0f0' : 'transparent',
                padding: '12px 16px'
              }}
            >
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} />}
                title={
                  <Space>
                    <Text strong>{chat.user.name}</Text>
                    {chat.messages_count > 0 && (
                      <Badge count={chat.messages_count} size="small" />
                    )}
                  </Space>
                }
                description={
                  <div>
                    <Text type="secondary">{chat.user.email}</Text>
                    <br />
                    <Text type="secondary" style={{ fontSize: 12 }}>
                      {formatTime(chat.updated_at)}
                    </Text>
                    {chat.admin && (
                      <div>
                        <Text style={{ fontSize: 12, color: '#52c41a' }}>
                          Admin: {chat.admin.name}
                        </Text>
                      </div>
                    )}
                  </div>
                }
              />
            </List.Item>
            )}
          />
        )}
      </Card>

      {/* Chat Messages */}
      <Card
        title={
          selectedChat ? (
            <Space>
              <Avatar icon={<UserOutlined />} />
              <div>
                <Text strong>{selectedChat.user.name}</Text>
                <br />
                <Text type="secondary" style={{ fontSize: 12 }}>
                  {selectedChat.user.email}
                </Text>
              </div>
            </Space>
          ) : (
            'Chọn một cuộc trò chuyện'
          )
        }
        style={{ flex: 1, height: '100%' }}
        bodyStyle={{ 
          padding: 0, 
          height: 'calc(100% - 57px)', 
          display: 'flex', 
          flexDirection: 'column' 
        }}
      >
        {selectedChat ? (
          <>
            {/* Messages Area */}
            <div
              style={{
                flex: 1,
                padding: 16,
                overflowY: 'auto',
                backgroundColor: '#fafafa'
              }}
            >
              {messagesLoading ? (
                <MessageSkeleton />
              ) : (
                messages.map((msg) => {
                const isCurrentUser = msg.sender_id === getCurrentUserId();
                return (
                  <div
                    key={msg.id}
                    style={{
                      display: 'flex',
                      justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
                      marginBottom: 12
                    }}
                  >
                    <div
                      style={{
                        maxWidth: '70%',
                        padding: '8px 12px',
                        borderRadius: 8,
                        backgroundColor: isCurrentUser ? '#1890ff' : '#fff',
                        color: isCurrentUser ? '#fff' : '#000',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      <div>{msg.message}</div>
                      <div
                        style={{
                          fontSize: 11,
                          opacity: 0.7,
                          marginTop: 4,
                          textAlign: 'right'
                        }}
                      >
                        {formatTime(msg.created_at)}
                      </div>
                    </div>
                  </div>
                );
                })
              )}
              <div ref={messagesEndRef} />
            </div>

            <Divider style={{ margin: 0 }} />

            {/* Message Input */}
            <div style={{ padding: 16 }}>
              <Space.Compact style={{ width: '100%' }}>
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
                  loading={loading}
                  onClick={sendMessage}
                  disabled={!newMessage.trim()}
                >
                  Gửi
                </Button>
              </Space.Compact>
            </div>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: '#999'
            }}
          >
            <div style={{ textAlign: 'center' }}>
              <MessageOutlined style={{ fontSize: 48, marginBottom: 16 }} />
              <div>Chọn một cuộc trò chuyện để bắt đầu</div>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
};

export default ChatAdmin;