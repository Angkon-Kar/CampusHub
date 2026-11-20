// client/src/components/Footer.jsx
import { Link } from 'react-router-dom';
import { ArrowUp } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { COLLEGES, POST_TYPES, CONTACT_EMAIL } from '../constants/campus';
import { scrollToTop } from '../utils/scrollToTop';
import { Brand } from './Brand';
import { InstallAppButton } from './InstallAppButton';

const STAFF_ROLES = ['admin', 'moderator'];

const FooterHeading = ({ children }) => (
  <h4 className="text-sm font-semibold text-slate-900 mb-4">{children}</h4>
);

// Every footer link scrolls to the top of the next page (hash links scroll to their section)
const FooterLink = ({ to, state, children }) => (
  <Link
    to={to}
    state={state}
    onClick={() => {
      if (!to.includes('#')) scrollToTop();
    }}
    className="inline-block py-1.5 text-sm text-slate-500 hover:text-indigo-600 hover:translate-x-0.5 transition"
  >
    {children}
  </Link>
);

export const Footer = () => {
  const { dbUser } = useAuth();

  return (
    <footer className="mt-20 border-t border-slate-200/80 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-14 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-12">
        {/* Brand */}
        <div className="col-span-2 lg:col-span-4 space-y-4 lg:pr-8">
          <Brand />
          <p className="text-sm leading-relaxed text-slate-500 max-w-sm">
            One free place for suggestions, previous questions, slides, articles, courses and projects from
            six affiliated engineering colleges.
          </p>
          <p className="text-xs text-slate-400">100% free. Built by students, for students.</p>
          <InstallAppButton variant="footer" />
        </div>

        {/* Explore (filters live in the URL, so these are plain links) */}
        <div className="lg:col-span-2">
          <FooterHeading>Explore</FooterHeading>
          <ul className="space-y-0.5">
            <li>
              <FooterLink to="/">All resources</FooterLink>
            </li>
            {POST_TYPES.map(({ id, label }) => (
              <li key={id}>
                <FooterLink to={`/?type=${id}`}>{label}</FooterLink>
              </li>
            ))}
            <li>
              <FooterLink to="/syllabus">Syllabus tracker</FooterLink>
            </li>
            <li>
              <FooterLink to="/cgpa">CGPA calculator</FooterLink>
            </li>
            <li>
              <FooterLink to="/reviews">Reviews</FooterLink>
            </li>
          </ul>
        </div>

        {/* Colleges */}
        <div className="lg:col-span-2">
          <FooterHeading>Colleges</FooterHeading>
          <ul className="space-y-0.5">
            {COLLEGES.map((college) => (
              <li key={college}>
                <FooterLink to={`/?college=${college}`}>{college}</FooterLink>
              </li>
            ))}
          </ul>
        </div>

        {/* Account */}
        <div className="lg:col-span-2">
          <FooterHeading>Account</FooterHeading>
          <ul className="space-y-0.5">
            {dbUser ? (
              <>
                <li>
                  <FooterLink to={`/${dbUser.username}`}>My profile</FooterLink>
                </li>
                <li>
                  <FooterLink to={`/${dbUser.username}`} state={{ tab: 'status' }}>
                    My post status
                  </FooterLink>
                </li>
                <li>
                  <FooterLink to={`/${dbUser.username}`} state={{ tab: 'security' }}>
                    Login security
                  </FooterLink>
                </li>
                {STAFF_ROLES.includes(dbUser.role) && (
                  <li>
                    <FooterLink to="/admin">Admin panel</FooterLink>
                  </li>
                )}
              </>
            ) : (
              <>
                <li>
                  <FooterLink to="/login">Sign in</FooterLink>
                </li>
                <li>
                  <FooterLink to="/register">Create an account</FooterLink>
                </li>
              </>
            )}
            <li>
              <FooterLink to="/create-post">Share a resource</FooterLink>
            </li>
          </ul>
        </div>

        {/* Policies */}
        <div className="lg:col-span-2">
          <FooterHeading>Policies and help</FooterHeading>
          <ul className="space-y-0.5">
            <li>
              <FooterLink to="/terms">Terms and conditions</FooterLink>
            </li>
            <li>
              <FooterLink to="/terms#copyright">Copyright and teachers</FooterLink>
            </li>
            <li>
              <FooterLink to="/terms#links">Link safety</FooterLink>
            </li>
            <li>
              <FooterLink to="/terms#free">Free education</FooterLink>
            </li>
            <li>
              <FooterLink to="/privacy">Privacy policy</FooterLink>
            </li>
            <li>
              <FooterLink to="/about">About us</FooterLink>
            </li>
            <li>
              <FooterLink to="/about#faq">FAQ</FooterLink>
            </li>
            <li>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="inline-block py-1.5 text-sm text-slate-500 hover:text-indigo-600 hover:translate-x-0.5 transition"
              >
                Contact us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col-reverse sm:flex-row items-center justify-between gap-3 text-xs text-slate-400">
          <span>&copy; {new Date().getFullYear()} Campus Hub. Academic lab project.</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-slate-200 text-slate-500 hover:text-indigo-600 hover:border-indigo-200 transition cursor-pointer"
          >
            <ArrowUp size={13} /> Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};