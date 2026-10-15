export default function AdminLoading() {
  return (
    <div className="space-y-6" role="status" aria-label="Loading admin section">
      <span className="sr-only">Loading admin section…</span>
      <div className="admin-card space-y-3">
        <div className="admin-loading-line h-3 w-28" />
        <div className="admin-loading-line h-7 w-56 max-w-full" />
        <div className="admin-loading-line h-4 w-80 max-w-full" />
      </div>
      <div className="grid gap-4 sm:grid-cols-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="admin-card space-y-4">
            <div className="admin-loading-line h-3 w-20" />
            <div className="admin-loading-line h-8 w-14" />
            <div className="admin-loading-line h-4 w-32" />
          </div>
        ))}
      </div>
    </div>
  );
}
