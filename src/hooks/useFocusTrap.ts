import { useEffect, useRef } from 'react';

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

/**
 * Trả về phần tử nên nhận focus khi Tab/Shift+Tab đi tới rìa danh sách focusable, để bẫy focus
 * bên trong dialog. Tách riêng khỏi hook (phụ thuộc DOM thật) để test được bằng vitest env=node.
 */
export function computeTrapFocusTarget<T>(items: readonly T[], activeItem: T | null, shiftKey: boolean): T | undefined {
  if (items.length === 0) return undefined;
  const first = items[0];
  const last = items[items.length - 1];
  if (shiftKey && activeItem === first) return last;
  if (!shiftKey && activeItem === last) return first;
  return undefined;
}

/**
 * Focus trap cho dialog modal: khi mount, focus phần tử focusable đầu tiên trong container; Tab/
 * Shift+Tab không thoát ra ngoài; Escape gọi onClose; khi unmount, focus trả lại phần tử đã trigger
 * mở dialog. Dùng cho component chỉ mount trong lúc dialog đang mở (điều kiện `active &&`).
 */
export function useFocusTrap<T extends HTMLElement>(onClose: () => void) {
  const containerRef = useRef<T>(null);
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;

  useEffect(() => {
    const container = containerRef.current;
    const previouslyFocused = document.activeElement as HTMLElement | null;

    const getFocusables = () => Array.from(container?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR) ?? []);
    const first = getFocusables()[0];
    (first ?? container)?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') {
        event.preventDefault();
        onCloseRef.current();
        return;
      }
      if (event.key !== 'Tab') return;
      const items = getFocusables();
      const target = computeTrapFocusTarget(items, document.activeElement as HTMLElement | null, event.shiftKey);
      if (target) {
        event.preventDefault();
        target.focus();
      } else if (items.length === 0) {
        event.preventDefault();
      }
    }

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previouslyFocused?.focus();
    };
  }, []);

  return containerRef;
}
