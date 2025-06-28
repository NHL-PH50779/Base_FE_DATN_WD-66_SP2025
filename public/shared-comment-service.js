// Service chung cho admin và client
const COMMENTS_KEY = 'shared_all_comments';

class SharedCommentService {
  getAllComments() {
    return JSON.parse(localStorage.getItem(COMMENTS_KEY) || '[]');
  }

  saveComments(comments) {
    localStorage.setItem(COMMENTS_KEY, JSON.stringify(comments));
    window.dispatchEvent(new CustomEvent('commentsUpdated', { detail: comments }));
  }

  addComment(commentData) {
    const comments = this.getAllComments();
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    const newComment = {
      id: Date.now(),
      user_id: user.id || 999,
      product_id: commentData.product_id,
      content: commentData.content,
      rating: commentData.rating || 0,
      status: 'pending',
      created_at: new Date().toISOString(),
      user: { id: user.id || 999, name: user.name || 'Khách hàng' },
      product: { id: commentData.product_id, name: `Sản phẩm ${commentData.product_id}` }
    };

    const updatedComments = [newComment, ...comments];
    this.saveComments(updatedComments);
    return newComment;
  }

  updateStatus(commentId, status) {
    const comments = this.getAllComments();
    const updatedComments = comments.map(c => 
      c.id === commentId ? { ...c, status, updated_at: new Date().toISOString() } : c
    );
    this.saveComments(updatedComments);
    return true;
  }

  deleteComment(commentId) {
    const comments = this.getAllComments();
    const updatedComments = comments.filter(c => c.id !== commentId);
    this.saveComments(updatedComments);
    return true;
  }

  getStats() {
    const comments = this.getAllComments();
    return {
      total: comments.length,
      pending: comments.filter(c => c.status === 'pending').length,
      approved: comments.filter(c => c.status === 'approved').length,
      rejected: comments.filter(c => c.status === 'rejected').length
    };
  }
}

window.sharedCommentService = new SharedCommentService();