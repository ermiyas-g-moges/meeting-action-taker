import { invoke } from '@tauri-apps/api/tauri';
import { useState } from 'react';

export default function AudioRecorder({ setActionItems, setLog }) {
  const [recording, setRecording] = useState(false);

  const startRecording = async () => {
    setLog('Starting audio recording...');
    setRecording(true);
    try {
      await invoke('start_audio_recording');
      setLog('Recording in progress. Stop when finished.');
    } catch (error) {
      setLog(`Failed to start recording: ${error}`);
      setRecording(false);
    }
  };

  const stopRecording = async () => {
    setLog('Stopping recording and extracting action items...');
    setRecording(false);
    try {
      const transcription = await invoke('transcribe_audio');
      setLog('Transcription received. Extracting action items...');
      const items = await invoke('extract_action_items', { text: transcription });
      setActionItems(items);
      setLog('Action items extracted successfully.');
    } catch (error) {
      setLog(`Error processing audio: ${error}`);
    }
  };

  const createTasks = async () => {
    setLog('Creating tasks in integrations...');
    try {
      await invoke('create_tasks_for_action_items');
      setLog('Tasks created successfully.');
    } catch (error) {
      setLog(`Task creation failed: ${error}`);
    }
  };

  return (
    <section className="panel rounded-3xl border p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--text-color)]">Audio Recorder</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Record your meeting and generate action items automatically.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button className="button-primary rounded-xl px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60" onClick={startRecording} disabled={recording}>
          Start Recording
        </button>
        <button className="button-primary rounded-xl px-5 py-3 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60" onClick={stopRecording} disabled={!recording}>
          Stop Recording
        </button>
      </div>
      <div className="mt-3 flex flex-wrap gap-3">
        <button className="button-secondary rounded-xl px-5 py-3 text-sm font-medium transition" onClick={createTasks}>
          Create Tasks
        </button>
      </div>
    </section>
  );
}
