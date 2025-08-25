import React from 'react';
import { Skeleton } from 'antd';

export const ChatListSkeleton = () => (
  <div style={{ padding: 16 }}>
    {[...Array(5)].map((_, i) => (
      <div key={i} style={{ marginBottom: 16, display: 'flex', alignItems: 'center' }}>
        <Skeleton.Avatar size={40} />
        <div style={{ marginLeft: 12, flex: 1 }}>
          <Skeleton.Input style={{ width: 120, height: 16 }} active />
          <Skeleton.Input style={{ width: 80, height: 12, marginTop: 4 }} active />
        </div>
      </div>
    ))}
  </div>
);

export const MessageSkeleton = () => (
  <div style={{ padding: 16 }}>
    {[...Array(8)].map((_, i) => (
      <div key={i} style={{ 
        marginBottom: 12, 
        display: 'flex', 
        justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end' 
      }}>
        <Skeleton.Input 
          style={{ 
            width: Math.random() * 200 + 100, 
            height: 40,
            borderRadius: 8 
          }} 
          active 
        />
      </div>
    ))}
  </div>
);