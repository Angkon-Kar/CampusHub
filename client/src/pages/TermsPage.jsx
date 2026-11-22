// client/src/pages/TermsPage.jsx
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CONTACT_EMAIL } from '../constants/campus';
import { Seo } from '../components/Seo';

const SECTIONS = [
  {
    id: 'copyright',
    title: 'Teacher permission and copyright',
    points: [
      'You confirm that any lecture slides, PDFs or class notes you share have the permission of the respective teacher or faculty member for open academic sharing.',
      'You must not upload books, paid course material or any content you do not have the right to share.',
      'If a teacher or owner asks for a file to be removed, moderators will remove it and your account may be reviewed.',
      `Copyright owners can send a takedown request to ${CONTACT_EMAIL}. We review these first.`,
    ],
  },
  {
    id: 'links',
    title: 'Link safety policy',
    points: [
      'Every link must be a public HTTPS link. Links are checked in three steps: a format check in your browser, a server check that unmasks shortened or masked links, and a safety scan.',
      'Phishing links, malware, adult content, IP loggers, pirated content and masked or shortened harmful links are strictly prohibited.',
      'Submitting a misleading or harmful link can lead to immediate removal of the post and termination of your account.',
    ],
  },
  {
    id: 'free',
    title: '100% free education',
    points: [
      'All shared courses, articles and resources must be free for every student.',
      'Selling material, paid course piracy and commercial promotion are not allowed and will result in account termination.',
    ],
  },
  {
    id: 'content',
    title: 'Articles and posts',
    points: [
      'Articles support text formatting and verified links only. Images cannot be uploaded in articles.',
      'Every upload is reviewed by a moderator before it appears publicly. You can see the review status on your profile, along with any feedback.',
      'Anyone can report a broken or expired link. Reported posts return to the moderation queue for review.',
    ],
  },
  {
    id: 'accountability',
    title: 'Account and accountability',
    points: [
      'Your uploads are linked to your public profile (/username) and are reviewed by college moderators.',
      'You are responsible for what you share and for keeping your login details safe.',
    ],
  },
];

export const TermsPage = () => (
  <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-12">
    <Seo
      title="Terms and conditions"
      description="The rules for sharing on Campus Hub: teacher permission and copyright, link safety, 100% free education and account responsibility."
      path="/terms"
    />
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
      <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">Terms and conditions</h1>
      <p className="mt-3 text-slate-500 leading-relaxed">
        By creating an account on Campus Hub you agree to the rules below. They exist to keep the
        hub safe, free and useful for every student.
      </p>

      <div className="mt-10 space-y-6">
        {SECTIONS.map(({ id, title, points }) => (
          <section key={id} id={id} className="card card-hover p-5 sm:p-6 scroll-mt-24">
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <ul className="mt-3 space-y-2.5 list-disc pl-5 text-sm leading-relaxed text-slate-600 marker:text-indigo-400">
              {points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="mt-10 flex flex-wrap gap-3">
        <Link to="/register" className="btn-primary">
          Create an account
        </Link>
        <Link to="/" className="btn-secondary">
          Back to the hub
        </Link>
      </div>
    </motion.div>
  </div>
);