import React, { Component } from 'react';

export default class AppInactive extends Component {
  componentDidMount() {
    this.timeoutId = this.startTimeout();
  }

  componentWillUnmount() {
    clearTimeout(this.timeoutId);
  }

  startTimeout() {
    const timeout = +this.props.timeout || 20 * 1000;
    const setAppStatus = this.props.setAppStatus;

    return setTimeout(() => {
      setAppStatus('error');
    }, timeout);
  }

  render() {
    return (
      <div className="App AppInactive">{this.props.children}</div>
    );
  }
}