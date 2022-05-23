import React, { Component } from 'react';

import { Typography, Breadcrumb, PageHeader, Space, Card } from 'antd';
import { DashboardOutlined } from '@ant-design/icons';

const { Text } = Typography;

class DashboardContainer extends Component {
  render() {
    return (
      <div className='admin-page admin-dashboard-container'>
        <Breadcrumb>
          <Breadcrumb.Item>
            <Space>
              <DashboardOutlined />
              Admin
            </Space>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            Dashboard
          </Breadcrumb.Item>
        </Breadcrumb>
        <Card>
          <PageHeader
            title='Dashboard'
          />
          <Text type='secondary'>Welcome to admin dashboard.</Text>
        </Card>
      </div>
    );
  }
}

export default DashboardContainer;
