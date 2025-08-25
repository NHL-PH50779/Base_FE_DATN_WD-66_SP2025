import React, { useState, useEffect } from 'react';
import { commentService, type Comment } from '../services/comment.service';

const Comments: React.FC = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0, rejected: 0 });

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 3000);
    return () => clearInterval(interval);
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [allComments, statsData] = await Promise.all([
        commentService.getAllComments(),
        commentService.getStats()
      ]);
      setComments(allComments);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: number) => {
    try {
      await commentService.updateCommentStatus(id, 'approved');
      await loadData();
    } catch (error) {
      console.error('Error approving comment:', error);
      alert('Có lỗi xảy ra khi duyệt bình luận');
    }
  };

  const handleReject = async (id: number) => {
    try {
      await commentService.updateCommentStatus(id, 'rejected');
      await loadData();
    } catch (error) {
      console.error('Error rejecting comment:', error);
      alert('Có lỗi xảy ra khi từ chối bình luận');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Xác nhận xóa bình luận này?')) {
      try {
        await commentService.deleteComment(id);
        await loadData();
      } catch (error) {
        console.error('Error deleting comment:', error);
        alert('Có lỗi xảy ra khi xóa bình luận');
      }
    }
  };

  const filteredComments = filter === 'all' 
    ? comments 
    : comments.filter(c => c.status === filter);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return '#52c41a';
      case 'rejected': return '#ff4d4f';
      default: return '#faad14';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Từ chối';
      default: return 'Chờ duyệt';
    }
  };

  const getCommentType = (rating: number) => {
    return rating === 0 ? 'Bình luận' : `Đánh giá ${rating}★`;
  };

  return (
    <div style={{ padding: '20px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h2>Quản lý bình luận & đánh giá</h2>
        <button 
          onClick={loadData}
          disabled={loading}
          style={{
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Đang tải...' : 'Làm mới'}
        </button>
      </div>
      
      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '15px', marginBottom: '20px' }}>
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1890ff' }}>{stats.total}</div>
          <div style={{ color: '#666' }}>Tổng cộng</div>
        </div>
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#faad14' }}>{stats.pending}</div>
          <div style={{ color: '#666' }}>Chờ duyệt</div>
        </div>
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>{stats.approved}</div>
          <div style={{ color: '#666' }}>Đã duyệt</div>
        </div>
        <div style={{ padding: '15px', border: '1px solid #ddd', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ff4d4f' }}>{stats.rejected}</div>
          <div style={{ color: '#666' }}>Từ chối</div>
        </div>
      </div>

      {/* Filter */}
      <div style={{ marginBottom: '20px' }}>
        {[
          { key: 'all', label: 'Tất cả', count: stats.total },
          { key: 'pending', label: 'Chờ duyệt', count: stats.pending },
          { key: 'approved', label: 'Đã duyệt', count: stats.approved },
          { key: 'rejected', label: 'Từ chối', count: stats.rejected }
        ].map(({ key, label, count }) => (
          <button 
            key={key}
            onClick={() => setFilter(key as any)}
            style={{ 
              marginRight: '10px', 
              padding: '8px 16px',
              backgroundColor: filter === key ? '#007bff' : '#f8f9fa',
              color: filter === key ? 'white' : '#333',
              border: '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            {label} ({count})
          </button>
        ))}
      </div>

      {/* Comments List */}
      <div>
        {filteredComments.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#666' }}>
            {loading ? 'Đang tải...' : 'Không có bình luận nào'}
          </div>
        ) : (
          filteredComments.map(comment => (
            <div key={comment.id} style={{ 
              padding: '20px', 
              border: '1px solid #ddd', 
              borderRadius: '8px', 
              marginBottom: '15px',
              backgroundColor: '#fafafa'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '10px' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {comment.user.name}
                    </div>
                    <div style={{ 
                      display: 'inline-block',
                      padding: '2px 6px',
                      borderRadius: '3px',
                      fontSize: '11px',
                      backgroundColor: comment.rating === 0 ? '#17a2b8' : '#28a745',
                      color: 'white'
                    }}>
                      {getCommentType(comment.rating)}
                    </div>
                    <div style={{ 
                      display: 'inline-block',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      color: 'white',
                      backgroundColor: getStatusColor(comment.status)
                    }}>
                      {getStatusText(comment.status)}
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '10px', color: '#666', fontSize: '14px' }}>
                    Sản phẩm: <strong>{comment.product?.name || `ID: ${comment.product_id}`}</strong>
                  </div>
                  
                  <div style={{ marginBottom: '10px', lineHeight: '1.5' }}>
                    {comment.content}
                  </div>
                  
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {new Date(comment.created_at).toLocaleString('vi-VN')}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '8px', marginLeft: '20px' }}>
                  {comment.status === 'pending' && (
                    <>
                      <button 
                        onClick={() => handleApprove(comment.id)}
                        style={{ 
                          padding: '6px 12px',
                          backgroundColor: '#52c41a', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Duyệt
                      </button>
                      <button 
                        onClick={() => handleReject(comment.id)}
                        style={{ 
                          padding: '6px 12px',
                          backgroundColor: '#ff4d4f', 
                          color: 'white', 
                          border: 'none', 
                          borderRadius: '4px',
                          cursor: 'pointer',
                          fontSize: '12px'
                        }}
                      >
                        Từ chối
                      </button>
                    </>
                  )}
                  <button 
                    onClick={() => handleDelete(comment.id)}
                    style={{ 
                      padding: '6px 12px',
                      backgroundColor: '#dc3545', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px'
                    }}
                  >
                    Xóa
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Comments;