// API giả để đồng bộ comments
const STORAGE_KEY = 'shared_comments_db';

// Lấy comments từ localStorage chung
window.getSharedComments = function() {
  const data = localStorage.getItem(STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

// Lưu comments vào localStorage chung
window.saveSharedComments = function(comments) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(comments));
  
  // Broadcast đến tất cả tab/window
  const event = new CustomEvent('commentsChanged', { 
    detail: { comments, timestamp: Date.now() } 
  });
  window.dispatchEvent(event);
  
  // Cũng trigger storage event
  window.dispatchEvent(new StorageEvent('storage', {
    key: STORAGE_KEY,
    newValue: JSON.stringify(comments)
  }));
};

// Thêm comment mới
window.addSharedComment = function(commentData) {
  const comments = window.getSharedComments();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  const newComment = {
    id: Date.now(),
    product_id: commentData.product_id,
    user_id: user.id || 1,
    user_name: user.name || 'Khách hàng',
    content: commentData.content,
    rating: commentData.rating || 0,
    status: 'pending',
    created_at: new Date().toISOString()
  };
  
  comments.unshift(newComment);
  window.saveSharedComments(comments);
  return newComment;
};

// Cập nhật trạng thái comment
window.updateCommentStatus = function(commentId, status) {
  const comments = window.getSharedComments();
  const updated = comments.map(c => 
    c.id === commentId ? { ...c, status } : c
  );
  window.saveSharedComments(updated);
};

// Xóa comment
window.deleteSharedComment = function(commentId) {
  const comments = window.getSharedComments();
  const updated = comments.filter(c => c.id !== commentId);
  window.saveSharedComments(updated);
};

console.log('Shared Comments API loaded');