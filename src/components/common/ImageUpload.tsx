import React, { useState } from 'react';
import { Upload, Button, Image, message } from 'antd';
import { UploadOutlined, DeleteOutlined } from '@ant-design/icons';
import type { UploadFile, UploadProps } from 'antd';

interface ImageUploadProps {
  value?: string;
  onChange?: (url: string | null) => void;
  maxCount?: number;
  accept?: string;
  listType?: 'text' | 'picture' | 'picture-card';
}

const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  maxCount = 1,
  accept = 'image/*',
  listType = 'picture-card'
}) => {
  const [fileList, setFileList] = useState<UploadFile[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(value || null);

  const handleUpload: UploadProps['customRequest'] = async (options) => {
    const { file, onSuccess, onError } = options;
    
    try {
      const formData = new FormData();
      formData.append('thumbnail', file as File);

      const response = await fetch('http://127.0.0.1:8000/api/upload', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();
      const imageUrl = result.url || result.data?.url;

      if (imageUrl) {
        setPreviewUrl(imageUrl);
        onChange?.(imageUrl);
        onSuccess?.(result);
        message.success('Upload ảnh thành công!');
      } else {
        throw new Error('No URL returned');
      }
    } catch (error) {
      console.error('Upload error:', error);
      onError?.(error as Error);
      message.error('Upload ảnh thất bại!');
    }
  };

  const handleRemove = () => {
    setPreviewUrl(null);
    setFileList([]);
    onChange?.(null);
  };

  const uploadProps: UploadProps = {
    customRequest: handleUpload,
    fileList,
    maxCount,
    accept,
    listType,
    showUploadList: false,
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('Chỉ được upload file ảnh!');
        return false;
      }
      
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Ảnh phải nhỏ hơn 2MB!');
        return false;
      }
      
      return true;
    },
    onChange: (info) => {
      setFileList(info.fileList);
    },
  };

  return (
    <div className="image-upload">
      {previewUrl ? (
        <div className="relative inline-block">
          <Image
            src={previewUrl}
            alt="Preview"
            width={100}
            height={100}
            style={{ objectFit: 'cover', borderRadius: 8 }}
          />
          <Button
            type="text"
            danger
            icon={<DeleteOutlined />}
            onClick={handleRemove}
            className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
            size="small"
          />
        </div>
      ) : (
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>
            Upload ảnh
          </Button>
        </Upload>
      )}
    </div>
  );
};

export default ImageUpload;