import React, { Component } from "react";

/**
 * ErrorBoundary — Catches JavaScript errors in child components,
 * logs them, and displays a fallback UI instead of crashing
 * the entire application.
 *
 * This is a best practice for production React applications
 * and demonstrates defensive programming.
 */
export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error("[ErrorBoundary] Caught error:", error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-[var(--bg-primary)] text-[var(--text-primary)]">
          <div className="max-w-md text-center">
            <div className="mb-6">
              <span className="text-6xl">⚠️</span>
            </div>

            <h2 className="text-xl font-bold mb-3">
              Oops! Terjadi Kesalahan
            </h2>

            <p className="text-sm opacity-70 mb-6 leading-relaxed">
              Aplikasi mengalami error yang tidak terduga. Silakan coba lagi
              atau muat ulang halaman.
            </p>

            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="cursor-pointer text-xs opacity-50 hover:opacity-80 transition">
                  Detail Error (untuk developer)
                </summary>
                <pre className="mt-2 p-3 rounded-lg bg-[var(--text-primary)]/5 text-xs overflow-x-auto">
                  {this.state.error.toString()}
                </pre>
              </details>
            )}

            <div className="flex gap-3 justify-center">
              <button
                onClick={this.handleRetry}
                className="
                  px-6 py-2.5 rounded-xl font-semibold text-sm
                  bg-[var(--blue-primary)] text-white
                  hover:brightness-110 active:brightness-95
                  transition-all duration-200
                "
              >
                Coba Lagi
              </button>

              <button
                onClick={() => window.location.reload()}
                className="
                  px-6 py-2.5 rounded-xl font-semibold text-sm
                  border border-[var(--text-primary)]/30 text-[var(--text-primary)]
                  hover:bg-[var(--text-primary)]/5
                  transition-all duration-200
                "
              >
                Muat Ulang
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
