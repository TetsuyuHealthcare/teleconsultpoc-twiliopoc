import React, { PureComponent } from 'react';
import { Modal, List, Typography, Row, Col } from 'antd';

class MeetLink extends PureComponent {
  render() {
    const {
      data,
      title,
      visible,
      onCancel,
      maskClosable,
      destroyOnClose,
    } = this.props;

    return (
      <div className='meet-link-container'>
        <Modal
          title={title}
          footer={null}
          visible={visible}
          destroyOnClose={destroyOnClose}
          maskClosable={maskClosable}
          onCancel={onCancel}
          width='65vw'
        >
          <List
            dataSource={data}
            renderItem={(participantLink) => (
              <List.Item>
                <Row>
                  <Col span={24}>
                    <Typography.Text mark>
                      {participantLink.email}
                    </Typography.Text>
                  </Col>
                  <Col span={24}>
                    <a
                      href={participantLink.url}
                      target='_blank'
                      rel='noopener noreferrer'
                    >
                      {participantLink.url}
                    </a>
                  </Col>
                </Row>
              </List.Item>
            )}
          />
        </Modal>
      </div>
    );
  }
}

export default MeetLink;
