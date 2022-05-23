import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Form, Input, Button, Typography } from 'antd';

import ErrorMessage from '../../components/ErrorMessage';

import { login } from '../../actions/authActions';
import { clearErrors } from '../../actions/errorActions';
import './index.scss';

const { Title } = Typography;

class LoginContainer extends Component {
  componentWillUnmount() {
    const { clearErrors } = this.props;
    clearErrors('login');
  }

  finishLogin = (values) => {
    const { login } = this.props;
    login(values);
  };

  render() {
    const { loading, currentUser, errors } = this.props;

    if (currentUser) {
      return <Redirect to={currentUser.role === 'admin' ? '/admin' : '/'} />;
    }

    return (
      <div className='login-container'>
        <Title level={2}>Login</Title>
        <ErrorMessage errors={errors} />
        <Form
          name='login-form'
          layout='vertical'
          onFinish={this.finishLogin}
          colon={false}
          hideRequiredMark
        >
          <Form.Item
            name='email'
            label='Email'
            rules={[
              { type: 'email', message: 'Email is not valid' },
              { required: true, message: 'Email is required' },
            ]}
            hasFeedback
          >
            <Input />
          </Form.Item>
          <Form.Item
            label='Password'
            name='password'
            rules={[{ required: true, message: 'Password is required' }]}
            hasFeedback
          >
            <Input.Password />
          </Form.Item>
          <Form.Item>
            <Button
              type='primary'
              htmlType='submit'
              size='large'
              loading={loading}
              block
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = ({ auth, error }) => {
  return {
    currentUser: auth.currentUser,
    loading: auth.loading,
    errors: error.login,
  };
};

export default connect(mapStateToProps, {
  login,
  clearErrors,
})(LoginContainer);
