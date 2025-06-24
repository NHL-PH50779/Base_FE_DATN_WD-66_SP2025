import { useState } from 'react';
import { Form, Input, Button, Card, message, Alert } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../../services/auth.service';

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState(false);
  const navigate = useNavigate();

  const onFinish = async (values: { 
    name: string; 
    email: string; 
    password: string; 
    password_confirmation: string;
  }) => {
    setLoading(true);
    setServerError(false);
    
    try {
      // Mặc định role là 'client' - không cho user chọn
      const registerData = {
        ...values,
        role: 'client'
      };
      
      const response = await authService.register(registerData);
      console.log('Register response:', response);
      
      message.success('Đăng ký thành công! Đang chuyển hướng...');
      
      // Delay để đảm bảo localStorage đã được cập nhật
      setTimeout(() => {
        // Redirect về client dashboard vì mặc định là client
        window.location.href = '/client/dashboard';
      }, 1000);
      
    } catch (error: any) {
      console.error('Register error:', error);
      
      if (error.response?.status === 404) {
        setServerError(true);
        message.error('Không thể kết nối đến server. Vui lòng kiểm tra backend Laravel.');
      } else {
        const errorMessage = error.response?.data?.message || 'Đăng ký thất bại';
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
        title="Đăng ký tài khoản" 
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
            name="name"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên!' },
              { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự!' }
            ]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Họ và tên" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email!' },
              { type: 'email', message: 'Email không hợp lệ!' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu!' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự!' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Mật khẩu" 
              size="large"
            />
          </Form.Item>

          <Form.Item
            name="password_confirmation"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Xác nhận mật khẩu" 
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
              Đăng ký
            </Button>
          </Form.Item>

          <div style={{ textAlign: 'center' }}>
            Đã có tài khoản? <Link to="/login">Đăng nhập ngay</Link>
          </div>
        </Form>
      </Card>
    </div>
  );
}