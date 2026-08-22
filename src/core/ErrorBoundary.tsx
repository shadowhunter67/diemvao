import { Component, type ErrorInfo, type ReactNode } from 'react';

interface ErrorBoundaryProps {
  children: ReactNode;
  onGoHome: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Chặn lỗi runtime render (P3) để 1 route/school module lỗi không làm trắng toàn bộ app. Dùng
 * `key={pathname}` ở nơi gọi (xem App.tsx) để boundary tự remount/reset khi đổi route — nếu không,
 * `hasError` sẽ dính mãi kể cả sau khi user đã "Về trang chủ" sang route khác.
 *
 * KHÔNG nuốt lỗi âm thầm: luôn console.error đầy đủ error + componentStack. KHÔNG hiển thị
 * message/stack lỗi thật lên UI (tránh rò rỉ chi tiết implementation cho người dùng cuối).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary] Lỗi runtime không bắt được:', error, info.componentStack);
  }

  handleRetry = (): void => {
    this.setState({ hasError: false });
  };

  render(): ReactNode {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-bg px-4 text-center">
        <p className="text-lg font-semibold text-ink">Đã có lỗi xảy ra</p>
        <p className="max-w-md text-sm text-muted">
          Trang này gặp sự cố khi hiển thị. Bạn có thể thử tải lại phần này, hoặc quay về trang chủ — dữ liệu hồ sơ đã lưu của bạn không bị
          mất.
        </p>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={this.handleRetry}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Thử lại
          </button>
          <button
            type="button"
            onClick={this.props.onGoHome}
            className="rounded-md border border-ink/10 px-4 py-2 text-sm font-medium text-muted hover:text-ink"
          >
            Về trang chủ
          </button>
        </div>
      </div>
    );
  }
}
