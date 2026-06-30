"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[50vh] flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-300">
          <div className="w-24 h-24 bg-rose-100 dark:bg-rose-900/30 rounded-full flex items-center justify-center mb-6 border-4 border-rose-200 dark:border-rose-800 animate-pulse">
            <AlertTriangle className="w-12 h-12 text-rose-500 dark:text-rose-400" />
          </div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
            عذراً، حدث خطأ غير متوقع!
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mb-8 max-w-md font-medium text-lg leading-relaxed">
            حدث خلل مفاجئ أثناء تشغيل هذه الصفحة. نحن نعتذر عن هذا الانقطاع.
            {this.state.error && (
              <span className="block mt-4 p-3 bg-slate-100 dark:bg-slate-800 rounded-lg text-sm font-mono text-left text-rose-500 overflow-hidden text-ellipsis whitespace-nowrap" dir="ltr">
                {this.state.error.message}
              </span>
            )}
          </p>
          <button
            onClick={() => {
              this.setState({ hasError: false, error: null });
              window.location.reload();
            }}
            className="flex items-center gap-3 bg-slate-900 dark:bg-white text-white dark:text-slate-900 px-8 py-4 rounded-xl font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl hover:shadow-2xl"
          >
            <RefreshCcw className="w-5 h-5" />
            تحديث الصفحة
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
