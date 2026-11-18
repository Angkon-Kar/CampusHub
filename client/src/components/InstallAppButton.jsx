// client/src/components/InstallAppButton.jsx
import { useState } from 'react';
import { Download, Share, SquarePlus } from 'lucide-react';
import toast from 'react-hot-toast';
import { useInstallState, promptInstall } from '../pwa/installPrompt';
import { Modal } from './Modal';

const STYLES = {
  nav: 'inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition cursor-pointer',
  menu: 'flex w-full items-center gap-3 px-3 py-3 rounded-xl text-[15px] font-medium text-slate-700 hover:bg-slate-100 transition cursor-pointer',
  footer: 'inline-flex items-center gap-2 px-3.5 py-2 rounded-full border border-slate-200 text-sm font-medium text-slate-600 hover:text-indigo-600 hover:border-indigo-200 transition cursor-pointer',
};

// Shows nothing when the app is already installed or the browser cannot install it
export const InstallAppButton = ({ variant = 'nav' }) => {
  const state = useInstallState();
  const [iosOpen, setIosOpen] = useState(false);

  if (state === 'installed' || state === 'unavailable') return null;

  const handleClick = async () => {
    if (state === 'ios') return setIosOpen(true);
    const outcome = await promptInstall();
    if (outcome === 'accepted') toast.success('Campus Hub is being added to your device.');
  };

  return (
    <>
      <button type="button" onClick={handleClick} className={STYLES[variant]}>
        <Download size={variant === 'menu' ? 18 : 15} className={variant === 'menu' ? 'text-indigo-500' : ''} /> Install app
      </button>

      <Modal isOpen={iosOpen} onClose={() => setIosOpen(false)} title="Add Campus Hub to your iPhone" size="sm">
        <ol className="space-y-4 text-sm text-slate-600">
          <li className="flex items-start gap-3">
            <span className="grid place-items-center w-8 h-8 shrink-0 rounded-lg bg-indigo-50 text-indigo-600">
              <Share size={16} />
            </span>
            <span>
              Open this page in <span className="font-semibold text-slate-900">Safari</span> and tap the <span className="font-semibold text-slate-900">Share</span> button.
            </span>
          </li>
          <li className="flex items-start gap-3">
            <span className="grid place-items-center w-8 h-8 shrink-0 rounded-lg bg-indigo-50 text-indigo-600">
              <SquarePlus size={16} />
            </span>
            <span>
              Scroll down and tap <span className="font-semibold text-slate-900">Add to Home Screen</span>, then <span className="font-semibold text-slate-900">Add</span>.
            </span>
          </li>
        </ol>
        <button type="button" onClick={() => setIosOpen(false)} className="btn-primary w-full mt-6">
          Got it
        </button>
      </Modal>
    </>
  );
};