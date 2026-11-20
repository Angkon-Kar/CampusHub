// client/src/components/AuthLayout.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { BookOpen, FolderGit2, ShieldCheck, Award, Star } from 'lucide-react';
import { Seo } from './Seo';

const HIGHLIGHTS = [
  { Icon: BookOpen, title: 'Every resource in one place', text: 'Suggestions, previous questions and slides from six colleges.' },
  { Icon: FolderGit2, title: 'Show what you build', text: 'Publish articles and projects on your own /username page.' },
  { Icon: Award, title: 'Earn achievements', text: 'Badges unlock as you contribute. Add them to your CV.' },
  { Icon: ShieldCheck, title: 'Safe, reviewed links', text: 'Every link is scanned and every post is checked by a moderator.' },
];

const REVIEWS = [
  { name: "Aisha Rahman", username: "@aisha_r", text: "The previous year questions saved my finals! Such a life-saver platform.", rating: 5 },
  { name: "Rahul Dev", username: "@rahul_dev99", text: "Finally a place to showcase my mini-projects to other campus students.", rating: 5 },
  { name: "Sadia Islam", username: "@sadia_eng", text: "Very well organized. The resource links are actually safe and working.", rating: 4 },
  { name: "Tanvir Hasan", username: "@tanvir_h", text: "Love the UI and the achievement badges. Keeps me motivated to contribute.", rating: 5 }
];

// Dynamic Time-based Greeting Logic
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour >= 0 && hour < 5) return "Late night study session? 🦉";
  if (hour >= 5 && hour < 12) return "Good Morning! Ready to learn? 🌅";
  if (hour >= 12 && hour < 14) return "Mid-day grind! Keep it up. ☀️";
  if (hour >= 14 && hour < 18) return "Good Afternoon! Momentum is key! ☕";
  if (hour >= 18 && hour < 22) return "Good Evening! Let's wrap up today's goals. 🌆";
  return "Midnight oil burning? You got this! 🌙";
};

