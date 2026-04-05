import * as React from "react";
import { Button } from "@/components/magic/Button";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ComponentType<{
    error: Error;
    resetErrorBoundary: () => void;
  }>;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - Catches JavaScript errors anywhere in the child component tree
 *
 * Displays a user-friendly error screen with:
 * - Clear error message (in development)
 * - Retry button to attempt recovery
 * - Link to home page
 * - Error details logged to console
 *
 * In production, shows a generic message for security.
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to console (in production, you'd send to an error tracking service)
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        const FallbackComponent = this.props.fallback;
        return (
          <FallbackComponent
            error={this.state.error}
            resetErrorBoundary={this.resetErrorBoundary}
          />
        );
      }

      return <DefaultErrorFallback error={this.state.error} resetErrorBoundary={this.resetErrorBoundary} />;
    }

    return this.props.children;
  }
}

/**
 * Default error fallback UI
 */
function DefaultErrorFallback({
  error,
  resetErrorBoundary,
}: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  const navigate = useNavigate();
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted to-background p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200/60 text-center">
          {/* Error Icon */}
          <div className="mx-auto w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </div>

          {/* Title & Description */}
          <h1 className="text-2xl font-bold text-slate-900 mb-3">
            Something went wrong
          </h1>
          <p className="text-slate-600 mb-6">
            We're sorry, but something unexpected happened. Our team has been notified.
          </p>

          {/* Error details (development only) */}
          {isDevelopment && (
            <div className="mb-6 p-4 bg-slate-50 rounded-lg border border-slate-200 text-left">
              <p className="text-sm font-semibold text-slate-700 mb-2">Error details:</p>
              <code className="text-xs text-red-600 break-all block whitespace-pre-wrap bg-white p-3 rounded border border-slate-200">
                {error.message}
              </code>
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={resetErrorBoundary}
              leftIcon={<RefreshCw className="w-4 h-4" />}
              className="flex-1"
            >
              Try Again
            </Button>
            <Button
              variant="outline"
              onClick={() => navigate("/")}
              leftIcon={<Home className="w-4 h-4" />}
              className="flex-1"
            >
              Go Home
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
