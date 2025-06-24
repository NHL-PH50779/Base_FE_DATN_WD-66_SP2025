import { useState } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function Login() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { email: string; password: string }) => {
    setLoading(true);
    setServerError(false);
    
    try {
      const response = await authService.login(values);
      console.log('Login response:', response);
      
      message.success('Đăng nhập thành công');
      
      // Delay để đảm bảo localStorage đã được cập nhật
      setTimeout(() => {
        // Kiểm tra lại sau khi lưu
        const savedUser = authService.getUser();
        const isAdmin = authService.isAdmin();
        
        console.log('After save - User:', savedUser, 'Is Admin:', isAdmin);
        
        // Redirect dựa trên role
        if (savedUser?.role === 'admin') {
          console.log('Redirecting to admin dashboard');
          window.location.href = '/admin/dashboard';
        } else {
          console.log('Redirecting to client dashboard');  
          window.location.href = '/client/dashboard';
        }
      }, 200);
      
    } catch (error: any) {
      console.error('Login error:', error);
      
      if (error.response?.status === 404) {
        setServerError(true);
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra backend Laravel.');
      } else {
        const errorMessage = error.response?.data?.message || 'Đăng nhập thất bại';
        message.error(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      <Card 
        title="Đăng nhập" 
        style={{ width: 400, boxShadow: '0 4px 24px rgba(0,0,0,0.15)' }}
      >
        {serverError && (
          <Alert
            message="Server không khả dụng"
            description="Vui lòng khởi động Laravel server bằng lệnh: php artisan serve"
            type="error"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}
        
        <Form onFinish={onFinish} layout="vertical">
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Email" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Mật khẩu" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              loading={loading}
              size="large"
              style={{ width: '100%' }}
              disabled={serverError}
            >
              Đăng nhập
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}