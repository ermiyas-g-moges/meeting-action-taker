import { useState, useEffect } from 'react';
import { invoke, convertFileSrc } from '@tauri-apps/api/tauri';

export default function ImageArchives({ refreshTrigger }) {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const files = await invoke('list_images');
      setImages(files);
    } catch (error) {
      console.error('Failed to fetch images:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, [refreshTrigger]);

  const handleViewImage = async (fileName) => {
    try {
      const fullPath = await invoke('get_image_path', { name: fileName });
      const assetUrl = convertFileSrc(fullPath);
      setSelectedImage(assetUrl);
    } catch (err) {
      console.error('Error loading image:', err);
    }
  };

  const handleDeleteImage = async (fileName, e) => {
    e.stopPropagation();
    if (window.confirm(`Are you sure you want to delete "${fileName}"?`)) {
      try {
        await invoke('delete_image', { name: fileName });
        if (selectedImage && selectedImage.includes(fileName)) {
          setSelectedImage(null);
        }
        fetchImages();
      } catch (err) {
        console.error('Error deleting image:', err);
        alert('Failed to delete image: ' + err);
      }
    }
  };

  return (
    <div className="grid h-full gap-6 overflow-hidden md:grid-cols-[300px_1fr]">
      {/* Sidebar: List of images */}
      <section className="panel flex flex-col overflow-hidden rounded-2xl border shadow-sm">
        <div className="border-b border-[var(--panel-border)] p-4">
          <h2 className="text-lg font-semibold">Captured Images</h2>
          <button 
            onClick={fetchImages}
            className="mt-2 text-xs text-[var(--accent)] hover:underline"
          >
            Refresh List
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-2">
          {loading ? (
            <p className="p-4 text-sm text-[var(--text-soft)]">Loading...</p>
          ) : images.length === 0 ? (
            <p className="p-4 text-sm text-[var(--text-soft)] italic">No images found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-2 p-1">
              {images.map((file) => (
                <div key={file} className="group relative aspect-square">
                  <button
                    onClick={() => handleViewImage(file)}
                    className="h-full w-full overflow-hidden rounded-lg border border-[var(--panel-border)] transition hover:border-[var(--accent)]"
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-[var(--panel-muted)] text-[10px] text-[var(--text-soft)] group-hover:text-[var(--accent)]">
                      IMG
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-[8px] text-white truncate">
                      {file}
                    </div>
                  </button>
                  <button
                    onClick={(e) => handleDeleteImage(file, e)}
                    className="absolute right-1 top-1 rounded-md bg-black/40 p-1 text-white opacity-0 transition hover:bg-red-500 group-hover:opacity-100"
                    title="Delete image"
                  >
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Main: Image Viewer */}
      <section className="panel flex flex-col items-center justify-center overflow-hidden rounded-2xl border shadow-sm p-4">
        {selectedImage ? (
          <div className="flex h-full w-full flex-col">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-medium text-[var(--text-secondary)]">Image Preview</h3>
              <button 
                onClick={() => setSelectedImage(null)}
                className="text-xs text-red-400 hover:underline"
              >
                Close Preview
              </button>
            </div>
            <div className="relative flex-1 overflow-auto rounded-xl bg-[var(--panel-muted)] flex items-center justify-center p-4">
              <img 
                src={selectedImage} 
                alt="Selected"
                className="max-h-full max-w-full object-contain shadow-lg"
              />
            </div>
          </div>
        ) : (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[var(--panel-muted)]">
              <svg className="h-8 w-8 text-[var(--text-soft)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium">Select an image to view</h3>
            <p className="mt-1 text-sm text-[var(--text-secondary)]">Choose an image from the gallery on the left.</p>
          </div>
        )}
      </section>
    </div>
  );
}
