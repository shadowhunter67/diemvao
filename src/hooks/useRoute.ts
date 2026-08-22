import { useCallback, useEffect, useState } from 'react';

interface Route {
  pathname: string;
  navigate: (path: string) => void;
  /** Thay pathname hiện tại không tạo history entry mới (dùng cho canonicalize link cũ). */
  redirect: (path: string) => void;
}

/**
 * Routing tối giản không dùng thư viện — chỉ cần vài route phẳng (`/`, `/hcmut`, `/uit`...),
 * không cần react-router. Đồng bộ với `window.location.pathname` qua `popstate`.
 */
export function useRoute(): Route {
  const [pathname, setPathname] = useState(() => (typeof window === 'undefined' ? '/' : window.location.pathname));

  useEffect(() => {
    function onPopState() {
      setPathname(window.location.pathname);
    }
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, []);

  const navigate = useCallback((path: string) => {
    window.history.pushState(null, '', path);
    setPathname(window.location.pathname);
  }, []);

  const redirect = useCallback((path: string) => {
    window.history.replaceState(null, '', path + window.location.search);
    setPathname(window.location.pathname);
  }, []);

  return { pathname, navigate, redirect };
}
