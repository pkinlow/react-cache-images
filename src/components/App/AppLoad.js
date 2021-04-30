import React, { Component } from 'react';

export default class AppLoad extends Component {
  componentDidMount() {
    this.timeoutId = this.startTimeout();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  startTimeout() {
    const timeout = +this.props.timeout || 60 * 1000;
    const setAppStatus = this.props.setAppStatus;

    return setTimeout(() => {
      setAppStatus('error');
    }, timeout);
  }

  render() {
    // TODO: Include Load Graphic
    return (
      <div className="App AppLoad">
        <div className="spinner--wv-star">
          <div className="double-bounce1"></div>
          <div className="double-bounce2"></div>
        </div>
      </div>
    );
  }
}