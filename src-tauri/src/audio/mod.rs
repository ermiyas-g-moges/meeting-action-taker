// src-tauri/src/audio/mod.rs
use std::path::PathBuf;
use std::sync::{Arc, Mutex};

use anyhow::Result;
use cpal::traits::{DeviceTrait, HostTrait, StreamTrait};
use once_cell::sync::Lazy;
use hound;
use chrono;



// cpal::Stream is not Send on all platforms (e.g., Windows).
// We wrap it in a struct and unsafely implement Send because we'll 
// only ever access it through a Mutex.
struct SendStream(cpal::Stream);
unsafe impl Send for SendStream {}

// Global recorder state
static RECORDER: Lazy<Mutex<Option<Recorder>>> = Lazy::new(|| Mutex::new(None));

struct Recorder {
    stream: SendStream,
    // Keep writer alive while recording
    _writer: Arc<Mutex<hound::WavWriter<std::io::BufWriter<std::fs::File>>>>,
    output_path: PathBuf,
}

/// Start a new audio recording. Returns the path to the temporary wav file.
pub fn start_recording() -> Result<String> {
    // Create recordings directory outside of src-tauri to avoid dev watcher loop
    let storage_path = std::env::current_dir()?.join("recordings");
    // If we are in src-tauri, go up one level
    let storage_path = if storage_path.to_string_lossy().contains("src-tauri") {
        storage_path.parent().unwrap().parent().unwrap().join("recordings")
    } else {
        storage_path
    };
    std::fs::create_dir_all(&storage_path)?;
    let output_file = storage_path.join(format!("meeting_{}.wav", chrono::Utc::now().timestamp()));

    // Setup CPAL
    let host = cpal::default_host();
    let device = host
        .default_input_device()
        .ok_or_else(|| anyhow::anyhow!("No default input device found"))?;
    let config = device.default_input_config()?;

    // WAV writer matching input format
    let spec = hound::WavSpec {
        channels: config.channels() as u16,
        sample_rate: config.sample_rate().0,
        bits_per_sample: 16,
        sample_format: hound::SampleFormat::Int,
    };
    let writer = hound::WavWriter::create(&output_file, spec)?;
    let writer = Arc::new(Mutex::new(writer));

    // Build audio stream
    let writer_clone = writer.clone();
    let err_fn = move |err| eprintln!("Audio stream error: {}", err);
    let stream = match config.sample_format() {
        cpal::SampleFormat::I16 => device.build_input_stream(
            &config.into(),
            move |data: &[i16], _: &cpal::InputCallbackInfo| {
                let mut w = writer_clone.lock().unwrap();
                for &sample in data {
                    let _ = w.write_sample(sample);
                }
            },
            err_fn,
            None,
        )?,
        cpal::SampleFormat::U16 => device.build_input_stream(
            &config.into(),
            move |data: &[u16], _: &cpal::InputCallbackInfo| {
                let mut w = writer_clone.lock().unwrap();
                for &sample in data {
                    let sample_i16 = (sample as i32 - 32768) as i16;
                    let _ = w.write_sample(sample_i16);
                }
            },
            err_fn,
            None,
        )?,
        cpal::SampleFormat::F32 => device.build_input_stream(
            &config.into(),
            move |data: &[f32], _: &cpal::InputCallbackInfo| {
                let mut w = writer_clone.lock().unwrap();
                for &sample in data {
                    let sample_i16 = (sample * i16::MAX as f32) as i16;
                    let _ = w.write_sample(sample_i16);
                }
            },
            err_fn,
            None,
        )?,
        _ => return Err(anyhow::anyhow!("Unsupported sample format")),
    };

    // Store recorder globally and start stream
    let recorder = Recorder {
        stream: SendStream(stream),
        _writer: writer,
        output_path: output_file.clone(),
    };
    *RECORDER.lock().unwrap() = Some(recorder);
    RECORDER.lock().unwrap().as_ref().unwrap().stream.0.play()?;
    Ok(output_file.to_string_lossy().to_string())
}

/// Stop the current recording and finalize the WAV file. Returns the path.
pub fn stop_recording() -> Result<String> {
    let mut guard = RECORDER.lock().unwrap();
    if let Some(rec) = guard.take() {
        // Dropping the stream stops capture. Writer is flushed on drop.
        drop(rec.stream);
        Ok(rec.output_path.to_string_lossy().to_string())
    } else {
        Err(anyhow::anyhow!("No active recording"))
    }
}

/// Retrieve the most recent recording path (if any).
pub fn last_recording_path() -> Result<PathBuf> {
    let guard = RECORDER.lock().unwrap();
    if let Some(rec) = guard.as_ref() {
        Ok(rec.output_path.clone())
    } else {
    let dir = std::env::current_dir()?.join("recordings");
    let dir = if dir.to_string_lossy().contains("src-tauri") {
        dir.parent().unwrap().parent().unwrap().join("recordings")
    } else {
        dir
    };
        let mut entries = std::fs::read_dir(&dir)?
            .filter_map(Result::ok)
            .filter(|e| e.path().extension().and_then(|s| s.to_str()) == Some("wav"))
            .collect::<Vec<_>>();
        entries.sort_by_key(|e| e.metadata().and_then(|m| m.modified()).ok());
        entries
            .last()
            .map(|e| e.path())
            .ok_or_else(|| anyhow::anyhow!("No recordings found"))
    }
}
