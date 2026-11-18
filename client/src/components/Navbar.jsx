// client/src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  PlusCircle, ShieldCheck, LogOut, Menu, X, Compass, 
  UserRound, Calculator, ListChecks, MessageSquareHeart, ScanSearch, FileText, ChevronDown 
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Brand } from './Brand';
import { NotificationBell } from './NotificationBell';
import { Avatar } from './Avatar';
import { InstallAppButton } from './InstallAppButton';

const STAFF_ROLES = ['admin', 'moderator'];

// ----------------------------------------------------------------------
// ডেস্কটপ লিংকের জন্য কাস্টম কম্পোনেন্ট
// `display` decides when a link is visible (for example 'hidden xl:flex' shows it only on very wide screens)
// ----------------------------------------------------------------------
const DesktopLink = ({ to, icon: Icon, exact, display = 'flex', children }) => {
  const { pathname } = useLocation();
  const isActive = exact ? pathname === to : (pathname === to || pathname.startsWith(`${to}/`));

  return (
    <Link 
      to={to} 
      className={`relative ${display} items-center gap-1.5 px-3 py-2 text-[14px] font-medium transition-colors duration-200 ${
        isActive ? 'text-indigo-600' : 'text-slate-500 hover:text-indigo-600'
      }`}
    >
      <Icon size={15} />
      <span>{children}</span>
      
      {isActive && (
        <motion.div
          layoutId="navbar-indicator"
          className="absolute bottom-0 left-2 right-2 h-[2px] bg-indigo-600 rounded-t-full"
          initial={false}
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
        />
      )}
    </Link>
  );
};

