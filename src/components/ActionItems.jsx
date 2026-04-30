export default function ActionItems({ actionItems }) {
  return (
    <section className="panel rounded-3xl border p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--text-color)]">Action Items</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Automatically extracted from your meeting transcript.</p>
      {actionItems.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-[var(--panel-border)] bg-[var(--panel-muted)] px-4 py-3 text-sm text-[var(--text-secondary)]">
          No items yet. Start a recording, then stop it to run extraction.
        </p>
      ) : (
        <ol className="mt-4 space-y-3 text-[var(--text-secondary)]">
          {actionItems.map((item, index) => (
            <li key={index} className="flex gap-3 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-muted)] px-4 py-3">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
                {index + 1}
              </span>
              <span className="text-sm leading-6 text-[var(--text-color)]">{item}</span>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
