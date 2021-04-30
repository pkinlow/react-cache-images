import React, { Component } from "react";
import appLogger from "../../helpers/appLogger";

export default class AppError extends Component {
  render() {
    // TODO: Find Nice Generic Message To Display To Donor
    const defaultError = (
      <p>
        <i className="fa fa-times-circle" aria-hidden="true"></i> Oops, it looks like we ran into an error. Please try
        again or contact us at <a href="tel:18885116463">1-888-511-6463</a>. We&#39;d love to help!
      </p>
    );

    const message = this.props.message || this.props.children || defaultError;
    const error = this.props.error;

    // TODO: Rework Logging Here
    if (error) {
      // Log App Error
      appLogger(
        {
          reference: "AppError",
          userMessage: message,
          errorMessage: (error && error.message) || error
        },
        "error"
      );
    }

    // TODO: Include Error Message HTML and Styles
    return (
      <div className="App AppError">
        <div className="alert alert-danger" role="alert">
          <span className="glyphicon glyphicon-warning-sign" aria-hidden="true"></span> {message}
        </div>
      </div>
    );
  }
}
