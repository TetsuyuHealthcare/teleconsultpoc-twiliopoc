import React, { Component } from 'react';
import { Button, Typography } from 'antd';

import './index.scss';

const { Title } = Typography;

class Waiting extends Component {
  handleJoin = () => {
    const { onJoin } = this.props;
    onJoin();
  };

  render() {
    const { currentRoom, currentParticipant } = this.props;

    return (
      <div className='waiting'>
        <div className='content'>
          <Title className='title' level={3}>
            Room: {currentRoom.name}
          </Title>
          <Title className='sub-title' level={5}>
            Participant: {currentParticipant.email} - {currentParticipant.name}
          </Title>
        </div>
        <div className='action'>
          <Button type='primary' onClick={this.handleJoin}>
            Join Now
          </Button>
        </div>
      </div>
    );
  }
}

export default Waiting;
