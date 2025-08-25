// Sử dụng BroadcastChannel để đồng bộ giữa admin và client
const COMMENTS_KEY = 'shared_all_comments';
const channel = new BroadcastChannel('comments-sync');

// Lắng nghe tin nhắn từ tab khác
channel.addEventListener('message', (event) => {
  if (event.data.type === 'COMMENTS_UPDATED') {
    console.log('Nhận được cập nhật comments từ tab khác');
    window.dispatchEvent(new CustomEvent('commentsUpdated', { detail: event.data.comments }));
  }
});

// Hàm gửi tin nhắn đến tất cả tab
window.broadcastCommentsUpdate = (comments) => {
  channel.postMessage({
    type: 'COMMENTS_UPDATED',
    comments: comments,
    timestamp: Date.now()
  });
};

// Hàm lấy comments
window.getSharedComments = () => {
  return JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
};

// Hàm lưu comments và broadcast
window.saveSharedComments = (comments) => {
  localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
  window.broadcastCommentsUpdate(comments);
};