import { Component, type ReactNode } from 'react';

export function ErrorBoundary({ children }: { children: ReactNode }) {
  return <ErrorInner>{children}</ErrorInner>;
}

class ErrorInner extends Component<{ children: ReactNode }, { err?: string }> {
  state = { err: undefined as string | undefined };
  static getDerivedStateFromError(e: unknown) {
    return { err: e instanceof Error ? e.message : 'Something went wrong' };
  }
  render() {
    if (this.state.err)
      return (
        <div role="alert" className="card border-error-default">
          <h2 className="font-semibold text-error-default">Something went wrong</h2>
          <p className="text-sm text-secondary">{this.state.err}</p>
          <button
            className="mt-3 px-3 py-1 rounded bg-surface-dark text-inverse"
            onClick={() => window.location.reload()}
          >
            Reload
          </button>
        </div>
      );
    return this.props.children;
  }
}
