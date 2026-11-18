// client/src/components/ReportModal.jsx
// Shared by the feed and the post page. Mount it only while a post is being reported.
import { useState } from 'react';
import toast from 'react-hot-toast';
import { Modal } from './Modal';
import { useAuth } from '../hooks/useAuth';
import { apiRequest } from '../utils/apiClient';

const REPORT_REASONS = ['Link is broken or expired', 'Wrong or unrelated file', 'Copyrighted or unsafe content', 'Other'];

export const ReportModal = ({ post, onClose, onSubmitted }) => {
  const { firebaseUser } = useAuth();
  const [reason, setReason] = useState(REPORT_REASONS[0]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const token = await firebaseUser.getIdToken();
      const { message } = await apiRequest(`/api/posts/${post._id}/report`, {
        method: 'POST',
        token,
        body: { reason },
      });
      toast.success(message);
      onSubmitted?.();
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen onClose={onClose} title="Report this link" size="sm">
      <div className="space-y-4">
        <p className="text-sm text-slate-500">
          Reporting <span className="font-medium text-slate-900">{post.title}</span>. A moderator will review it.
        </p>
        <div className="space-y-2" role="radiogroup" aria-label="Reason">
          {REPORT_REASONS.map((item) => (
            <label key={item} className="flex items-center gap-2.5 text-sm text-slate-700 cursor-pointer">
              <input
                type="radio"
                name="report-reason"
                checked={reason === item}
                onChange={() => setReason(item)}
                className="w-4 h-4 accent-indigo-600"
              />
              {item}
            </label>
          ))}
        </div>
        <div className="flex justify-end gap-3 pt-2">
          <button type="button" onClick={onClose} className="btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={handleSubmit} disabled={submitting} className="btn-danger">
            {submitting ? 'Sending...' : 'Submit report'}
          </button>
        </div>
      </div>
    </Modal>
  );
};