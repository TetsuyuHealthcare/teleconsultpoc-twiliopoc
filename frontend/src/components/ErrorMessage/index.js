import React, { Component, Fragment } from 'react';
import { Alert } from 'antd';

import { capitalize } from '../../utils/stringUtils';
import './index.scss';

class ErrorMessage extends Component {
  render() {
    const { errors } = this.props;

    if (!errors || !Object.entries(errors).length) {
      return null;
    }

    return (
      <div className='error-message-container'>
        <Alert
          description={
            <Fragment>
              {Object.entries(errors)
                .map(([key, value]) => `${capitalize(key)} ${value[0]}`)
                .map((error) => (
                  <Fragment key={error}>
                    {error}
                    <br />
                  </Fragment>
                ))}
            </Fragment>
          }
          message='Messages'
          type='error'
          showIcon
        />
      </div>
    );
  }
}

export default ErrorMessage;
