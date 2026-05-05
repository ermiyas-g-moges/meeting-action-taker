#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};

mod audio;
mod integrations;
mod storage;

#[derive(Serialize, Deserialize)]
struct FilePayload {
    name: String,
    data: Vec<u8>,
}

#[tauri::command]
fn list_images() -> Result<Vec<String>, String> {
    storage::list_images().map_err(|e| e.to_string())
}

#[tauri::command]
fn get_image_path(name: String) -> Result<String, String> {
    storage::get_image_path(&name).map_err(|e| e.to_string())
}

#[tauri::command]
fn start_audio_recording() -> Result<String, String> {
    audio::start_recording().map_err(|e| e.to_string())
}

#[tauri::command]
fn stop_audio_recording() -> Result<String, String> {
    audio::stop_recording().map_err(|e| e.to_string())
}

#[tauri::command]
fn get_recording_path(name: String) -> Result<String, String> {
    storage::get_recording_path(&name).map_err(|e| e.to_string())
}

#[tauri::command]
fn list_recordings() -> Result<Vec<String>, String> {
    storage::list_recordings().map_err(|e| e.to_string())
}

#[tauri::command]
fn save_video(payload: FilePayload) -> Result<String, String> {
    storage::save_video(&payload.name, &payload.data).map_err(|e| e.to_string())
}

#[tauri::command]
fn upload_image(payload: FilePayload) -> Result<String, String> {
    storage::save_image(&payload.name, &payload.data).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_audio_recording,
            stop_audio_recording,
            list_images,
            get_image_path,
            get_recording_path,
            list_recordings,
            save_video,
            upload_image
        ])
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
