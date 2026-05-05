import { useState, useEffect } from 'react';
import { invoke } from '@tauri-apps/api/tauri';
import { convertFileSrc } from '@tauri-apps/api/tauri';

export default function VideoArchives({ refreshTrigger }) {
  const [recordings, setRecordings] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchRecordings = async () => {
    setLoading(true);
    try {
      const files = await invoke('list_recordings');
      setRecordings(files);
    } catch (error) {
      console.error('Failed to fetch recordings:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, [refreshTrigger]);

  const handlePlayVideo = async (fileName) => {
    // In Tauri, we need to get the absolute path to convert it to a URL
    // For simplicity, we'll assume they are in the recordings/ folder relative to cwd
    // But since we don't have the full path here, we'll need a command to get it
    // Or just use the fact that we know it's in the recordings folder.
    try {
      // We'll call a command to get the full path for a recording
      const fullPath = await invoke('get_recording_path', { name: fileName });
      const assetUrl = convertFileSrc(fullPath);
      setSelectedVideo(assetUrl);
    } catch (err) {
      console.error('Error playing video:', err);
    }
  };

  return (
    <div className="grid h-full gap-6 overflow-hidden md:grid-cols-[300px_1fr]">
      {/* Sidebar: List of recordings */}
      <section className="panel flex flex-col overflow-hidden rounded-2xl border shadow-sm">
        <div className="border-b border-[var(--panel-border)] p-4">
          <h2 className="text-lg font-semibold">Recordings</h2>
          <button 
            onClick={fetchRecordings}
            className="mt-2 text-xs text-[var(--accent)] hover:underline"
          >
            Refresh List
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <p className="p-4 text-sm text-[var(--text-soft)]">Loading...</p>
          ) : recordings.length === 0 ? (
            <p className="p-4 text-sm text-[var(--text-soft)] italic">No recordings found.</p>
          ) : (
            <ul className="space-y-1">
              {recordings.map((file) => (
                <li key={file}>
                  <button
                    onClick={() => handlePlayVideo(file)}
                    className="w-full rounded-lg px-3 py-2 text-left text-sm transition hover:bg-[var(--panel-muted)] hover:text-[var(--accent)]"
                  >
                    <div className="truncate font-medium">{file}</div>
                    <div className="text-[10px] text-[var(--text-soft)]">Video Recording</div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {/* Main: Video Player */}
      <section className="panel flex flex-col items-center justify-center overflow-hidden rounded-2xl border shadow-sm">
        {selectedVideo ? (
          <div className="flex h-full w-full flex-col p-4">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-[var(--text-secondary)]">Now Playing</h3>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="text-xs text-red-400 hover:underline"
              >
                Close Player
              </button>
            </div>
            <div className="relative flex-1 overflow-hidden rounded-xl bg-black shadow-inner">
              <video 
                key={selectedVideo}
                controls 
                autoPlay
                className="h-full w-full object-contain"
                onError={(e) => console.error('Video error:', e)}
              >
                <source src={selectedVideo} type={selectedVideo.endsWith('.mp4') ? 'video/mp4' : 'video/webm'} />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--panel-muted)]">
              <svg className="h-8 w-8 text-[var(--text-soft)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Select a video to play</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Choose a meeting recording from the list on the left.</p>
          </div>
        )}
      </section>
    </div>
  );
}
