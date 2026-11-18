// client/src/components/Brand.jsx
import { Link } from 'react-router-dom';
import { BookOpen } from 'lucide-react';

export const Brand = ({ onClick }) => (
  <Link to="/" onClick={onClick} className="group inline-flex items-center gap-2.5" aria-label="Campus Hub home">
    <span className="grid place-items-center w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-600/25 transition duration-300 group-hover:-rotate-6 group-hover:scale-105">
      <BookOpen size={18} />
    </span>
    <span className="text-[17px] font-extrabold tracking-tight text-slate-900">
      Campus <span className="text-indigo-600">Hub</span>
    </span>
  </Link>
);
