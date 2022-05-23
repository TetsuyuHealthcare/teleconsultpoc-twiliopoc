import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

import { Spin, Alert } from 'antd';
import Setup from './components/Setup';
import Waiting from './components/Waiting';
import Room from './components/Room';

import {
  fetchRoom,
  updatePariticipant,
  generateVideoToken,
} from '../../actions/roomActions';

import './index.scss';

class RoomContainer extends Component {
  constructor(props) {
    super(props);

    this.state = {
      initialized: false,
    };
  }

  componentDidMount() {
    const {
      fetchRoom,
      match: { params },
    } = this.props;

    fetchRoom(params.id, params.participantId).then(() => {
      this.setState({ initialized: true });
    });
  }

  handleSubmitSetup = (values) => {
    const { currentRoom, currentParticipant, updatePariticipant } = this.props;
    updatePariticipant(currentRoom.id, currentParticipant.id, values);
  };

  handleJoinRoom = () => {
    const { generateVideoToken, currentRoom, currentParticipant } = this.props;

    generateVideoToken({
      meetId: currentRoom.id,
      participantId: currentParticipant.id,
    });
  };

  renderLoader = () => {
    return (
      <div className='room-container'>
        <Spin />
      </div>
    );
  };

  renderInvalidAlert = () => {
    return (
      <div className='room-container'>
        <Alert message='Invalid room or participant' type='error' />
      </div>
    );
  };

  renderSetup = () => {
    return (
      <div className='room-container'>
        <Setup onFinish={this.handleSubmitSetup} />
      </div>
    );
  };

  renderWaiting = () => {
    const { currentRoom, currentParticipant } = this.props;

    return (
      <div className='room-container'>
        <Waiting
          currentRoom={currentRoom}
          currentParticipant={currentParticipant}
          onJoin={this.handleJoinRoom}
        />
      </div>
    );
  };

  renderRoom = () => {
    const { currentRoom, currentParticipant, currentVideoToken } = this.props;

    return (
      <div className='room-container'>
        <Room
          currentRoom={currentRoom}
          currentParticipant={currentParticipant}
          currentVideoToken={currentVideoToken}
        />
      </div>
    );
  };

  render() {
    const {
      loading,
      currentRoom,
      currentParticipant,
      currentVideoToken,
    } = this.props;
    const { initialized } = this.state;

    const valid = !!currentRoom && !!currentParticipant;
    const doneSetup = valid && !!currentParticipant.name;
    const joinedRoom = !!currentVideoToken;

    if (!initialized || loading) {
      return this.renderLoader();
    }

    if (!valid) {
      return this.renderInvalidAlert();
    }

    if (!doneSetup) {
      return this.renderSetup();
    }

    if (!joinedRoom) {
      return this.renderWaiting();
    }

    return this.renderRoom();
  }
}

const mapStateToProps = ({ room }) => {
  return {
    loading: room.loading,
    currentRoom: room.currentRoom,
    currentParticipant: room.currentParticipant,
    currentVideoToken: room.currentVideoToken,
  };
};

export default withRouter(
  connect(mapStateToProps, {
    fetchRoom,
    updatePariticipant,
    generateVideoToken,
  })(RoomContainer),
);
