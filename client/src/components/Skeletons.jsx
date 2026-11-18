// client/src/components/Skeletons.jsx
// Loading placeholders that match the real layouts, so the page does not jump when data arrives.
// They use the .skeleton shimmer class from index.css.

export const Bone = ({ className = '' }) => <div className={`skeleton ${className}`} aria-hidden="true" />;

// Wrapper that announces "loading" to screen readers once for the whole skeleton
const Loading = ({ className = '', children }) => (
  <div role="status" aria-busy="true" className={className}>
    <span className="sr-only">Loading...</span>
    {children}
  </div>
);

// Resource feed card
export const PostCardSkeleton = () => (
  <div className="card p-5 space-y-4" aria-hidden="true">
    <div className="flex gap-2">
      <Bone className="h-5 w-24 rounded-full" />
      <Bone className="h-5 w-32 rounded-full" />
    </div>
    <Bone className="h-5 w-3/4 rounded-lg" />
    <div className="space-y-2">
      <Bone className="h-3 rounded" />
      <Bone className="h-3 w-5/6 rounded" />
      <Bone className="h-3 w-2/3 rounded" />
    </div>
    <div className="flex items-center justify-between pt-4 border-t border-slate-100">
      <div className="flex items-center gap-2">
        <Bone className="h-6 w-6 rounded-full" />
        <Bone className="h-3 w-20 rounded" />
      </div>
      <Bone className="h-3 w-16 rounded" />
    </div>
    <Bone className="h-10 rounded-xl" />
  </div>
);

// Generic form-style page (create post, complete profile, route guards)
export const PageSkeleton = () => (
  <Loading className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">
    <Bone className="h-8 w-56 rounded-lg" />
    <Bone className="h-4 w-80 max-w-full rounded" />
    <div className="card p-6 space-y-5">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="space-y-2">
          <Bone className="h-3 w-24 rounded" />
          <Bone className="h-11 rounded-xl" />
        </div>
      ))}
      <Bone className="h-11 w-40 rounded-xl" />
    </div>
  </Loading>
);

// Public profile page
export const ProfileSkeleton = () => (
  <Loading className="max-w-6xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6 sm:space-y-8">
    <div className="card p-5 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
      <div className="flex items-center gap-4 sm:gap-5">
        <Bone className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl shrink-0" />
        <div className="space-y-2.5">
          <Bone className="h-6 w-44 rounded-lg" />
          <Bone className="h-4 w-28 rounded" />
          <Bone className="h-5 w-52 rounded-full" />
        </div>
      </div>
      <div className="flex items-center gap-4">
        <Bone className="h-16 w-56 rounded-2xl" />
        <Bone className="h-11 w-36 rounded-xl" />
      </div>
    </div>

    <div className="card p-5 sm:p-6 space-y-4">
      <Bone className="h-5 w-40 rounded-lg" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <Bone key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    </div>

    <div className="flex gap-2 border-b border-slate-200 pb-3">
      {Array.from({ length: 3 }, (_, i) => (
        <Bone key={i} className="h-9 w-28 rounded-full" />
      ))}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      <PostCardSkeleton />
      <PostCardSkeleton />
    </div>
  </Loading>
);

// Admin dashboard: sidebar + filters + stat cards + chart
export const DashboardSkeleton = () => (
  <Loading className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 grid lg:grid-cols-[230px_minmax(0,1fr)] gap-6 lg:gap-8">
    <div className="card p-3 space-y-2 lg:self-start">
      <Bone className="h-4 w-24 rounded mx-3 my-3" />
      {Array.from({ length: 5 }, (_, i) => (
        <Bone key={i} className="h-10 rounded-xl" />
      ))}
    </div>

    <div className="space-y-6 min-w-0">
      <div className="flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <Bone className="h-10 w-64 rounded-xl" />
        <div className="flex gap-3">
          <Bone className="h-10 w-44 rounded-xl" />
          <Bone className="h-10 w-48 sm:w-72 rounded-xl" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className="card p-5 space-y-3">
            <Bone className="h-3 w-20 rounded" />
            <Bone className="h-8 w-16 rounded-lg" />
          </div>
        ))}
      </div>

      <div className="card p-6 space-y-4">
        <Bone className="h-5 w-40 rounded-lg" />
        <Bone className="h-72 rounded-xl" />
      </div>
    </div>
  </Loading>
);

// Single post page
export const PostDetailSkeleton = () => (
  <Loading className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-6">
    <Bone className="h-4 w-36 rounded" />
    <div className="flex gap-2">
      <Bone className="h-5 w-24 rounded-full" />
      <Bone className="h-5 w-40 rounded-full" />
    </div>
    <Bone className="h-9 w-4/5 rounded-lg" />
    <div className="flex items-center gap-3">
      <Bone className="h-8 w-8 rounded-full" />
      <Bone className="h-4 w-40 rounded" />
    </div>
    <div className="card p-6 space-y-3">
      {Array.from({ length: 7 }, (_, i) => (
        <Bone key={i} className={`h-3 rounded ${i % 3 === 2 ? 'w-2/3' : ''}`} />
      ))}
    </div>
    <Bone className="h-12 rounded-xl" />
  </Loading>
);