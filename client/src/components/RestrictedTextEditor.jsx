// client/src/components/RestrictedTextEditor.jsx
// TipTap editor. Allowed: bold, italic, underline, headings, lists, inline code and validated links. No images.
import { useState } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import {
  Bold,
  Italic,
  Underline,
  Heading2,
  List,
  ListOrdered,
  Code,
  Type,
  Link2,
  Check,
  X,
  Loader2,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { apiRequest } from '../utils/apiClient';
import { sanitizeHtml } from '../utils/sanitize';
import { useAuth } from '../hooks/useAuth';
import { EDITOR_FONTS, HTTPS_LINK_REGEX } from '../constants/campus';

const ToolButton = ({ label, active = false, onClick, children, className = '' }) => (
  <button
    type="button"
    title={label}
    aria-label={label}
    aria-pressed={active}
    // Keep the text selection in the editor when a toolbar button is clicked
    onMouseDown={(e) => e.preventDefault()}
    onClick={onClick}
    className={`p-2 rounded-lg transition cursor-pointer ${
      active ? 'bg-indigo-100 text-indigo-700' : 'text-slate-600 hover:bg-slate-200/70 hover:text-slate-900'
    } ${className}`}
  >
    {children}
  </button>
);

export const RestrictedTextEditor = ({ onChange, selectedFont, onFontChange, initialValue = '' }) => {
  const { firebaseUser } = useAuth();
  // Only used when the editor is created (the edit page remounts the form for each post)
  const [initialContent] = useState(() => sanitizeHtml(initialValue));

  const [isLinkBoxOpen, setIsLinkBoxOpen] = useState(false);
  const [linkValue, setLinkValue] = useState('');
  const [isCheckingLink, setIsCheckingLink] = useState(false);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [2, 3] },
        // Links only come from the "Add validated link" box, never from typing or pasting
        link: {
          openOnClick: false,
          autolink: false,
          linkOnPaste: false,
          HTMLAttributes: { rel: 'noopener noreferrer nofollow', target: '_blank' },
        },
        // Not part of the campus policy
        codeBlock: false,
        horizontalRule: false,
        strike: false,
      }),
    ],
    content: initialContent,
    shouldRerenderOnTransaction: true, // keeps the active state of the toolbar buttons up to date
    onUpdate: ({ editor: current }) => onChange(current.isEmpty ? '' : current.getHTML()),
    editorProps: {
      attributes: {
        class: 'rich-content min-h-[200px] p-4 text-base sm:text-sm text-slate-800 focus:outline-none leading-relaxed',
        role: 'textbox',
        'aria-multiline': 'true',
        'aria-label': 'Description or article',
      },
      // Block image paste and strip pasted formatting (pasted links would skip the safety check)
      handlePaste: (view, event) => {
        const items = Array.from(event.clipboardData?.items || []);
        
        // Check if the pasted content contains any images. If it does, prevent the paste and show an error message.
        if (items.some(({ type }) => type.startsWith('image/'))) {
          event.preventDefault();
          toast.error('Images are not allowed in articles. Only formatted text is supported.');
          return true; // true মানে আমরা ইভেন্টটি থামিয়ে দিয়েছি
        }

        // if there is not image then paste the text with formatting stripped
        return false;
      },
      
      // Block image/file drag and drop (moving text inside the editor still works)
      handleDrop: (view, event) => {
        if (!event.dataTransfer?.files?.length) return false;
        event.preventDefault();
        toast.error('Dropping images or files is disabled.');
        return true;
      },
    },
  });

  if (!editor) return null;

  const closeLinkBox = () => {
    setIsLinkBoxOpen(false);
    setLinkValue('');
  };

  // Validate the link on the server (unmask + safety check) before inserting it
  const handleInsertLink = async () => {
    const trimmed = linkValue.trim();
    if (!HTTPS_LINK_REGEX.test(trimmed)) {
      toast.error('Enter a valid link that starts with https://');
      return;
    }

    setIsCheckingLink(true);
    try {
      const token = await firebaseUser?.getIdToken();
      const { data } = await apiRequest('/api/links/verify', {
        method: 'POST',
        token,
        body: { externalLink: trimmed },
        retry: true,
      });
      const safeUrl = data.unmaskedLink || trimmed;

      if (editor.state.selection.empty) {
        // Nothing selected: insert the link as its own text
        editor
          .chain()
          .focus()
          .insertContent({ type: 'text', text: trimmed, marks: [{ type: 'link', attrs: { href: safeUrl } }] })
          .insertContent(' ')
          .run();
      } else {
        editor.chain().focus().extendMarkRange('link').setLink({ href: safeUrl }).run();
      }

      toast.success('Verified link added.');
      closeLinkBox();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsCheckingLink(false);
    }
  };

  return (
    <div className="border border-slate-300 rounded-xl overflow-hidden bg-white focus-within:border-indigo-500 focus-within:ring-4 focus-within:ring-indigo-100 transition">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 px-2.5 py-2 bg-slate-50 border-b border-slate-200">
        <div className="flex flex-wrap items-center gap-1" role="toolbar" aria-label="Text formatting">
          <ToolButton label="Bold" active={editor.isActive('bold')} onClick={() => editor.chain().focus().toggleBold().run()}>
            <Bold size={16} />
          </ToolButton>
          <ToolButton label="Italic" active={editor.isActive('italic')} onClick={() => editor.chain().focus().toggleItalic().run()}>
            <Italic size={16} />
          </ToolButton>
          <ToolButton label="Underline" active={editor.isActive('underline')} onClick={() => editor.chain().focus().toggleUnderline().run()}>
            <Underline size={16} />
          </ToolButton>
          <span className="w-px h-5 bg-slate-200 mx-1" />
          <ToolButton label="Heading" active={editor.isActive('heading', { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
            <Heading2 size={16} />
          </ToolButton>
          <ToolButton label="Bullet list" active={editor.isActive('bulletList')} onClick={() => editor.chain().focus().toggleBulletList().run()}>
            <List size={16} />
          </ToolButton>
          <ToolButton label="Numbered list" active={editor.isActive('orderedList')} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
            <ListOrdered size={16} />
          </ToolButton>
          <ToolButton label="Inline code" active={editor.isActive('code')} onClick={() => editor.chain().focus().toggleCode().run()}>
            <Code size={16} />
          </ToolButton>
          <span className="w-px h-5 bg-slate-200 mx-1" />
          <ToolButton
            label="Add validated link"
            active={editor.isActive('link')}
            onClick={() => setIsLinkBoxOpen(true)}
            className="flex items-center gap-1.5 text-xs font-medium"
          >
            <Link2 size={16} /> <span className="hidden sm:inline">Add validated link</span>
            <span className="sm:hidden">Link</span>
          </ToolButton>
        </div>

        <div className="flex items-center gap-2">
          <Type size={15} className="text-indigo-500" />
          <select
            value={selectedFont}
            onChange={(e) => onFontChange(e.target.value)}
            aria-label="Font"
            className="bg-white text-xs text-slate-700 px-2.5 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:border-indigo-500"
          >
            {EDITOR_FONTS.map(({ name, label }) => (
              <option key={name} value={name}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Link box */}
      {isLinkBoxOpen && (
        <div className="flex items-center gap-2 px-3 py-2.5 bg-indigo-50/60 border-b border-indigo-100">
          <input
            type="url"
            autoFocus
            value={linkValue}
            onChange={(e) => setLinkValue(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleInsertLink())}
            placeholder="https://drive.google.com/..."
            aria-label="Link address"
            className="input !py-2"
          />
          <button type="button" onClick={handleInsertLink} disabled={isCheckingLink} className="btn-primary !px-3 !py-2" title="Verify and add">
            {isCheckingLink ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
          </button>
          <button type="button" onClick={closeLinkBox} className="btn-secondary !px-3 !py-2" title="Cancel">
            <X size={16} />
          </button>
        </div>
      )}

      {/* Editable area */}
      <div className="relative" style={{ fontFamily: `'${selectedFont}', sans-serif` }}>
        {editor.isEmpty && (
          <p className="pointer-events-none absolute left-4 top-4 text-base sm:text-sm text-slate-400">
            Write your article, study notes or project details here. Headings, lists, code and verified links are supported.
          </p>
        )}
        <EditorContent editor={editor} />
      </div>

      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 text-xs text-slate-400 flex flex-wrap justify-between gap-x-4">
        <span>Images are disabled by campus policy</span>
        <span>Font: {selectedFont}</span>
      </div>
    </div>
  );
};