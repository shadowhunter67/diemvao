import { Suspense, useEffect } from 'react';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { MultiSchoolComparisonPage } from './components/MultiSchoolComparisonPage';
import { useRoute } from './hooks/useRoute';
import { schoolRegistry } from './schools';
import { setPageMeta } from './core/pageMeta';
import { siteConfig } from './config/site';
import { ApplicantProfileProvider } from './core/ApplicantProfileContext';
import { resolveSchoolId } from './core/resolveSchoolId';
import { ErrorBoundary } from './core/ErrorBoundary';

/** Fallback hiện trong lúc chunk của 1 trường (code-split, `React.lazy`) đang tải — thường chỉ
 * thấy thoáng qua trên mạng chậm/lần đầu vào trường đó (chunk sau được browser cache). */
function RouteLoadingFallback() {
  return (
    <div className="flex min-h-svh items-center justify-center bg-bg">
      <p className="text-sm text-muted">Đang tải…</p>
    </div>
  );
}

/**
 * App shell: chỉ biết routing + tra schoolRegistry, KHÔNG import bất kỳ gì từ
 * schools/<id>/calculator|data|... — toàn bộ nội dung/logic trường nằm trong `school.Page`.
 * Thêm trường mới = thêm entry vào schoolRegistry, không sửa file này.
 */
function AppShell() {
  const { pathname, navigate, redirect } = useRoute();
  const schoolId = resolveSchoolId(pathname);

  useEffect(() => {
    // Canonicalize địa chỉ trên thanh URL cho link cũ "/?dg_v=..." -> "/hcmut?dg_v=...".
    // Nội dung render đã đúng ngay từ lần đầu (resolveSchoolId xử lý đồng bộ), effect này
    // chỉ dọn URL hiển thị, không ảnh hưởng gì tới việc đã render đúng trang chưa.
    if (pathname === '/' && schoolId === 'hcmut') {
      redirect('/hcmut');
    }
  }, [pathname, schoolId, redirect]);

  const school = schoolId ? schoolRegistry[schoolId] : undefined;

  useEffect(() => {
    if (pathname === '/compare') {
      setPageMeta({
        title: `So sánh hồ sơ nhiều trường | ${siteConfig.name}`,
        description: 'So sánh điểm xét tuyển, điểm chuẩn và mức độ đủ điều kiện của một hồ sơ ở nhiều trường/ngành cùng lúc.',
        path: '/compare',
      });
      return;
    }
    if (!school) {
      setPageMeta({ title: `${siteConfig.name} — Điểm xét tuyển đại học`, description: siteConfig.description, path: '/' });
      return;
    }
    const suffix = school.status === 'supported' ? 'Tính điểm xét tuyển' : 'Điểm chuẩn & tuyển sinh';
    setPageMeta({
      title: `${school.shortName} ${school.year} — ${suffix} | ${siteConfig.name}`,
      description: school.about ?? school.summary ?? siteConfig.description,
      path: `/${schoolId}`,
    });
  }, [pathname, school, schoolId]);

  let content;
  if (pathname === '/compare') {
    content = <MultiSchoolComparisonPage onBackHome={() => navigate('/')} onOpenSchool={(id) => navigate(`/${id}`)} />;
  } else if (school?.Page) {
    const Page = school.Page;
    // `Page` có thể là `React.lazy(...)` (16 trường có UI calculator thật, xem `schools/index.ts`)
    // — bắt buộc bọc `<Suspense>` khi render component lazy, kể cả với 14 trường còn lại dùng
    // component thường (Suspense không ảnh hưởng gì nếu con không thật sự lazy).
    content = (
      <Suspense fallback={<RouteLoadingFallback />}>
        <Page onChangeSchool={() => navigate('/')} />
      </Suspense>
    );
  } else {
    content = (
      <div className="min-h-svh bg-bg">
        <div className="mx-auto max-w-6xl px-4 pb-16">
          <LandingPage onSelectSchool={(id) => navigate(`/${id}`)} onOpenCompare={() => navigate('/compare')} />
          <Footer />
        </div>
      </div>
    );
  }

  // `key={pathname}` (P3): đổi route tạo boundary instance mới -> tự reset hasError, tránh 1 lỗi ở
  // route trước dính mãi sau khi user bấm "Về trang chủ"/điều hướng sang route khác.
  return (
    <ErrorBoundary key={pathname} onGoHome={() => navigate('/')}>
      {content}
    </ErrorBoundary>
  );
}

/** ApplicantProfileProvider bọc ngoài AppShell (mount 1 lần, sống suốt phiên SPA) để factual
 * profile không mất khi chuyển route giữa các trường — xem core/ApplicantProfileContext.tsx. */
function App() {
  return (
    <ApplicantProfileProvider>
      <AppShell />
    </ApplicantProfileProvider>
  );
}

export default App;
