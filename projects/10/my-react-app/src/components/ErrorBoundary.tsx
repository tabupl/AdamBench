import { Component, Error as ReactError } from 'react';

type Props = { children: React.ReactNode };

type State = { hasError: boolean; error?: ReactError };

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: ReactError) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: any) {
    console.error('ErrorBoundary caught:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '2rem', color: 'red' }}>
          <h2>Something went wrong.</h2>
          <details style={{ marginTop: '0.5rem' }}>
            <summary>View details</summary>
            {this.state.error}
          </details>
        </div>
      );
    }
    return this.props.children;
  }
}

// Default export for React to pick up
export default ErrorBoundary;