// ----------------------------------------------------------------------
// প্রোফাইল ড্রপডাউন মেনু (হোভার ইফেক্ট সহ)
// ----------------------------------------------------------------------
const ProfileDropdown = ({ user, isStaff, logoutUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  // A ref keeps the timer between renders (a plain variable is reset on every render, which could close the menu by mistake)
  const closeTimer = useRef(null);

  // মাউস নিলে মেনু খুলবে
  const handleMouseEnter = () => {
    clearTimeout(closeTimer.current);
    setIsOpen(true);
  };

  // মাউস সরালে 200ms পর মেনু বন্ধ হবে
  const handleMouseLeave = () => {
    closeTimer.current = setTimeout(() => setIsOpen(false), 200);
  };

  const close = () => setIsOpen(false);

  return (
    <div 
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <Link
        to={`/${user.username}`}
        onClick={close}
        className="flex items-center gap-1 pl-1 pr-1.5 py-1 rounded-full border border-transparent hover:border-slate-200 bg-transparent hover:bg-white hover:shadow-sm transition-all focus:outline-none"
      >
        <Avatar user={user} className="w-8 h-8 ring-2 ring-transparent hover:ring-indigo-100 transition-all" />
        <ChevronDown size={14} className={`text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Link>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl shadow-indigo-900/10 border border-slate-100 py-2 z-50 overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-slate-50 mb-1 bg-slate-50/50">
              <p className="text-sm font-semibold text-slate-800 truncate">{user.fullName || 'User'}</p>
              <p className="font-mono text-xs text-slate-500 truncate">/{user.username}</p>
            </div>

            <Link onClick={close} to={`/${user.username}`} className="flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-indigo-600 hover:bg-indigo-50/50 transition">
              <UserRound size={16} /> My Profile
            </Link>

            {isStaff && (
              <Link onClick={close} to="/admin" className="flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-amber-700 hover:bg-amber-50 transition">
                <ShieldCheck size={16} /> Admin Panel
              </Link>
            )}

            <div className="h-px bg-slate-100 my-1"></div>

            <button 
              onClick={() => { close(); logoutUser(); }} 
              className="w-full flex items-center gap-2 px-4 py-2 text-[14px] font-medium text-rose-600 hover:bg-rose-50 transition cursor-pointer"
            >
              <LogOut size={16} /> Log out
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ----------------------------------------------------------------------
// মূল Navbar কম্পোনেন্ট
// ----------------------------------------------------------------------
export const Navbar = () => {
  const { dbUser, logoutUser } = useAuth();
  const { pathname } = useLocation();

  const [openAt, setOpenAt] = useState(null);
  const [isScrolled, setIsScrolled] = useState(false);

  const isMenuOpen = openAt === pathname;
  const closeMenu = () => setOpenAt(null);
  const isStaff = STAFF_ROLES.includes(dbUser?.role);

  // স্ক্রল ইভেন্ট লিসেনার
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const mobileItem =
    'flex items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-slate-700 hover:bg-slate-100 transition';

  return (
    <header 
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled 
          ? 'bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm shadow-indigo-900/5 py-0' 
          : 'bg-white/0 border-b border-transparent py-1' // পেজের উপরে থাকলে স্বচ্ছ
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 transition-all">
        <Brand onClick={closeMenu} />

        {/* ---------------- ডেস্কটপ ভিউ ---------------- */}
        <div className="hidden lg:flex items-center h-full gap-1">
          <DesktopLink to="/" exact icon={Compass}>Explore</DesktopLink>
          <DesktopLink to="/resume-checker" icon={ScanSearch}>Resume check</DesktopLink>
          <DesktopLink to="/cv-guide" icon={FileText} display="hidden xl:flex">CV guide</DesktopLink>
          <DesktopLink to="/syllabus" icon={ListChecks}>Syllabus</DesktopLink>
          <DesktopLink to="/cgpa" icon={Calculator}>CGPA</DesktopLink>
          <DesktopLink to="/reviews" icon={MessageSquareHeart}>Reviews</DesktopLink>

          <div className="flex items-center gap-3 ml-4 pl-4 border-l border-slate-200 h-8">
            <InstallAppButton variant="nav" />
            
            {dbUser ? (
              <>
                {/* গ্লোয়িং শেয়ার বাটন */}
                <Link 
                  to="/create-post" 
                  className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-indigo-600 to-blue-600 text-white rounded-lg text-[14px] font-medium shadow-md shadow-indigo-500/20 hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all"
                >
                  <PlusCircle size={16} /> <span>Share</span>
                </Link>
                <div className="mx-1">
                  <NotificationBell />
                </div>
                <ProfileDropdown user={dbUser} isStaff={isStaff} logoutUser={logoutUser} />
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link to="/login" className="px-4 py-2 rounded-lg text-[14px] font-medium text-slate-700 hover:bg-slate-100 transition">
                  Sign in
                </Link>
                <Link to="/register" className="btn-primary !py-2">
                  Create account
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ---------------- মোবাইল ভিউ ---------------- */}
        <div className="lg:hidden flex items-center gap-1 -mr-2">
          {dbUser && <NotificationBell />}
          <button
            type="button"
            onClick={() => setOpenAt(isMenuOpen ? null : pathname)}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
            className="p-2 rounded-xl text-slate-700 hover:bg-slate-100 transition cursor-pointer"
          >
            {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* ---------------- মোবাইল মেনু প্যানেল ---------------- */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-slate-100 shadow-xl overflow-hidden absolute w-full"
          >
            <div className="px-4 py-3 space-y-1">
              <Link to="/" onClick={closeMenu} className={mobileItem}><Compass size={18} className="text-slate-400" /> Explore</Link>
              <Link to="/resume-checker" onClick={closeMenu} className={mobileItem}><ScanSearch size={18} className="text-slate-400" /> Resume checker</Link>
              <Link to="/cv-guide" onClick={closeMenu} className={mobileItem}><FileText size={18} className="text-slate-400" /> CV guide</Link>
              <Link to="/syllabus" onClick={closeMenu} className={mobileItem}><ListChecks size={18} className="text-slate-400" /> Syllabus</Link>
              <Link to="/cgpa" onClick={closeMenu} className={mobileItem}><Calculator size={18} className="text-slate-400" /> CGPA</Link>
              <Link to="/reviews" onClick={closeMenu} className={mobileItem}><MessageSquareHeart size={18} className="text-slate-400" /> Reviews</Link>
              
              <div className="h-px bg-slate-100 my-2"></div>
              
              {dbUser ? (
                <>
                  <Link to="/create-post" onClick={closeMenu} className={mobileItem}>
                    <PlusCircle size={18} className="text-indigo-500" /> Share resource
                  </Link>
                  <Link to={`/${dbUser.username}`} onClick={closeMenu} className={mobileItem}>
                    <UserRound size={18} className="text-slate-400" /> Profile
                  </Link>
                  {isStaff && (
                    <Link to="/admin" onClick={closeMenu} className={`${mobileItem} !text-amber-700`}>
                      <ShieldCheck size={18} /> Admin panel
                    </Link>
                  )}
                  <button onClick={() => { closeMenu(); logoutUser(); }} className={`${mobileItem} w-full !text-rose-600`}>
                    <LogOut size={18} /> Log out
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-3 pt-2">
                  <Link to="/login" onClick={closeMenu} className="btn-secondary">Sign in</Link>
                  <Link to="/register" onClick={closeMenu} className="btn-primary">Create account</Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};