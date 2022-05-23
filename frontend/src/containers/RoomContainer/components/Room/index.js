import React, { Component, Fragment } from 'react';
import { withRouter } from 'react-router-dom';
import { debounce } from 'lodash';
import TwilioVideo from 'twilio-video';

import {
  SoundOutlined,
  LogoutOutlined,
  FundProjectionScreenOutlined,
} from '@ant-design/icons';
import { Popover, Button, Space, Spin, Slider, message } from 'antd';
import Participant from '../Participant';
import Track from '../Track';

import { SHARE_SCREEN_TRACK_NAME } from '../../../../constants';
import './index.scss';

class Room extends Component {
  constructor(props) {
    super(props);

    this.state = {
      twilioRoom: null,
      twilioParticipants: [],
      participantItemWidth: '31.5%',
      screenTrackFromLocal: null,
      screenTrack: null,
      volume: 1,
    };
  }

  componentDidMount() {
    const { currentVideoToken, currentRoom } = this.props;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      message.error('Your browser does not support getting media devices.');
      return;
    }

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((mediaStream) => {
        this.connectToTwilioRoom(currentVideoToken, {
          name: currentRoom.id,
          tracks: mediaStream.getTracks(),
        });
      })
      .catch((error) => {
        console.log('Could not get audio and video media:', error.message);
        message.warning('Join meet without video.');

        navigator.mediaDevices
          .getUserMedia({
            audio: true,
          })
          .then((mediaStream) => {
            this.connectToTwilioRoom(currentVideoToken, {
              name: currentRoom.id,
              tracks: mediaStream.getTracks(),
            });
          })
          .catch((error) => {
            console.log('Could not get audio media:', error.message);
            // eslint-disable-next-line max-len
            message.error('Unable to join meet. Please check your camera, microphone devices and permissions.');
          });
      });

    window.addEventListener('beforeunload', () => {
      this.leaveRoom({ byManually: false });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      twilioRoom,
      twilioParticipants,
    } = this.state;

    const {
      twilioRoom: prevTwilioRoom,
      twilioParticipants: prevTwilioParticipants,
    } = prevState;

    if (
      (!prevTwilioRoom && !!twilioRoom) ||
        twilioParticipants.length !== prevTwilioParticipants.length
    ) {
      this.adjustParticipantItemWidth(twilioParticipants.length);
    }
  }

  componentWillUnmount() {
    this.leaveRoom();
  }

  connectToTwilioRoom = (token, options) => {
    TwilioVideo.connect(token, options)
      .then((twilioRoom) => {
        this.setState({
          twilioRoom,
        });
        twilioRoom.on('participantConnected', this.participantConnected);
        twilioRoom.on('participantDisconnected', this.participantDisconnected);
        twilioRoom.participants.forEach(this.participantConnected);
      })
      .catch((error) => {
        console.log('Could not connect to the twilio room:', error.message);
      });
  }

  participantConnected = (twilioParticipant) => {
    const { twilioParticipants } = this.state;
    const nextTwilioParticipants = [...twilioParticipants, twilioParticipant];

    this.setState({ twilioParticipants: nextTwilioParticipants });
  }

  participantDisconnected = (twilioParticipant) => {
    const { twilioParticipants } = this.state;
    const nextTwilioParticipants = twilioParticipants.filter(
      (p) => p.identity !== twilioParticipant.identity,
    );

    this.setState({ twilioParticipants: nextTwilioParticipants });
  }

  leaveRoom = (options = {}) => {
    const { twilioRoom } = this.state;

    if (twilioRoom) {
      twilioRoom.localParticipant.tracks.forEach((trackPublication) => {
        trackPublication.track.stop();
      });
      twilioRoom.disconnect();
    }

    this.setState({
      twilioRoom: null,
      twilioParticipants: [],
    });

    if (options.byManually) {
      const { history } = this.props;
      history.replace('/');
    }
  }