export const AuthLayout = ({ title, subtitle, children, footer }) => {
  const [greeting] = useState(getGreeting);

  // 3D Mouse Tracking (Parallax) Setup
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, { damping: 50, stiffness: 300 });
  const smoothY = useSpring(mouseY, { damping: 50, stiffness: 300 });

  const bgParallaxX = useTransform(smoothX, [0, typeof window !== 'undefined' ? window.innerWidth : 1200], [15, -15]);
  const bgParallaxY = useTransform(smoothY, [0, typeof window !== 'undefined' ? window.innerHeight : 800], [15, -15]);
  
  const glowParallaxX = useTransform(smoothX, [0, typeof window !== 'undefined' ? window.innerWidth : 1200], [40, -40]);
  const glowParallaxY = useTransform(smoothY, [0, typeof window !== 'undefined' ? window.innerHeight : 800], [40, -40]);

  const handleMouseMove = (e) => {
    mouseX.set(e.clientX);
    mouseY.set(e.clientY);
  };

  return (
    <>
      <Seo title={title} description={subtitle} noIndex />

      <style>
        {`
          @keyframes marquee-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .animate-marquee {
            animation: marquee-scroll 30s linear infinite;
          }
          .animate-marquee:hover {
            animation-play-state: paused;
          }
        `}
      </style>

      {/* Main Container with onMouseMove for Parallax */}
      <div 
        onMouseMove={handleMouseMove}
        className="min-h-[calc(100vh-4rem)] grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] overflow-hidden"
      >
        
        {/* Brand panel with Parallax & Floating Effects */}
        <aside className="relative hidden lg:flex flex-col border-r border-slate-200 bg-slate-50">
          
          {/* Subtle Grid with Parallax Effect */}
          <motion.div 
            style={{ x: bgParallaxX, y: bgParallaxY }}
            className="absolute inset-[-50px] z-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"
          />

          {/* Top Left Glow (Floating + Parallax) */}
          <motion.div style={{ x: glowParallaxX, y: glowParallaxY }} className="absolute -top-24 -left-24 z-0">
            <motion.div 
              animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
              className="w-[28rem] h-[28rem] rounded-full bg-indigo-500/20 blur-[80px] pointer-events-none"
            />
          </motion.div>

          {/* Bottom Right Glow (Floating + Parallax) */}
          <motion.div style={{ x: glowParallaxX, y: glowParallaxY }} className="absolute -bottom-32 -right-24 z-0">
            <motion.div 
              animate={{ scale: [1, 1.25, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ repeat: Infinity, duration: 10, ease: "easeInOut", delay: 1 }}
              className="w-[32rem] h-[32rem] rounded-full bg-blue-500/15 blur-[90px] pointer-events-none"
            />
          </motion.div>
          
          {/* Top Content */}
          <div className="relative z-10 p-12 xl:p-16 flex-1 flex flex-col justify-center">
            <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight max-w-md drop-shadow-sm">
              Study smarter with every campus on your side.
            </h2>
            <p className="mt-4 text-slate-500 max-w-md leading-relaxed">
              A free hub where students from six engineering colleges share what they know.
            </p>

            <motion.ul 
              className="space-y-6 mt-10"
              initial="hidden"
              animate="visible"
              variants={{ visible: { transition: { staggerChildren: 0.15 } } }}
            >
              {HIGHLIGHTS.map(({ Icon, title: itemTitle, text }) => (
                <motion.li 
                  key={itemTitle} 
                  className="flex gap-4 group cursor-default"
                  variants={{
                    hidden: { opacity: 0, x: -15 },
                    visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeOut" } }
                  }}
                >
                  <span className="grid place-items-center w-10 h-10 shrink-0 rounded-xl bg-white border border-slate-200 text-indigo-600 shadow-sm transition-all duration-300 group-hover:scale-110 group-hover:bg-indigo-50 group-hover:border-indigo-200 group-hover:shadow-md">
                    <Icon size={18} />
                  </span>
                  <div>
                    <p className="font-semibold text-slate-900 text-sm group-hover:text-indigo-900 transition-colors duration-300">{itemTitle}</p>
                    <p className="text-sm text-slate-500 mt-0.5">{text}</p>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </div>

          {/* Bottom Review Marquee Carousel */}
          <div className="relative z-10 pb-8 pt-6 w-full border-t border-slate-200/50 bg-white/40 backdrop-blur-md">
            <p className="text-xs font-medium text-slate-500 px-12 xl:px-16 mb-4">
              Trusted by students across all campuses:
            </p>
            
            <div className="relative flex w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] py-2">
              <div className="animate-marquee flex gap-4 w-max px-4">
                {[...REVIEWS, ...REVIEWS].map((review, i) => (
                  <div 
                    key={i} 
                    className="flex-shrink-0 w-80 bg-white/95 backdrop-blur-sm p-5 rounded-2xl shadow-sm border border-slate-200/60 flex flex-col gap-3 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-lg hover:border-indigo-100 cursor-pointer group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-sm border border-indigo-100 group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                          {review.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-slate-900">{review.name}</p>
                          <p className="text-[11px] text-slate-500">{review.username}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, index) => (
                          <Star 
                            key={index} 
                            size={13} 
                            className={index < review.rating ? "fill-amber-400 text-amber-400" : "fill-slate-100 text-slate-200"} 
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-sm text-slate-600 leading-relaxed italic">
                      "{review.text}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* Form panel */}
        <main className="flex items-center justify-center px-4 py-12 sm:px-8 bg-white relative z-20 shadow-[-20px_0_40px_-15px_rgba(0,0,0,0.05)]">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="w-full max-w-md"
          >
            {/* Dynamic Time-based Greeting */}
            <motion.p 
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="text-indigo-600 font-semibold mb-1 text-sm"
            >
              {greeting}
            </motion.p>
            
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">{title}</h1>
            {subtitle && <p className="mt-2 text-sm text-slate-500">{subtitle}</p>}
            
            <div className="mt-7 sm:mt-8">{children}</div>
            
            {footer && <div className="mt-8 text-center text-sm text-slate-500">{footer}</div>}
            
            <p className="mt-8 text-center text-xs text-slate-400">
              By continuing you agree to our{' '}
              <Link to="/terms" className="underline hover:text-indigo-600 transition-colors">
                terms and conditions
              </Link>
              .
            </p>
          </motion.div>
        </main>
      </div>
    </>
  );
};