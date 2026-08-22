import type { ReactElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it, vi } from 'vitest';
import { ErrorBoundary } from './ErrorBoundary';

/**
 * `react-dom/server`'s legacy synchronous renderer (renderToStaticMarkup) does NOT catch
 * render-phase errors via error boundaries the way the real client reconciler does (a known React
 * SSR limitation, unrelated to this component) — a child that throws just propagates out of
 * renderToStaticMarkup instead of being caught. Real client-side behavior (getDerivedStateFromError
 * → fallback UI) can't be exercised end-to-end without a real DOM/reconciler (jsdom, not in this
 * repo). Instead we test the class's pieces directly, which don't need a reconciler at all:
 * getDerivedStateFromError as a plain static call, componentDidCatch's logging as a plain method
 * call, and render() output (both branches) by invoking it directly and only feeding the resulting
 * static element tree to renderToStaticMarkup.
 */
describe('ErrorBoundary', () => {
  it('getDerivedStateFromError chuyển sang hasError=true', () => {
    expect(ErrorBoundary.getDerivedStateFromError()).toEqual({ hasError: true });
  });

  it('componentDidCatch log lỗi ra console thay vì nuốt âm thầm', () => {
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const instance = new ErrorBoundary({ children: null, onGoHome: () => {} });
    instance.componentDidCatch(new Error('boom'), { componentStack: 'x' });
    expect(spy).toHaveBeenCalled();
    spy.mockRestore();
  });

  it('render() không có lỗi thì trả về đúng children', () => {
    const instance = new ErrorBoundary({ children: <p>nội dung ổn</p>, onGoHome: () => {} });
    const html = renderToStaticMarkup(instance.render() as ReactElement);
    expect(html).toContain('nội dung ổn');
  });

  it('render() khi hasError=true trả về fallback tiếng Việt kèm nút Thử lại/Về trang chủ, không lộ message lỗi thật', () => {
    const instance = new ErrorBoundary({ children: <p>không nên thấy</p>, onGoHome: () => {} });
    instance.state = { hasError: true };
    const html = renderToStaticMarkup(instance.render() as ReactElement);

    expect(html).toContain('Đã có lỗi xảy ra');
    expect(html).toContain('Thử lại');
    expect(html).toContain('Về trang chủ');
    expect(html).not.toContain('không nên thấy');
  });
});
