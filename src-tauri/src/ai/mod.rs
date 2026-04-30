use serde::Deserialize;

pub fn transcribe_audio() -> Result<String, anyhow::Error> {
    let path = super::audio::last_recording_path()?;
    let placeholder = format!("Transcribed text for audio file: {}", path.display());
    Ok(placeholder)
}

pub fn extract_action_items(text: &str) -> Result<Vec<String>, anyhow::Error> {
    let items = vec![
        format!("Review meeting notes from transcription: {}", text),
        "Assign follow-up tasks to the team".to_string(),
        "Send summary email after the meeting".to_string(),
    ];
    Ok(items)
}

#[derive(Deserialize)]
struct OpenAiRequest {
    model: String,
    prompt: String,
}
