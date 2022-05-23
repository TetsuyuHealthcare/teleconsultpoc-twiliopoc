import React, { Component } from 'react';
import Track from '../Track';

import { SHARE_SCREEN_TRACK_NAME } from '../../../../constants';
import './index.scss';

class Participant extends Component {
  constructor(props) {
    super(props);

    this.state = {
      tracks: [],
    };
  }

  componentDidMount() {
    const { isLocal, participant } = this.props;

    this.setState({
      tracks: this.trackPublicationsToTracks(participant.tracks),
    });

    participant.on('trackSubscribed', this.addTrack);
    participant.on('trackUnsubscribed', this.removeTrack);
    participant.on('trackPublished', (publication) => {
      if (publication.track) {
        this.addTrack(publication.track);
      }
    });
    participant.on('trackUnpublished', (publication) => {
      if (publication.track) {
        this.removeTrack(publication.track);
      }
    });

    if (!isLocal) {
      participant.on('trackDisabled', () => {});
      participant.on('trackEnabled', () => {});
    }
  }

  componentWillUnmount() {
    const { participant } = this.props;
    participant.removeAllListeners();
  }

  trackPublicationsToTracks = (trackMap) => {
    return Array.from(trackMap.values())
      .map((publication) => publication.track)
      .filter((track) => track !== null);
  };

  addTrack = (addedTrack) => {
    const { tracks } = this.state;
    const { isLocal, onConnectedScreenTrack } = this.props;

    if (addedTrack.name === SHARE_SCREEN_TRACK_NAME) {
      onConnectedScreenTrack(addedTrack, isLocal);
    } else {
      this.setState({ tracks: [...tracks, addedTrack] });
    }
  };

  removeTrack = (removedTrack) => {
    const { tracks } = this.state;
    const { isLocal, onDisconnectedScreenTrack } = this.props;

    if (removedTrack.name === SHARE_SCREEN_TRACK_NAME) {
      onDisconnectedScreenTrack(removedTrack, isLocal);
    } else {
      this.setState({
        tracks: tracks.filter((track) => track !== removedTrack),
      });
    }
  };

  render() {
    const { tracks } = this.state;
    const { participant, isLocal, volume } = this.props;

    return (
      <div className='participant'>
        <div className='indentity'>
          {participant.identity.split('__')[1]}
          {isLocal ? ' (you)' : null}
        </div>
        {tracks.map((track) => (
          <Track
            key={track.name}
            track={track}
            volume={volume}
            hasTrackControl={isLocal}
          />
        ))}
      </div>
    );
  }
}

export default Participant;
