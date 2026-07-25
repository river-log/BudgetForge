import { Component } from "react";
import RouteErrorFallback from "./RouteErrorFallback";

class AppErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("BudgetForge application error:", error, errorInfo.componentStack);
  }

  componentDidUpdate(previousProps) {
    if (
      this.state.hasError &&
      previousProps.resetKey !== this.props.resetKey
    ) {
      this.setState({ hasError: false });
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <RouteErrorFallback
          onReload={this.handleReload}
          onRetry={this.handleRetry}
        />
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
