import React, { Component } from 'react';
import { Form, Input, Button, Typography } from 'antd';

import './index.scss';

const { Title } = Typography;

class Setup extends Component {
  onFinish = (values) => {
    const { onFinish } = this.props;
    onFinish(values);
  };

  render() {
    return (
      <div className='setup'>
        <Title className='title' level={3}>
          Setup your name
        </Title>
        <Form
          colon={false}
          layout='vertical'
          onFinish={this.onFinish}
          hideRequiredMark
        >
          <Form.Item
            name='name'
            label={false}
            rules={[{ required: true, message: 'Name is required' }]}
            hasFeedback
          >
            <Input placeholder='Type your name' />
          </Form.Item>
          <Form.Item>
            <Button type='primary' htmlType='submit'>
              Next
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Setup;
