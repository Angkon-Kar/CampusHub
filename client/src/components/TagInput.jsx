// client/src/components/TagInput.jsx
// Tag box with autocomplete: suggestions come from the existing tags (with post counts and aliases),
// a close match shows "Did you mean...", and a brand-new tag is the last choice, not the first.
import { useEffect, useMemo, useRef, useState } from 'react';
import { BadgeCheck, Plus, Sparkles, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/apiClient';
import { useDebounce } from '../hooks/useDebounce';

export const TagInput = ({ tags, onChange, max = 5 }) => {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  // The result remembers which text it belongs to, so "loading" can be derived (no extra state)
  const [result, setResult] = useState({ forQuery: null, suggestions: [], exact: null, didYouMean: null, canCreate: false });
  const cacheRef = useRef(new Map());

  const debouncedQuery = useDebounce(query.trim(), 250);
  const isFull = tags.length >= max;

  useEffect(() => {
    if (!open) return;
    let cancelled = false;

    const load = async () => {
      try {
        let data = cacheRef.current.get(debouncedQuery);
        if (!data) {
          data = await apiRequest(`/api/tags/suggest?q=${encodeURIComponent(debouncedQuery)}`);
          cacheRef.current.set(debouncedQuery, data);
        }
        if (!cancelled) {
          const { suggestions = [], exact = null, didYouMean = null, canCreate = false } = data;
          setResult({ forQuery: debouncedQuery, suggestions, exact, didYouMean, canCreate });
          setActiveIndex(0);
        }
      } catch {
        if (!cancelled) setResult({ forQuery: debouncedQuery, suggestions: [], exact: null, didYouMean: null, canCreate: false });
      }
    };
    load();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, open]);

  const isFresh = result.forQuery === query.trim();

  // Rows of the dropdown: "did you mean" first, then matches, then "create new"
  const options = useMemo(() => {
    const rows = [];
    const seen = new Set(tags);
    const push = (item, kind) => {
      if (seen.has(item.slug)) return;
      seen.add(item.slug);
      rows.push({ ...item, kind });
    };

    if (result.didYouMean) push(result.didYouMean, 'suggest');
    result.suggestions.forEach((item) => push(item, 'tag'));

    if (result.canCreate && !result.exact && query.trim()) {
      rows.push({ kind: 'create', slug: query.trim(), label: query.trim() });
    }
    return rows;
  }, [result, tags, query]);

  const addTag = (slug) => {
    if (tags.includes(slug)) return;
    if (isFull) return toast.error(`You can add up to ${max} tags.`);
    onChange([...tags, slug]);
    setQuery('');
    setActiveIndex(0);
  };

  // A new tag is checked on the server first, so "Data Structures" or "ds" becomes the official "dsa"
  const addTypedText = async () => {
    const text = query.trim();
    if (!text) return;
    try {
      const { slug } = await apiRequest(`/api/tags/resolve?name=${encodeURIComponent(text)}`);
      addTag(slug);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const chooseOption = (option) => {
    if (option.kind === 'create') return addTypedText();
    return addTag(option.slug);
  };

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      setActiveIndex((index) => Math.min(index + 1, Math.max(options.length - 1, 0)));
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex((index) => Math.max(index - 1, 0));
    } else if (event.key === 'Enter') {
      event.preventDefault();
      if (isFresh && options[activeIndex]) chooseOption(options[activeIndex]);
      else addTypedText();
    } else if (event.key === 'Escape') {
      setOpen(false);
    } else if (event.key === 'Backspace' && !query && tags.length > 0) {
      onChange(tags.slice(0, -1));
    }
  };

  return (
    <div className="space-y-3">
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag) => (
            <span key={tag} className="inline-flex items-center gap-1 px-2.5 py-1 bg-indigo-50 text-indigo-700 border border-indigo-100 rounded-full text-xs font-medium">
              #{tag}
              <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} aria-label={`Remove ${tag}`} className="cursor-pointer hover:text-rose-500">
                <X size={12} />
              </button>
            </span>
          ))}
        </div>
      )}

      <div className="relative">
        <input
          type="text"
          role="combobox"
          aria-expanded={open}
          aria-autocomplete="list"
          disabled={isFull}
          placeholder={isFull ? `Maximum ${max} tags reached` : 'Type to search tags, e.g. dsa, midterm'}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={handleKeyDown}
          className="input"
        />

        {open && !isFull && (
          // mouseDown preventDefault keeps the input focused, so a click on a row is not lost to onBlur
          <ul
            role="listbox"
            onMouseDown={(e) => e.preventDefault()}
            className="absolute left-0 right-0 z-20 mt-1.5 max-h-72 overflow-y-auto rounded-xl border border-slate-200 bg-white p-1.5 shadow-lg shadow-slate-900/5"
          >
            {!isFresh && options.length === 0 && <li className="px-3 py-2 text-sm text-slate-400">Searching...</li>}
            {isFresh && options.length === 0 && (
              <li className="px-3 py-2 text-sm text-slate-400">{query.trim() ? 'No more matches.' : 'No tags yet. Type to create one.'}</li>
            )}

            {!query.trim() && options.length > 0 && (
              <li className="px-3 pt-1 pb-1.5 text-xs font-medium uppercase tracking-wide text-slate-400">Popular tags</li>
            )}

            {options.map((option, index) => (
              <li
                key={`${option.kind}-${option.slug}`}
                role="option"
                aria-selected={index === activeIndex}
                onMouseEnter={() => setActiveIndex(index)}
                onClick={() => chooseOption(option)}
                className={`flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-sm cursor-pointer ${
                  index === activeIndex ? 'bg-indigo-50' : ''
                }`}
              >
                {option.kind === 'create' ? (
                  <span className="flex items-center gap-2 text-slate-700">
                    <Plus size={14} className="text-indigo-500" />
                    Create new tag <span className="font-semibold">&ldquo;{option.label}&rdquo;</span>
                  </span>
                ) : (
                  <>
                    <span className="min-w-0 flex items-center gap-2">
                      {option.kind === 'suggest' && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                          <Sparkles size={11} /> Did you mean
                        </span>
                      )}
                      <span className="font-semibold text-slate-900">#{option.slug}</span>
                      {option.official && <BadgeCheck size={14} className="shrink-0 text-indigo-500" aria-label="Official tag" />}
                      {option.label && option.label !== option.slug && (
                        <span className="truncate text-slate-500">{option.label}</span>
                      )}
                      {option.matchedAlias && <span className="truncate text-xs text-slate-400">matches &ldquo;{option.matchedAlias}&rdquo;</span>}
                    </span>
                    <span className="shrink-0 text-xs text-slate-400">
                      {option.count} {option.count === 1 ? 'post' : 'posts'}
                    </span>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <p className="text-xs text-slate-400">
        {tags.length}/{max} tags. Pick an existing tag when you can: it keeps the hub easy to search.
      </p>
    </div>
  );
};
