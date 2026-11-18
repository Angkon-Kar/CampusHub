// client/src/pages/AboutPage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronDown, Sparkles, ShieldCheck, UserCircle, Mail } from 'lucide-react';
import { CONTACT_EMAIL, COLLEGES } from '../constants/campus';

const FAQS = [
  {
    q: 'Is Campus Hub really free?',
    a: 'Yes. Every resource, article and course shared here must be free for every student. Selling material or promoting paid courses is not allowed.',
  },
  {
    q: 'Who can share a resource?',
    a: 'Any student with an account. Email/password accounts must verify their email first. Every post is checked by a moderator before it goes live.',
  },
  {
    q: 'Why do I need to sign in to download?',
    a: 'Browsing is open to everyone, but opening the shared drive links needs an account. This keeps the links safer and lets us count real views.',
  },
  {
    q: 'My post was declined. What now?',
    a: 'Open the "My post status" tab on your profile. You will see the moderator\'s feedback. Press "Edit and resubmit", fix the problem and send it again.',
  },
  {
    q: 'A link is broken or unsafe. What should I do?',
    a: 'Use the three-dot menu on the card (or the Report button on the post page). After several reports, a moderator reviews the post and the author is notified.',
  },
  {
    q: 'Can I upload someone else\'s slides or books?',
    a: 'Only with the teacher\'s or owner\'s permission, and never paid books or course material. Copyright owners can ask for removal at any time.',
  },
  {
    q: 'How do I ask for something to be removed?',
    a: null,
  },
];

export const AboutPage = () => (
  <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 sm:py-16 relative">
    {/* Subtle Background Glow Element */}
    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-indigo-500/5 blur-[100px] -z-10 rounded-full"></div>

    <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
      
      {/* Header Section */}
      <div className="text-center mb-14">
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700">
          About Campus Hub
        </h1>
        <p className="mt-4 text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl mx-auto">
          Campus Hub is one free place where students share suggestions, previous questions, slides, articles, free courses and projects. Built by students, for students from <span className="font-semibold text-indigo-600">{COLLEGES.length}</span> affiliated engineering colleges ({COLLEGES.join(', ')}).
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid sm:grid-cols-3 gap-6">
        {[
          { title: '100% Free', text: 'No fees, no paid material, no ads. Built for the students.', icon: Sparkles, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { title: 'Reviewed', text: 'Every post is checked by a moderator and every link is scanned.', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { title: 'Your Portfolio', text: 'Your articles, projects and badges live on your own /username page.', icon: UserCircle, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
        ].map((feature, idx) => (
          <motion.div 
            key={feature.title} 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.1 + idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="card p-6 bg-white/60 backdrop-blur-sm border border-slate-200/60 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 rounded-2xl"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${feature.bg}`}>
              <feature.icon size={24} className={feature.color} />
            </div>
            <p className="font-bold text-slate-900 text-lg">{feature.title}</p>
            <p className="mt-2 text-sm text-slate-500 leading-relaxed">{feature.text}</p>
          </motion.div>
        ))}
      </div>

      {/* FAQ Section */}
      <section id="faq" className="mt-20 scroll-mt-24">
        <div className="text-center mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-slate-500 mt-2">Everything you need to know about the platform.</p>
        </div>
        
        <div className="mt-6 space-y-4 max-w-3xl mx-auto">
          {FAQS.map(({ q, a }, idx) => (
            <motion.details 
              key={q} 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + idx * 0.05 }}
              className="card group px-6 py-5 bg-white border border-slate-200 rounded-2xl open:shadow-lg open:shadow-indigo-500/5 transition-all duration-300"
            >
              <summary className="flex items-center justify-between gap-4 cursor-pointer list-none font-semibold text-slate-800 [&::-webkit-details-marker]:hidden hover:text-indigo-600 transition-colors">
                {q}
                <ChevronDown size={18} className="shrink-0 text-slate-400 transition-transform duration-300 group-open:rotate-180 group-open:text-indigo-600" />
              </summary>
              <div className="mt-4 pt-4 border-t border-slate-100">
                <p className="text-sm leading-relaxed text-slate-600">
                  {a ?? (
                    <>
                      Email{' '}
                      <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold text-indigo-600 hover:text-indigo-700 underline underline-offset-2 transition-colors">
                        {CONTACT_EMAIL}
                      </a>{' '}
                      with the link to the post and a short explanation. Copyright takedown requests are handled first.
                    </>
                  )}
                </p>
              </div>
            </motion.details>
          ))}
        </div>
      </section>

      {/* Contact Section */}
      <motion.section 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
        id="contact" 
        className="mt-16 bg-gradient-to-br from-indigo-50 to-blue-50/50 border border-indigo-100 p-8 rounded-3xl text-center max-w-3xl mx-auto"
      >
        <div className="inline-flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
          <Mail size={24} className="text-indigo-600" />
        </div>
        <h2 className="text-xl font-bold text-slate-900">Still have questions?</h2>
        <p className="mt-2 text-sm text-slate-600 leading-relaxed mb-6">
          Questions, feedback or a copyright takedown request? We are always here to help.
        </p>
        <a href={`mailto:${CONTACT_EMAIL}`} className="btn-primary inline-flex shadow-md hover:-translate-y-1 transition-transform duration-300">
          Contact Support
        </a>
      </motion.section>

      {/* Footer Links */}
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
        className="mt-12 flex flex-wrap justify-center gap-4"
      >
        <Link to="/register" className="btn-primary shadow-md hover:-translate-y-1 transition-transform">
          Create an account
        </Link>
        <Link to="/terms" className="btn-secondary bg-white hover:bg-slate-50 transition-colors">
          Terms and conditions
        </Link>
        <Link to="/privacy" className="btn-secondary bg-white hover:bg-slate-50 transition-colors">
          Privacy policy
        </Link>
      </motion.div>

    </motion.div>
  </div>
);