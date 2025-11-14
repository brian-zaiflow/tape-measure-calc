import { Component, ErrorInfo, ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  handleReset = (): void => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
          <div className="max-w-md w-full space-y-6 text-center">
            <div className="flex justify-center">
              <div className="rounded-full bg-destructive/10 p-4">
                <AlertCircle className="h-12 w-12 text-destructive" />
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl font-semibold tracking-tight">
                Something went wrong
              </h1>
              <p className="text-sm text-muted-foreground">
                The calculator encountered an unexpected error. You can try resetting the app or reloading the page.
              </p>
            </div>

            {this.state.error && (
              <details className="text-left">
                <summary className="cursor-pointer text-sm text-muted-foreground hover:text-foreground">
                  Technical details
                </summary>
                <pre className="mt-2 text-xs bg-muted p-3 rounded-md overflow-x-auto">
                  {this.state.error.message}
                  {this.state.error.stack && `\n\n${this.state.error.stack}`}
                </pre>
              </details>
            )}

            <div className="flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button onClick={this.handleReset} variant="default">
                Reset Calculator
              </Button>
              <Button onClick={this.handleReload} variant="outline">
                Reload Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
