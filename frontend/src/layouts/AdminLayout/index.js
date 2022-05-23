import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';
import {
  UserOutlined,
  DashboardOutlined,
  WhatsAppOutlined,
  SettingOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

import { logout } from '../../actions/authActions';

import './index.scss';

const { Header, Content, Sider } = Layout;

class AdminLayout extends Component {
  handleClickOnMenu = ({ key }) => {
    const { logout } = this.props;

    switch(key) {
      case 'logout':
        logout();
        break;
      default:
        // do not thing
    }
  }

  render() {
    const { children, currentUser } = this.props;

    return (
      <Layout className='admin-layout'>
        <Sider className='admin-layout__sider'>
          <div className='admin-layout__logo' />
          <Menu theme='dark' mode='inline'>
            <Menu.Item key='dashboard' icon={<DashboardOutlined />}>
              <Link to='/admin'>Dashboard</Link>
            </Menu.Item>
            <Menu.Item key='meets' icon={<WhatsAppOutlined />}>
              <Link to='/admin/meets'>Meets</Link>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout className='admin-layout__content'>
          <Header className='admin-layout__header'>
            <Menu mode='horizontal' onClick={this.handleClickOnMenu}>
              <Menu.SubMenu
                icon={<SettingOutlined />}
                style={{ float: 'right' }}
                title={currentUser.email}
              >
                <Menu.Item icon={<UserOutlined />} key='profile'>
                  Profile
                </Menu.Item>
                <Menu.Item icon={<LogoutOutlined />} key='logout'>
                  Logout
                </Menu.Item>
              </Menu.SubMenu>
            </Menu>
          </Header>
          <Content className='admin-layout__main-content'>
            <div className='admin-layout__main-content-wrapper'>{children}</div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}

const mapStateToProps = ({ auth }) => ({
  currentUser: auth.currentUser,
});

export default connect(mapStateToProps, {
  logout,
})(AdminLayout);
