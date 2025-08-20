import React from 'react';
import { Card, Row, Col, Select, DatePicker, Button, Space, Divider, Typography } from 'antd';
import { FilterOutlined, ReloadOutlined } from '@ant-design/icons';
import dayjs from 'dayjs';

const { RangePicker } = DatePicker;
const { Option } = Select;
const { Title } = Typography;

interface DashboardFiltersProps {
  timeFilter: string;
  setTimeFilter: (value: string) => void;
  dateRange: [dayjs.Dayjs, dayjs.Dayjs] | null;
  setDateRange: (value: [dayjs.Dayjs, dayjs.Dayjs] | null) => void;
  statusFilter: string;
  setStatusFilter: (value: string) => void;
  categoryFilter: string;
  setCategoryFilter: (value: string) => void;
  onApplyFilters: () => void;
  onResetFilters: () => void;
  onRefresh: () => void;
  loading: boolean;
}

const DashboardFilters: React.FC<DashboardFiltersProps> = ({
  timeFilter,
  setTimeFilter,
  dateRange,
  setDateRange,
  statusFilter,
  setStatusFilter,
  categoryFilter,
  setCategoryFilter,
  onApplyFilters,
  onResetFilters,
  onRefresh,
  loading
}) => {
  return (
    <Card style={{ marginBottom: 24, borderRadius: 12 }}>
      <Row justify="space-between" align="middle">
        <Col>
          <Title level={2} style={{ color: "#1890ff", margin: 0 }}>
            📊 Dashboard Quản Trị
          </Title>
        </Col>
        <Col>
          <Button 
            type="primary" 
            icon={<ReloadOutlined />} 
            onClick={onRefresh}
            loading={loading}
          >
            Làm mới
          </Button>
        </Col>
      </Row>
      
      <Divider />
      
      {/* Bộ lọc */}
      <Row gutter={16} align="middle" wrap>
        <Col>
          <FilterOutlined style={{ color: '#1890ff', fontSize: 16 }} />
          <span style={{ marginLeft: 8, fontWeight: 600 }}>Bộ lọc:</span>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={4}>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <span style={{ fontSize: 12, color: '#666' }}>Thời gian:</span>
            <Select 
              value={timeFilter} 
              onChange={setTimeFilter}
              style={{ width: '100%' }}
              size="small"
            >
              <Option value="all">Tất cả</Option>
              <Option value="today">Hôm nay</Option>
              <Option value="week">Tuần này</Option>
              <Option value="month">Tháng này</Option>
              <Option value="year">Năm này</Option>
            </Select>
          </Space>
        </Col>
        
        <Col xs={24} sm={12} md={8} lg={6}>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <span style={{ fontSize: 12, color: '#666' }}>Khoảng thời gian:</span>
            <RangePicker 
              value={dateRange}
              onChange={setDateRange}
              size="small"
              format="DD/MM/YYYY"
              style={{ width: '100%' }}
              placeholder={['Từ ngày', 'Đến ngày']}
            />
          </Space>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={4}>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <span style={{ fontSize: 12, color: '#666' }}>Trạng thái đơn:</span>
            <Select 
              value={statusFilter} 
              onChange={setStatusFilter}
              style={{ width: '100%' }}
              size="small"
            >
              <Option value="all">Tất cả</Option>
              <Option value="pending">Chờ xác nhận</Option>
              <Option value="confirmed">Đã xác nhận</Option>
              <Option value="shipping">Đang giao</Option>
              <Option value="completed">Hoàn thành</Option>
              <Option value="cancelled">Đã hủy</Option>
            </Select>
          </Space>
        </Col>
        
        <Col xs={24} sm={12} md={6} lg={4}>
          <Space direction="vertical" size={4} style={{ width: '100%' }}>
            <span style={{ fontSize: 12, color: '#666' }}>Danh mục:</span>
            <Select 
              value={categoryFilter} 
              onChange={setCategoryFilter}
              style={{ width: '100%' }}
              size="small"
            >
              <Option value="all">Tất cả</Option>
              <Option value="laptop">Laptop</Option>
              <Option value="gaming">Gaming</Option>
              <Option value="office">Văn phòng</Option>
            </Select>
          </Space>
        </Col>
        
        <Col xs={24} md={6} lg={4}>
          <Space style={{ width: '100%', justifyContent: 'flex-end', marginTop: 20 }}>
            <Button size="small" type="primary" onClick={onApplyFilters}>
              Áp dụng
            </Button>
            <Button size="small" onClick={onResetFilters}>
              Đặt lại
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default DashboardFilters;