import React, { useState, useEffect } from 'react';
import { Badge, Dropdown, List, Button, Typography, Empty } from 'antd';
import { BellOutlined, CheckOutlined } from '@ant-design/icons';
import { axiosInstance } from '../../utils/axios.util';

const { Text } = Typography;

interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  is_read: boolean;
  created_at: string;
  data?: any;
}

const NotificationBell: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await axiosInstance.get('/admin/notifications');
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await axiosInstance.get('/admin/notifications/unread-count');
      setUnreadCount(response.data.count || 0);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const markAsRead = async (id: number) => {
    try {
      await axiosInstance.put(`/admin/notifications/${id}/read`);
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const markAllAsRead = async () => {
    setLoading(true);
    try {
      await axiosInstance.put('/admin/notifications/mark-all-read');
      fetchNotifications();
      fetchUnreadCount();
    } catch (error) {
      console.error('Error marking all as read:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    
    // Poll for new notifications every 30 seconds
    const interval = setInterval(() => {
      fetchUnreadCount();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const menuItems = {
    items: [
      // Header item
      {
        key: 'header',
        label: (
          <div style={{ padding: '8px 0', borderBottom: '1px solid #f0f0f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Text strong>Thông báo</Text>
            {unreadCount > 0 && (
              <Button 
                type="link" 
                size="small" 
                icon={<CheckOutlined />}
                onClick={markAllAsRead}
                loading={loading}
                style={{ padding: 0, height: 'auto' }}
              >
                Đánh dấu tất cả
              </Button>
            )}
          </div>
        ),
        disabled: true
      },
      // Notification items
      ...notifications.map((item) => ({
        key: item.id,
        label: (
          <div 
            style={{
              width: 320,
              padding: '8px 0',
              backgroundColor: item.is_read ? 'transparent' : '#f6ffed'
            }}
            onClick={() => !item.is_read && markAsRead(item.id)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 }}>
              <Text strong style={{ fontSize: '14px' }}>{item.title}</Text>
              {!item.is_read && (
                <div style={{ width: 8, height: 8, backgroundColor: '#1890ff', borderRadius: '50%', marginTop: 2 }} />
              )}
            </div>
            <Text style={{ fontSize: '12px', color: '#666', display: 'block', marginBottom: 4 }}>
              {item.message}
            </Text>
            <Text style={{ fontSize: '11px', color: '#999' }}>
              {new Date(item.created_at).toLocaleString('vi-VN')}
            </Text>
          </div>
        )
      }))
    ],
    selectable: false
  };

  return (
    <Dropdown
      menu={notifications.length > 0 ? menuItems : { items: [{ key: 'empty', label: 'Không có thông báo nào', disabled: true }] }}
      trigger={['click']}
      placement="bottomRight"
      onOpenChange={(open) => {
        if (open) {
          fetchNotifications();
        }
      }}
    >
      <Badge count={unreadCount} size="small">
        <Button 
          type="text" 
          icon={<BellOutlined style={{ fontSize: '18px' }} />}
          style={{ border: 'none', boxShadow: 'none' }}
        />
      </Badge>
    </Dropdown>
  );
};

export default NotificationBell;