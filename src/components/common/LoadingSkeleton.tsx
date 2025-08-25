import React from 'react';
import { Skeleton, Card } from 'antd';

export const ProductListSkeleton: React.FC = () => (
  <div>
    {[...Array(6)].map((_, index) => (
      <Card key={index} style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 16 }}>
          <Skeleton.Image style={{ width: 50, height: 50 }} />
          <div style={{ flex: 1 }}>
            <Skeleton active paragraph={{ rows: 2 }} />
          </div>
        </div>
      </Card>
    ))}
  </div>
);

export const ProductFormSkeleton: React.FC = () => (
  <Card>
    <Skeleton active paragraph={{ rows: 8 }} />
  </Card>
);