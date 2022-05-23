import React from 'react';
import { Typography } from 'antd';
import { FireOutlined } from '@ant-design/icons';

import './index.scss';

const { Title } = Typography;

function HomeContainer() {
  return (
    <div className='home-container'>
      <FireOutlined style={{ color: '#1890ff', fontSize: '128px' }} />
      <br/>
      <Title level={2} className='welcome-text'>
        Hello :)
      </Title>
    </div>
  );
}

export default HomeContainer;
