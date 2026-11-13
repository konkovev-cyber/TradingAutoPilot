import React, { Component, type ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class AdminErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[Admin ErrorBoundary caught error]:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6 text-white">
          <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-2xl">
            <div className="w-14 h-14 rounded-full bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
              <AlertTriangle size={28} />
            </div>
            <h2 className="text-xl font-bold text-white">Что-то пошло не так</h2>
            <p className="text-sm text-gray-400">
              Произошла ошибка при отображении раздела. Мы уже зафиксировали её.
            </p>
            {this.state.error?.message && (
              <pre className="text-xs text-rose-300/80 bg-black/40 p-3 rounded-lg text-left overflow-x-auto border border-gray-800">
                {this.state.error.message}
              </pre>
            )}
            <div className="flex gap-3 justify-center pt-2">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2.5 bg-brand-blue hover:bg-blue-600 text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <RefreshCw size={16} /> Перезагрузить
              </button>
              <Link
                to="/admin"
                onClick={() => this.setState({ hasError: false, error: null })}
                className="flex items-center gap-2 px-4 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white rounded-lg text-sm font-medium transition-colors cursor-pointer"
              >
                <Home size={16} /> В обзор
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

