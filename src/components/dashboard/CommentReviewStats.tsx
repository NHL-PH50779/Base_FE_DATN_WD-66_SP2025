import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Progress, Typography } from 'antd';
import { 
  CommentOutlined, 
  StarOutlined, 
  CheckCircleOutlined, 
  ClockCircleOutlined,
  CloseCircleOutlined 
} from '@ant-design/icons';
import { commentService } from '../../services/comment.service';

const { Title } = Typography;

const CommentReviewStats = () => {
  const [stats, setStats] = useState({
    comments: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0
    },
    reviews: {
      total: 0,
      pending: 0,
      approved: 0,
      rejected: 0,
      averageRating: '0'
    }
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await commentService.getStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getApprovalRate = (approved: number, total: number) => {
    return total > 0 ? Math.round((approved / total) * 100) : 0;
  };

  return (
    <div>
      <Title level={4} style={{ marginBottom: 16 }}>
        📊 Thống kê Bình luận & Đánh giá
      </Title>
      
      <Row gutter={[16, 16]}>
        {/* Comments Stats */}
        <Col span={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <CommentOutlined style={{ color: '#1890ff' }} />
                <span>Bình luận</span>
              </div>
            }
            loading={loading}
          >
            <Row gutter={16}>
              <Col span={12}>
                <Statistic
                  title="Tổng số"
                  value={stats.comments.total}
                  valueStyle={{ color: '#1890ff' }}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Tỷ lệ duyệt"
                  value={getApprovalRate(stats.comments.approved, stats.comments.total)}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
            </Row>
            
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  Đã duyệt: {stats.comments.approved}
                </span>
                <span>{getApprovalRate(stats.comments.approved, stats.comments.total)}%</span>
              </div>
              <Progress 
                percent={getApprovalRate(stats.comments.approved, stats.comments.total)} 
                strokeColor="#52c41a"
                showInfo={false}
              />
            </div>
            
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                  Chờ duyệt: {stats.comments.pending}
                </span>
                <span>{getApprovalRate(stats.comments.pending, stats.comments.total)}%</span>
              </div>
              <Progress 
                percent={getApprovalRate(stats.comments.pending, stats.comments.total)} 
                strokeColor="#fa8c16"
                showInfo={false}
              />
            </div>
            
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                  Từ chối: {stats.comments.rejected}
                </span>
                <span>{getApprovalRate(stats.comments.rejected, stats.comments.total)}%</span>
              </div>
              <Progress 
                percent={getApprovalRate(stats.comments.rejected, stats.comments.total)} 
                strokeColor="#ff4d4f"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>

        {/* Reviews Stats */}
        <Col span={12}>
          <Card 
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <StarOutlined style={{ color: '#faad14' }} />
                <span>Đánh giá</span>
              </div>
            }
            loading={loading}
          >
            <Row gutter={16}>
              <Col span={8}>
                <Statistic
                  title="Tổng số"
                  value={stats.reviews.total}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Điểm TB"
                  value={stats.reviews.averageRating}
                  suffix="/ 5"
                  precision={1}
                  valueStyle={{ color: '#faad14' }}
                />
              </Col>
              <Col span={8}>
                <Statistic
                  title="Tỷ lệ duyệt"
                  value={getApprovalRate(stats.reviews.approved, stats.reviews.total)}
                  suffix="%"
                  valueStyle={{ color: '#52c41a' }}
                />
              </Col>
            </Row>
            
            <div style={{ marginTop: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CheckCircleOutlined style={{ color: '#52c41a' }} />
                  Đã duyệt: {stats.reviews.approved}
                </span>
                <span>{getApprovalRate(stats.reviews.approved, stats.reviews.total)}%</span>
              </div>
              <Progress 
                percent={getApprovalRate(stats.reviews.approved, stats.reviews.total)} 
                strokeColor="#52c41a"
                showInfo={false}
              />
            </div>
            
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <ClockCircleOutlined style={{ color: '#fa8c16' }} />
                  Chờ duyệt: {stats.reviews.pending}
                </span>
                <span>{getApprovalRate(stats.reviews.pending, stats.reviews.total)}%</span>
              </div>
              <Progress 
                percent={getApprovalRate(stats.reviews.pending, stats.reviews.total)} 
                strokeColor="#fa8c16"
                showInfo={false}
              />
            </div>
            
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                  <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
                  Từ chối: {stats.reviews.rejected}
                </span>
                <span>{getApprovalRate(stats.reviews.rejected, stats.reviews.total)}%</span>
              </div>
              <Progress 
                percent={getApprovalRate(stats.reviews.rejected, stats.reviews.total)} 
                strokeColor="#ff4d4f"
                showInfo={false}
              />
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default CommentReviewStats;