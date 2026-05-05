import { invoke } from '@tauri-apps/api/tauri';
import { useState, useRef } from 'react';

export default function MeetingRecorder({ setLog, isRecording, setIsRecording, onRecordingSaved }) {
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);

  const startRecording = async () => {
    setLog('Requesting screen and microphone permissions...');
    try {
      // 1. Get screen stream
      const screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100,
        }
      });

      // 2. Get microphone stream
      let micStream;
      try {
        micStream = await navigator.mediaDevices.getUserMedia({
          audio: {
            echoCancellation: true,
            noiseSuppression: true,
          }
        });
      } catch (err) {
        console.warn('Microphone access denied or not found:', err);
      }

      // 3. Combine tracks
      const combinedTracks = [...screenStream.getTracks()];
      if (micStream) {
        combinedTracks.push(...micStream.getAudioTracks());
      }
      
      const combinedStream = new MediaStream(combinedTracks);

      setLog('Starting video recording with audio...');
      
      let mimeType = 'video/mp4';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm;codecs=vp8,opus';
        setLog('MP4 not supported by browser, using WebM...');
      }

      const mediaRecorder = new MediaRecorder(combinedStream, { mimeType });

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        setLog('Processing video data...');
        const extension = mimeType.includes('mp4') ? 'mp4' : 'webm';
        const blob = new Blob(chunksRef.current, { type: mimeType });
        const arrayBuffer = await blob.arrayBuffer();
        const bytes = new Uint8Array(arrayBuffer);

        const fileName = `meeting_${Date.now()}.${extension}`;
        setLog(`Saving video to recordings/${fileName}...`);
        
        try {
          const data = Array.from(bytes);
          await invoke('save_video', { payload: { name: fileName, data } });
          setLog(`Video saved successfully: ${fileName}`);
          if (onRecordingSaved) onRecordingSaved();
        } catch (err) {
          setLog(`Failed to save video: ${err}`);
        }

        combinedStream.getTracks().forEach(track => track.stop());
        chunksRef.current = [];
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start();
      setIsRecording(true);
      setLog('Recording in progress...');
    } catch (error) {
      setLog(`Failed to start recording: ${error.message}`);
      setIsRecording(false);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      setLog('Stopping recording...');
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  return (
    <section className="panel rounded-3xl border p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--text-color)]">Meeting Recorder</h2>
      <p className="mt-1 text-sm text-[var(--text-secondary)]">Record your screen and audio for meeting archives.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        {!isRecording ? (
          <button 
            className="button-primary rounded-xl px-5 py-3 text-sm font-medium transition" 
            onClick={startRecording}
          >
            Start Recording
          </button>
        ) : (
          <button 
            className="bg-red-500 hover:bg-red-600 text-white rounded-xl px-5 py-3 text-sm font-medium transition animate-pulse" 
            onClick={stopRecording}
          >
            Stop Recording
          </button>
        )}
      </div>
      {isRecording && (
        <div className="mt-4 flex items-center gap-2 text-red-500">
          <span className="h-2 w-2 animate-ping rounded-full bg-red-500"></span>
          <span className="text-xs font-medium uppercase">Recording in background</span>
        </div>
      )}
    </section>
  );
}