  startSharingScreen = () => {
    const { twilioRoom } = this.state;

    if (!twilioRoom || !twilioRoom.localParticipant) {
      return;
    }

    navigator.mediaDevices
      .getDisplayMedia({
        video: true,
      })
      .then((stream) => {
        const streamVideoTrack = stream.getVideoTracks()[0];
        streamVideoTrack.addEventListener('ended', () => {
          this.stopSharingScreen();
        });
        const screenTrack = new TwilioVideo.LocalVideoTrack(streamVideoTrack, {
          name: SHARE_SCREEN_TRACK_NAME,
        });
        twilioRoom.localParticipant.publishTrack(screenTrack);
      })
      .catch((error) => {
        console.log('Unable to get display media for sharing screen');
        throw error;
      });
  }

  stopSharingScreen = () => {
    const { twilioRoom } = this.state;

    twilioRoom.localParticipant.tracks.forEach((publication) => {
      const { track } = publication;

      if (track && track.name === SHARE_SCREEN_TRACK_NAME) {
        twilioRoom.localParticipant.unpublishTrack(track);
        twilioRoom.localParticipant.emit('trackUnpublished', publication);
        track.stop();
      }
    });
  }

  addScreenTrack = (track, fromLocal) => {
    this.setState({
      screenTrack: track,
      screenTrackFromLocal: fromLocal,
    });
  }

  removeScreenTrack = () => {
    this.setState({
      screenTrack: null,
      screenTrackFromLocal: null,
    });
  }

  changeVolume = (volume) => {
    this.setState({
      volume,
    });
  }

  adjustParticipantItemWidth = (participantCount) => {
    let participantItemWidth = '31.5%';

    if (participantCount === 0) {
      participantItemWidth = '60%';
    }

    if (participantCount === 1) {
      participantItemWidth = '45%';
    }

    if (participantCount >= 6) {
      participantItemWidth = '25%';
    }

    this.setState({ participantItemWidth });
  }

  render() {
    const {
      twilioRoom,
      twilioParticipants,
      participantItemWidth,
      screenTrackFromLocal,
      screenTrack,
      volume,
    } = this.state;

    if (!twilioRoom) {
      return <Spin />;
    }

    return (
      <div className='room'>
        <div className={`content ${screenTrack ? 'sharing' : null}`}>
          {screenTrack && (
            <div className='screens'>
              <Track track={screenTrack} hasTrackControl={false} />
            </div>
          )}
          <div className='videos'>
            {twilioRoom.localParticipant && (
              <div className='item' style={{ width: participantItemWidth }}>
                <Participant
                  isLocal
                  volume={volume}
                  participant={twilioRoom.localParticipant}
                  onConnectedScreenTrack={this.addScreenTrack}
                  onDisconnectedScreenTrack={this.removeScreenTrack}
                />
              </div>
            )}
            <Fragment>
              {twilioParticipants.map((participant) => (
                <div
                  key={participant.sid}
                  className='item'
                  style={{ width: participantItemWidth }}
                >
                  <Participant
                    isLocal={false}
                    volume={volume}
                    participant={participant}
                    onConnectedScreenTrack={this.addScreenTrack}
                    onDisconnectedScreenTrack={this.removeScreenTrack}
                  />
                </div>
              ))}
            </Fragment>
          </div>
        </div>
        <div className='toolbar'>
          <Space size='middle'>
            <Popover
              content={
                <Slider
                  min={0}
                  max={1}
                  step={0.01}
                  tipFormatter={null}
                  defaultValue={volume}
                  onChange={debounce(this.changeVolume, 250)}
                  style={{ width: 100 }}
                />
              }
            >
              <Button
                type='primary'
                size='large'
                shape='round'
                icon={<SoundOutlined />}
              >
                Volume
              </Button>
            </Popover>
            <Button
              danger
              size='large'
              type='primary'
              shape='round'
              icon={<LogoutOutlined />}
              onClick={() => this.leaveRoom({ byManually: true })}
            >
              Exit
            </Button>
            {(!screenTrack || (!!screenTrack && screenTrackFromLocal)) && (
              <Button
                size='large'
                type='primary'
                shape='round'
                danger={!!screenTrack}
                icon={<FundProjectionScreenOutlined />}
                onClick={
                  screenTrack
                    ? this.stopSharingScreen
                    : this.startSharingScreen
                }
              >
                {screenTrack ? 'Stop Sharing' : 'Share Screen'}
              </Button>
            )}
          </Space>
        </div>
      </div>
    );
  }
}

export default withRouter(Room);
