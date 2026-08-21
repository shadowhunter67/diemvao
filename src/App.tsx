import { useEffect } from 'react';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { MultiSchoolComparisonPage } from './components/MultiSchoolComparisonPage';
import { useRoute } from './hooks/useRoute';
import { schoolRegistry } from './schools';
import { setPageMeta } from './core/pageMeta';
import { siteConfig } from './config/site';
import { ApplicantProfileProvider } from './core/ApplicantProfileContext';

/**
 * "/" -> null (landing). "/<id>" -> id. Ngoại lệ: "/" + query non-empty là share link cũ
 * (từ trước khi có routing path-based, luôn là HCMUT) -> coi như "/hcmut" để không phá link cũ.
 */
function resolveSchoolId(pathname: string): string | null {
  const segment = pathname.replace(/^\/+/, '').split('/')[0];
  if (segment !== '') return segment;
  if (typeof window !== 'undefined' && window.location.search) return 'hcmut';
  return null;
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
      setPageMeta(`So sánh hồ sơ nhiều trường | ${siteConfig.name}`, siteConfig.description);
      return;
    }
    if (!school) {
      setPageMeta(`${siteConfig.name} — Điểm xét tuyển đại học`, siteConfig.description);
      return;
    }
    const suffix = school.status === 'supported' ? 'Tính điểm xét tuyển' : 'Điểm chuẩn & tuyển sinh';
    setPageMeta(`${school.shortName} ${school.year} — ${suffix} | ${siteConfig.name}`);
  }, [pathname, school]);

  if (pathname === '/compare') {
    return <MultiSchoolComparisonPage onBackHome={() => navigate('/')} onOpenSchool={(id) => navigate(`/${id}`)} />;
  }

  if (school?.Page) {
    const Page = school.Page;
    return <Page onChangeSchool={() => navigate('/')} />;
  }

  return (
    <div className="min-h-svh bg-bg">
      <div className="mx-auto max-w-6xl px-4 pb-16">
        <LandingPage onSelectSchool={(id) => navigate(`/${id}`)} onOpenCompare={() => navigate('/compare')} />
        <Footer />
      </div>
    </div>
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
