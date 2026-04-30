import { useEffect, useState } from 'react';

import ActionItems from './components/ActionItems';
import AudioRecorder from './components/AudioRecorder';
import ImageUpload from './components/ImageUpload';
import Settings from './components/Settings';

function App() {
  const [actionItems, setActionItems] = useState([]);
  const [log, setLog] = useState('Ready to record.');
  const [theme, setTheme] = useState('dark');

  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const rootClassName = `h-screen overflow-hidden theme-${theme} bg-[var(--app-bg)] text-[var(--text-color)]`;
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  return (
    <div className={rootClassName}>
      <div className="mx-auto h-full max-w-[1480px] px-4 py-4 md:px-6 md:py-6">
        <div className="grid h-full gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="panel flex h-full flex-col overflow-hidden rounded-2xl border p-4 shadow-sm">
            <div className="border-b border-[var(--panel-border)] pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">Meeting Ops</p>
              <h1 className="mt-1 text-xl font-semibold">Action Taker</h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">Turn meeting notes into trackable tasks.</p>
            </div>

            <nav className="mt-4 grid gap-2">
              <button type="button" className="nav-item nav-item-active">Recorder</button>
              <button type="button" className="nav-item">Action Items</button>
              <button type="button" className="nav-item">Integrations</button>
              <button type="button" className="nav-item">Uploads</button>
            </nav>

            <div className="mt-4 grid flex-1 gap-4 overflow-y-auto pr-1">
              <Settings />
            </div>
          </aside>

          <main className="panel flex h-full flex-col overflow-hidden rounded-2xl border p-4 shadow-sm md:p-5">
            <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--panel-border)] pb-4">
              <div>
                <h2 className="text-xl font-semibold">Workspace</h2>
                <p className="text-sm text-[var(--text-secondary)]">Record, process, and dispatch tasks from one place.</p>
              </div>
              <button
                type="button"
                onClick={toggleTheme}
                className="inline-flex h-10 items-center justify-center rounded-lg border border-[var(--panel-border)] bg-[var(--panel-muted)] px-4 text-sm font-medium text-[var(--text-color)] transition hover:border-[var(--accent)] hover:text-[var(--accent)]"
              >
                {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
              </button>
            </header>

            <div className="mb-4 grid gap-3 md:grid-cols-3">
              <section className="panel-muted rounded-xl border border-[var(--panel-border)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-soft)]">Extracted Items</p>
                <p className="mt-1 text-2xl font-semibold">{actionItems.length}</p>
              </section>
              <section className="panel-muted rounded-xl border border-[var(--panel-border)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-soft)]">Recorder</p>
                <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">Ready for next session</p>
              </section>
              <section className="panel-muted rounded-xl border border-[var(--panel-border)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-soft)]">Pipeline</p>
                <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">Audio to Transcript to Tasks</p>
              </section>
            </div>

            <div className="grid flex-1 gap-4 overflow-y-auto pr-1 xl:grid-cols-[1.35fr_1fr]">
              <div className="grid gap-4">
                <AudioRecorder setActionItems={setActionItems} setLog={setLog} />
                <ImageUpload setLog={setLog} />
              </div>
              <div className="grid gap-4">
                <ActionItems actionItems={actionItems} />
                <section className="panel rounded-2xl border p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold text-[var(--text-color)]">Status Log</h2>
                      <p className="mt-1 text-sm text-[var(--text-secondary)]">Latest operation updates.</p>
                    </div>
                  </div>
                  <p className="mt-4 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-muted)] px-4 py-3 text-sm text-[var(--text-secondary)]">{log}</p>
                </section>
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
