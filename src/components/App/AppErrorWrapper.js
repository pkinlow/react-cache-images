import React, { Component } from 'react';
import AppError from './AppError';

export class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, info) {
    // TODO: Possibly Include appLogger Here
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return <AppError />;
    }

    return this.props.children; 
  }
}

export default function appErrorWrapper(WrappedComponent) {
  return class AppWrapper extends Component {
    render() {
      return (
        <AppErrorBoundary>
          <WrappedComponent />
        </AppErrorBoundary>
      );
    }
  };
} 