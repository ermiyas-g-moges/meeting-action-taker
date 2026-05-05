import { useEffect, useState } from 'react';

import MeetingRecorder from './components/AudioRecorder';
import ImageUpload from './components/ImageUpload';
import Settings from './components/Settings';
import VideoArchives from './components/VideoArchives';
import ImageArchives from './components/ImageArchives';

function App() {
  const [log, setLog] = useState('Ready to record.');
  const [theme, setTheme] = useState('dark');
  const [view, setView] = useState('recorder');
  const [isRecording, setIsRecording] = useState(false);
  const [archiveRefreshTrigger, setArchiveRefreshTrigger] = useState(0);

  const triggerArchiveRefresh = () => setArchiveRefreshTrigger(prev => prev + 1);

  useEffect(() => {
    document.body.classList.remove('theme-dark', 'theme-light');
    document.body.classList.add(`theme-${theme}`);
  }, [theme]);

  const rootClassName = `h-screen overflow-hidden theme-${theme} bg-[var(--app-bg)] text-[var(--text-color)]`;
  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  const renderView = () => {
    return (
      <div className="flex-1 relative overflow-hidden">
        {/* Recorder View - Hidden but persistent */}
        <div className={`h-full ${view === 'recorder' ? 'block' : 'hidden'}`}>
          <div className="grid h-full gap-4 overflow-y-auto pr-1 xl:grid-cols-[1.35fr_1fr]">
            <div className="grid gap-4">
              <MeetingRecorder 
                setLog={setLog} 
                isRecording={isRecording} 
                setIsRecording={setIsRecording} 
                onRecordingSaved={triggerArchiveRefresh}
              />
              <ImageUpload setLog={setLog} onUploadSuccess={triggerArchiveRefresh} />
            </div>
            <div className="grid gap-4 content-start">
              <section className="panel rounded-2xl border p-4 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-semibold text-[var(--text-color)]">Status Log</h2>
                    <p className="mt-1 text-sm text-[var(--text-secondary)]">Latest operation updates.</p>
                  </div>
                </div>
                <p className="mt-4 rounded-xl border border-[var(--panel-border)] bg-[var(--panel-muted)] px-4 py-3 text-sm text-[var(--text-secondary)]">{log}</p>
              </section>
              <section className="panel-muted rounded-xl border border-[var(--panel-border)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-soft)]">System Status</p>
                <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">All systems operational</p>
              </section>
            </div>
          </div>
        </div>

        {/* Archives View */}
        <div className={`h-full ${view === 'archives' ? 'block' : 'hidden'}`}>
          <VideoArchives refreshTrigger={archiveRefreshTrigger} />
        </div>

        {/* Image Uploads View */}
        <div className={`h-full ${view === 'uploads' ? 'block' : 'hidden'}`}>
          <ImageArchives refreshTrigger={archiveRefreshTrigger} />
        </div>

        {/* Settings View */}
        {view === 'settings' && <Settings />}
      </div>
    );
  };

  return (
    <div className={rootClassName}>
      <div className="mx-auto h-full max-w-[1480px] px-4 py-4 md:px-6 md:py-6">
        <div className="grid h-full gap-4 lg:grid-cols-[260px_1fr]">
          <aside className="panel flex h-full flex-col overflow-hidden rounded-2xl border p-4 shadow-sm">
            <div className="border-b border-[var(--panel-border)] pb-4">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--text-soft)]">Meeting Ops</p>
              <h1 className="mt-1 text-xl font-semibold">Video Taker</h1>
              <p className="mt-2 text-sm text-[var(--text-secondary)]">Record and archive meetings locally.</p>
            </div>

            <nav className="mt-4 grid gap-2">
              <button
                type="button"
                onClick={() => setView('recorder')}
                className={`nav-item ${view === 'recorder' ? 'nav-item-active' : ''}`}
              >
                Recorder
              </button>
              <button
                type="button"
                onClick={() => setView('archives')}
                className={`nav-item ${view === 'archives' ? 'nav-item-active' : ''}`}
              >
                Video Archives
              </button>
              <button
                type="button"
                onClick={() => setView('uploads')}
                className={`nav-item ${view === 'uploads' ? 'nav-item-active' : ''}`}
              >
                Image Uploads
              </button>
              <button
                type="button"
                onClick={() => setView('settings')}
                className={`nav-item ${view === 'settings' ? 'nav-item-active' : ''}`}
              >
                Settings
              </button>
            </nav>

            <div className="mt-auto pt-4 border-t border-[var(--panel-border)]">
              <p className="text-[10px] text-[var(--text-soft)] uppercase tracking-wider">Storage Location</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1 truncate">./recordings</p>
            </div>
          </aside>

          <main className="panel flex h-full flex-col overflow-hidden rounded-2xl border p-4 shadow-sm md:p-5">
            <header className="mb-4 flex flex-wrap items-center justify-between gap-3 border-b border-[var(--panel-border)] pb-4">
              <div>
                <h2 className="text-xl font-semibold">Workspace</h2>
                <p className="text-sm text-[var(--text-secondary)]">Capture and save your sessions with ease.</p>
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
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-soft)]">Mode</p>
                <p className="mt-1 text-lg font-semibold">Video + Audio</p>
              </section>
              <section className="panel-muted rounded-xl border border-[var(--panel-border)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-soft)]">Privacy</p>
                <p className="mt-1 text-sm font-medium text-green-500">Local Only</p>
              </section>
              <section className="panel-muted rounded-xl border border-[var(--panel-border)] px-4 py-3">
                <p className="text-xs uppercase tracking-[0.12em] text-[var(--text-soft)]">Format</p>
                <p className="mt-1 text-sm font-medium text-[var(--text-secondary)]">WebM (VP8/Opus)</p>
              </section>
            </div>

            {renderView()}
          </main>
        </div>
      </div>
    </div>
  );
}

export default App;
