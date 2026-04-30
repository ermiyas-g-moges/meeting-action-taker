#![cfg_attr(all(not(debug_assertions), target_os = "windows"), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use tauri::Manager;

mod ai;
mod audio;
mod integrations;
mod storage;

#[derive(Serialize, Deserialize)]
struct UploadPayload {
    file_name: String,
    data: Vec<u8>,
}

#[tauri::command]
fn start_audio_recording() -> Result<String, String> {
    audio::start_recording().map_err(|e| e.to_string())
}

#[tauri::command]
fn transcribe_audio() -> Result<String, String> {
    ai::transcribe_audio().map_err(|e| e.to_string())
}

#[tauri::command]
fn extract_action_items(text: String) -> Result<Vec<String>, String> {
    ai::extract_action_items(&text).map_err(|e| e.to_string())
}

#[tauri::command]
fn create_tasks_for_action_items() -> Result<String, String> {
    let items = storage::load_last_action_items().map_err(|e| e.to_string())?;
    integrations::create_tasks_for_items(&items).map_err(|e| e.to_string())
}

#[tauri::command]
fn upload_image(payload: UploadPayload) -> Result<String, String> {
    storage::save_image(&payload.file_name, &payload.data).map_err(|e| e.to_string())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            start_audio_recording,
            transcribe_audio,
            extract_action_items,
            create_tasks_for_action_items,
            upload_image
        ])
        .run(tauri::generate_context!())
        .expect("failed to run app");
}
