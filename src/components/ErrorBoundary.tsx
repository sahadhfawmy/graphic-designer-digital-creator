import React from 'react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  message: string;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, message: '' };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      message: error?.message || 'An unexpected error occurred.',
    };
  }

  override componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('Application ErrorBoundary caught:', error, info);
  }

  override render() {
    if (this.state.hasError) {
      let friendly = 'Something went wrong while syncing with the studio database.';
      try {
        const parsed = JSON.parse(this.state.message);
        if (parsed?.error) {
          friendly = parsed.error.includes('permission') || parsed.error.includes('PERMISSION_DENIED')
            ? 'You do not have permission to perform this database action. Please verify your signed-in account.'
            : parsed.error;
        }
      } catch {
        if (this.state.message) {
          friendly = this.state.message;
        }
      }

      return (
        <div className="flex min-h-screen items-center justify-center bg-bg px-5 text-ink">
          <div className="w-full max-w-md rounded-2xl border border-line bg-panel p-6 shadow-2xl">
            <p className="label !text-gold">Studio Notice</p>
            <h1 className="mt-2 font-display text-2xl italic text-ink">Unable to complete request</h1>
            <p className="mt-3 text-[0.84rem] leading-relaxed text-muted">{friendly}</p>
            <button
              type="button"
              onClick={() => this.setState({ hasError: false, message: '' })}
              className="btn btn-ghost mt-6 !px-5 !py-3 !text-[0.65rem]"
            >
              Return to portfolio
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
