// client/src/App.jsx
import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { useAuth } from './hooks/useAuth';
import { useTabAttention } from './hooks/useTabAttention';
import { PageSkeleton, DashboardSkeleton } from './components/Skeletons';
import { BackToTop } from './components/BackToTop';
import { VerifyEmailBanner } from './components/VerifyEmailBanner';
import { scrollBehavior } from './utils/scrollToTop';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ResourceHubPage } from './pages/ResourceHubPage';
import { PostDetailPage } from './pages/PostDetailPage';
import { AboutPage } from './pages/AboutPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { CompleteProfilePage } from './pages/CompleteProfilePage';
import { TermsPage } from './pages/TermsPage';
import { PublicProfilePage } from './pages/PublicProfilePage';
import { NotFoundPage } from './pages/NotFoundPage';

// The admin dashboard (and its charts) is only downloaded when a moderator opens it
const AdminDashboardPage = lazy(() =>
  import('./pages/AdminDashboardPage').then((module) => ({ default: module.AdminDashboardPage }))
);

// These pages are downloaded only when someone opens them
const CreatePostPage = lazy(() => import('./pages/CreatePostPage').then((module) => ({ default: module.CreatePostPage })));
const EditPostPage = lazy(() => import('./pages/CreatePostPage').then((module) => ({ default: module.EditPostPage })));
const CgpaPage = lazy(() => import('./pages/CgpaPage').then((module) => ({ default: module.CgpaPage })));
const SyllabusPage = lazy(() => import('./pages/SyllabusPage').then((module) => ({ default: module.SyllabusPage })));
const ReviewsPage = lazy(() => import('./pages/ReviewsPage').then((module) => ({ default: module.ReviewsPage })));

// Pages added from the 1st (new) file
const ResumeCheckerPage = lazy(() =>
  import('./pages/ResumeCheckerPage').then(({ ResumeCheckerPage: Page }) => ({ default: Page }))
);
const CvGuidePage = lazy(() =>
  import('./pages/CvGuidePage').then(({ CvGuidePage: Page }) => ({ default: Page }))
);

const STAFF_ROLES = ['admin', 'moderator'];
const ONBOARDING_ALLOWED_PATHS = ['/complete-profile', '/terms', '/privacy', '/cgpa', '/syllabus'];

const FullPageLoader = () => <PageSkeleton />;

// Scroll to top on page change, or to the #section on pages like /terms#links
const ScrollManager = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: scrollBehavior() });
    } else {
      window.scrollTo(0, 0);
    }
  }, [pathname, hash]);

  return null;
};

// A few seconds after the app opens (and only online), download the two offline-friendly tools in the background,
// so the CGPA calculator and the Syllabus Tracker also open without internet after the first visit.
const PrefetchTools = () => {
  useEffect(() => {
    const timer = setTimeout(() => {
      if (navigator.onLine) {
        import('./pages/CgpaPage');
        import('./pages/SyllabusPage');
      }
    }, 4000);
    return () => clearTimeout(timer);
  }, []);
  return null;
};

// Blinks the tab title and icon when the visitor has been on another tab for 5 seconds
const TabAttention = () => {
  useTabAttention();
  return null;
};

// Soft fade between pages (opacity only, so fixed elements inside pages stay correct)
const PageTransition = ({ children }) => {
  const { pathname } = useLocation();
  return (
    <motion.div key={pathname} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }}>
      {children}
    </motion.div>
  );
};

// Convenience guard only. The real security check is on the server (requireRole).
const RequireStaff = ({ children }) => {
  const { dbUser, loading } = useAuth();

  if (loading) return <FullPageLoader />;
  if (!dbUser || !STAFF_ROLES.includes(dbUser.role)) return <Navigate to="/" replace />;
  return children;
};

// Only signed-in users can open the create-post page
const RequireAuth = ({ children }) => {
  const { firebaseUser, loading } = useAuth();
  const { pathname } = useLocation();

  if (loading) return <FullPageLoader />;
  if (!firebaseUser) return <Navigate to="/login" replace state={{ from: pathname }} />;
  return children;
};

// New social-login users must finish username + terms before using the site
const OnboardingGate = ({ children }) => {
  const { needsOnboarding } = useAuth();
  const { pathname } = useLocation();

  if (needsOnboarding && !ONBOARDING_ALLOWED_PATHS.includes(pathname)) {
    return <Navigate to="/complete-profile" replace />;
  }
  return children;
};

const App = () => (
  <Router>
    <ScrollManager />
    <TabAttention />
    <PrefetchTools />
    <Toaster
      position="top-center"
      toastOptions={{ style: { borderRadius: '14px', border: '1px solid #e2e8f0', fontSize: '14px' } }}
    />
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <VerifyEmailBanner />
      <main className="flex-1">
        <OnboardingGate>
          <PageTransition>
            <Suspense fallback={<PageSkeleton />}>
            <Routes>
              <Route path="/" element={<ResourceHubPage />} />
              <Route
                path="/create-post"
                element={
                  <RequireAuth>
                    <CreatePostPage />
                  </RequireAuth>
                }
              />
              <Route path="/post/:id" element={<PostDetailPage />} />
              <Route
                path="/post/:id/edit"
                element={
                  <RequireAuth>
                    <EditPostPage />
                  </RequireAuth>
                }
              />
              
              {/* ATS Checker & CV Guide added with RequireAuth and Lazy suspense defaults */}
              <Route path="/resume-checker" element={<ResumeCheckerPage />} />
              
              <Route path="/cv-guide" element={<CvGuidePage />} />

              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/complete-profile" element={<CompleteProfilePage />} />
              <Route path="/terms" element={<TermsPage />} />
              <Route path="/privacy" element={<PrivacyPage />} />
              <Route path="/cgpa" element={<CgpaPage />} />
              <Route path="/syllabus" element={<SyllabusPage />} />
              <Route path="/reviews" element={<ReviewsPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route
                path="/admin"
                element={
                  <RequireStaff>
                    <Suspense fallback={<DashboardSkeleton />}>
                      <AdminDashboardPage />
                    </Suspense>
                  </RequireStaff>
                }
              />
              {/* Dynamic profile route, e.g. /angkonkar. Keep it after the fixed routes. */}
              <Route path="/:username" element={<PublicProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
            </Suspense>
          </PageTransition>
        </OnboardingGate>
      </main>
      <Footer />
      <BackToTop />
    </div>
  </Router>
);

export default App;