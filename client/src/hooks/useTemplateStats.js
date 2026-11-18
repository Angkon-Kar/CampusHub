// client/src/hooks/useTemplateStats.js
// Views and love counts of the CV templates. Guests can read them. Love and view counting need a login.
import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/apiClient';
import { useAuth } from './useAuth';

export const useTemplateStats = () => {
  const { firebaseUser } = useAuth();
  const [data, setData] = useState({ stats: {}, lovedIds: [] });

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const token = firebaseUser ? await firebaseUser.getIdToken() : undefined;
        const { stats = {}, lovedIds = [] } = await apiRequest('/api/templates/stats', { token });
        if (!cancelled) setData({ stats, lovedIds });
      } catch {
        // The page works without counters: they simply stay at 0
      }
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [firebaseUser]);

  const bump = (id, patch) =>
    setData((previous) => ({
      ...previous,
      stats: { ...previous.stats, [id]: { views: 0, loves: 0, ...previous.stats[id], ...patch } },
    }));

  // Called when a logged-in user opens or downloads a template (fire and forget)
  const trackView = useCallback(
    async (id) => {
      if (!firebaseUser) return;
      try {
        const token = await firebaseUser.getIdToken();
        const { views } = await apiRequest(`/api/templates/${id}/view`, { method: 'POST', token });
        bump(id, { views });
      } catch {
        // Counting a view must never block opening the PDF
      }
    },
    [firebaseUser]
  );

  const toggleLove = useCallback(
    async (id) => {
      if (!firebaseUser) return toast.error('Please sign in to react.');
      try {
        const token = await firebaseUser.getIdToken();
        const { loved, loves } = await apiRequest(`/api/templates/${id}/love`, { method: 'POST', token });
        setData((previous) => ({
          stats: { ...previous.stats, [id]: { views: 0, ...previous.stats[id], loves } },
          lovedIds: loved ? [...previous.lovedIds.filter((item) => item !== id), id] : previous.lovedIds.filter((item) => item !== id),
        }));
      } catch (error) {
        toast.error(error.message);
      }
    },
    [firebaseUser]
  );

  return { stats: data.stats, lovedIds: data.lovedIds, trackView, toggleLove };
};