use std::fs;
use std::env;
use std::path::PathBuf;

fn get_storage_path() -> Result<PathBuf, anyhow::Error> {
    let mut path = env::current_dir()?;
    // If we are in src-tauri, go up to project root
    if path.to_string_lossy().contains("src-tauri") {
        path = path.parent().unwrap().to_path_buf();
    }
    let storage = path.join("recordings");
    fs::create_dir_all(&storage)?;
    Ok(storage)
}

fn get_upload_path() -> Result<PathBuf, anyhow::Error> {
    let mut path = env::current_dir()?;
    if path.to_string_lossy().contains("src-tauri") {
        path = path.parent().unwrap().to_path_buf();
    }
    let storage = path.join("uploads");
    fs::create_dir_all(&storage)?;
    Ok(storage)
}

pub fn save_image(name: &str, data: &[u8]) -> Result<String, anyhow::Error> {
    let storage = get_upload_path()?;
    let path = storage.join(name);
    fs::write(&path, data)?;
    Ok(path.to_string_lossy().to_string())
}

pub fn list_images() -> Result<Vec<String>, anyhow::Error> {
    let storage = get_upload_path()?;
    if !storage.exists() {
        return Ok(vec![]);
    }
    let mut files = vec![];
    for entry in fs::read_dir(storage)? {
        let entry = entry?;
        let name = entry.file_name().to_string_lossy().to_string();
        // Basic image filter
        let ext = name.to_lowercase();
        if ext.ends_with(".png") || ext.ends_with(".jpg") || ext.ends_with(".jpeg") || ext.ends_with(".gif") || ext.ends_with(".webp") {
            files.push(name);
        }
    }
    files.sort_by(|a, b| b.cmp(a));
    Ok(files)
}

pub fn get_image_path(name: &str) -> Result<String, anyhow::Error> {
    let storage = get_upload_path()?;
    let path = storage.join(name);
    if path.exists() {
        Ok(path.to_string_lossy().to_string())
    } else {
        Err(anyhow::anyhow!("Image not found"))
    }
}

pub fn save_video(name: &str, data: &[u8]) -> Result<String, anyhow::Error> {
    let storage = get_storage_path()?;
    let path = storage.join(name);
    fs::write(&path, data)?;
    Ok(path.to_string_lossy().to_string())
}

pub fn get_recording_path(name: &str) -> Result<String, anyhow::Error> {
    let storage = get_storage_path()?;
    let path = storage.join(name);
    if path.exists() {
        Ok(path.to_string_lossy().to_string())
    } else {
        Err(anyhow::anyhow!("File not found"))
    }
}

pub fn list_recordings() -> Result<Vec<String>, anyhow::Error> {
    let storage = get_storage_path()?;
    if !storage.exists() {
        return Ok(vec![]);
    }
    let mut files = vec![];
    for entry in fs::read_dir(storage)? {
        let entry = entry?;
        let name = entry.file_name().to_string_lossy().to_string();
        if name.ends_with(".webm") || name.ends_with(".mp4") {
            files.push(name);
        }
    }
    files.sort_by(|a, b| b.cmp(a));
    Ok(files)
}
