// client/src/pages/NotFoundPage.jsx
import { Link } from 'react-router-dom';
import { ArrowRight, Radar } from 'lucide-react';
import { motion } from 'framer-motion';
import { Seo } from '../components/Seo';

export const NotFoundPage = () => {
  return (
    <div className="min-h-[90vh] w-full flex items-center justify-center relative overflow-hidden bg-[#fafafa]">
      <Seo title="Page not found" noIndex />
      
      {/* Ultra-Premium Animated Mesh Gradient Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.2, 1], rotate: [0, 90, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-tr from-indigo-300/40 to-purple-400/40 blur-[100px]"
        />
        <motion.div
          animate={{ scale: [1, 1.5, 1], rotate: [0, -90, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-gradient-to-bl from-blue-300/40 to-cyan-300/40 blur-[120px]"
        />
      </div>

      <div className="relative z-10 flex flex-col items-center max-w-3xl px-6 text-center">
        
        {/* Glassmorphism Radar Icon Card */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8 p-6 bg-white/30 backdrop-blur-2xl border border-white/60 shadow-[0_8px_30px_rgb(0,0,0,0.06)] rounded-[2rem]"
        >
          <Radar size={56} className="text-indigo-600" />
        </motion.div>

        {/* Massive Metallic Typography */}
        <motion.h1
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
          className="text-[7rem] sm:text-[12rem] font-black leading-none tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-slate-900 via-slate-700 to-slate-400 drop-shadow-sm"
        >
          404
        </motion.h1>

        <motion.h2
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="mt-2 text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight"
        >
          Signal Lost
        </motion.h2>

        <motion.p
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="mt-6 text-lg sm:text-xl text-slate-600 max-w-lg mx-auto font-medium leading-relaxed"
        >
          The page you are looking for has drifted out of our orbit. Let's get you back to the campus radar.
        </motion.p>

        {/* Apple-style Animated Magnetic Button */}
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="mt-12"
        >
          <Link
            to="/"
            className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full overflow-hidden shadow-2xl shadow-indigo-500/20 transition-all hover:shadow-indigo-500/40 hover:scale-105 active:scale-95"
          >
            {/* Hover Gradient Overlay */}
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            
            <span className="relative text-base font-bold tracking-wide">Back to CampusHub</span>
            <ArrowRight size={20} className="relative group-hover:translate-x-1.5 transition-transform duration-300" />
          </Link>
        </motion.div>

      </div>
    </div>
  );
};