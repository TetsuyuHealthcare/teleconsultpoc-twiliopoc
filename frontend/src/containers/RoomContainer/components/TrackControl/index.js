import React, { Component } from 'react';
import { AudioOutlined, VideoCameraOutlined } from '@ant-design/icons';
import { Button } from 'antd';

import './index.scss';

class TrackControl extends Component {
  render() {
    const { onTrackToggle, trackKind, trackDisabled } = this.props;
    const iconStyle = { color: trackDisabled ? '#ffffff' : '#1890ff' };
    const buttonStyle = { background: trackDisabled ? '#ff4d4f' : '#ffffff' };

    let icon;
    switch (trackKind) {
      case 'audio':
        icon = <AudioOutlined style={iconStyle} />;
        break;
      case 'video':
        icon = <VideoCameraOutlined style={iconStyle} />;
        break;
      default:
        icon = null;
    }

    return (
      <div className={`track-control ${trackKind}`}>
        <Button
          shape='circle'
          size='large'
          icon={icon}
          style={buttonStyle}
          onClick={onTrackToggle}
        />
      </div>
    );
  }
}

export default TrackControl;
