use std::path::PathBuf;

pub fn save_image(file_name: &str, data: &[u8]) -> Result<String, anyhow::Error> {
    let storage = std::env::current_dir()?.join("uploads");
    std::fs::create_dir_all(&storage)?;
    let path = storage.join(file_name);
    std::fs::write(&path, data)?;
    Ok(path.to_string_lossy().to_string())
}

pub fn load_last_action_items() -> Result<Vec<String>, anyhow::Error> {
    // TODO: persist action items and return the last saved list.
    Ok(vec![
        "Follow up with design team".to_string(),
        "Publish meeting notes to shared workspace".to_string(),
    ])
}
