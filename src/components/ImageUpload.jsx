import { invoke } from '@tauri-apps/api/tauri';
import { useState } from 'react';

export default function ImageUpload({ setLog, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const uploadImage = async () => {
    if (!selectedFile) {
      setLog('Please select an image first.');
      return;
    }

    const buffer = await selectedFile.arrayBuffer();
    try {
      await invoke('upload_image', { 
        payload: { 
          name: selectedFile.name, 
          data: Array.from(new Uint8Array(buffer)) 
        } 
      });
      setLog('Image uploaded successfully.');
      setSelectedFile(null);
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      setLog(`Image upload failed: ${error}`);
    }
  };

  return (
    <section className="panel rounded-3xl border p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--text-color)]">Image Upload</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Attach snapshots or whiteboard images to keep extra context.</p>
      <input
        className="themed-input mt-4 w-full rounded-xl border px-4 py-3"
        type="file"
        accept="image/*"
        onChange={(event) => setSelectedFile(event.target.files?.[0] ?? null)}
      />
      <button className="button-primary mt-4 w-full rounded-xl px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60" onClick={uploadImage} disabled={!selectedFile}>
        Upload Image
      </button>
    </section>
  );
}
