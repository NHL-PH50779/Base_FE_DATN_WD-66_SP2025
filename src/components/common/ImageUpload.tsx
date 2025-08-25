import React, { useState, useEffect } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import axios from 'axios';

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ value, onChange }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(value || null);
  const [uploading, setUploading] = useState(false);
  
  // Sync with props value
  React.useEffect(() => {
    setImageUrl(value || null);
  }, [value]);

  const handleUpload = async (file: File) => {
    // Validate file
    if (!file.type.startsWith('image/')) {
      message.error('Chỉ được upload file ảnh!');
      return false;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      message.error('Ảnh phải nhỏ hơn 2MB!');
      return false;
    }

    setUploading(true);
    
    try {
      const formData = new FormData();
      formData.append('thumbnail', file);

      const token = localStorage.getItem('token');
      const response = await axios.post('http://127.0.0.1:8000/api/upload', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      const url = response.data.data?.url || response.data.url;
      if (url) {
        setImageUrl(url);
        onChange?.(url);
        message.success('Upload ảnh thành công!');
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      const errorMsg = error.response?.data?.message || 'Upload thất bại!';
      message.error(errorMsg);
    } finally {
      setUploading(false);
    }

    return false; // Prevent default upload
  };

  const handleRemove = () => {
    setImageUrl(null);
    onChange?.(null);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      {imageUrl ? (
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img
            src={imageUrl}
            alt="Product Image"
            style={{ 
              width: 100, 
              height: 100, 
              objectFit: 'cover', 
              borderRadius: 8,
              border: '1px solid #d9d9d9'
            }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleRemove}
            style={{
              position: 'absolute',
              top: -8,
              right: -8,
              backgroundColor: '#ff4d4f',
              color: 'white',
              borderRadius: '50%',
              width: 24,
              height: 24,
              minWidth: 24,
              padding: 0
            }}
            size="small"
          />
        </div>
      ) : (
        <Upload
          beforeUpload={handleUpload}
          showUploadList={false}
          accept="image/*"
        >
          <Button 
            icon={<UploadOutlined />} 
            loading={uploading}
            disabled={uploading}
          >
            {uploading ? 'Đang upload...' : 'Upload ảnh'}
          </Button>
        </Upload>
      )}
    </div>
  );
};

export default ImageUpload;