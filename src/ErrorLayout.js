import React, { Component } from "react";

class ErrorLayout extends Component {
  state = {
    error: false
  };

  static getDerivedStateFromError() {
    // Update state so the next render will show the fallback UI.
    return { error: true };
  }

  render() {
    const { children } = this.props;
    const { error } = this.state;
    return error ? (
      <div>
        <h1>
          Oh no, an error has ocurred{" "}
          <span aria-label="mind-blown" role="img">
            🤯
          </span>
        </h1>
      </div>
    ) : (
      children
    );
  }
}

export default ErrorLayout;
