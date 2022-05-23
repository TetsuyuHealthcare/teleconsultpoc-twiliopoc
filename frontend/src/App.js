import React, { Component } from 'react';
import Routes from './routes';

import 'antd/dist/antd.css';
import './styles/index.scss';

class App extends Component {
  render() {
    return (
      <div className='app-container'>
        <Routes />
      </div>
    );
  }
}

export default App;
