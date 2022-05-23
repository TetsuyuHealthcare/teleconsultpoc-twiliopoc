import React, { Component } from 'react';
import { isNil } from 'lodash';

import TrackControl from '../TrackControl';
import { SHARE_SCREEN_TRACK_NAME } from '../../../../constants';
import './index.scss';

class Track extends Component {
  constructor(props) {
    super(props);

    this.state = {
      disabled: false,
    };
    this.trackRef = React.createRef();
    this.trackAttachment = null;
  }

  componentDidMount() {
    const { track } = this.props;

    if (!track || track.kind === 'data') {
      return;
    }

    const trackContainer = this.trackRef.current;
    const attachment = track.attach();

    this.trackAttachment = attachment;
    trackContainer.appendChild(attachment);
    this.updateTrackSize();

    window.addEventListener('resize', this.updateTrackSize);
  }

  componentDidUpdate(prevProps) {
    const { volume } = this.props;

    if (
      volume !== prevProps.volume &&
      !isNil(this.trackAttachment) &&
      !isNil(this.trackAttachment.volume)
    ) {
      this.trackAttachment.volume = volume;
    }
    this.updateTrackSize();
  }

  componentWillUnmount() {
    const { track } = this.props;

    if (track.stop) {
      track.stop();
    }
    track.detach();

    window.removeEventListener('resize', this.updateTrackSize);
  }

  updateTrackSize = () => {
    const { track } = this.props;
    const trackContainer = this.trackRef.current;

    if (!track || track.kind !== 'video') {
      return;
    }

    switch(track.name) {
      case SHARE_SCREEN_TRACK_NAME: {
        trackContainer.style.height = 'auto';
        break;
      }
      default: {
        const { width, height } = track.dimensions;

        trackContainer.style.height = `${
          (trackContainer.offsetWidth * (height || 3)) / (width || 4)
        }px`;
      }
    }
  }

  toggleTrack = () => {
    const { track } = this.props;
    const { disabled } = this.state;
    const nextDisabled = !disabled;

    if (nextDisabled) {
      track.disable();
    } else {
      track.enable();
    }

    this.setState({
      disabled: nextDisabled,
    });
  };

  render() {
    const { track, hasTrackControl } = this.props;
    const { disabled } = this.state;

    return (
      <div className={`track ${track.kind}`} ref={this.trackRef}>
        {hasTrackControl && track.kind !== 'data' && (
          <TrackControl
            onTrackToggle={this.toggleTrack}
            trackDisabled={disabled}
            trackKind={track.kind}
          />
        )}
      </div>
    );
  }
}

export default Track;
