use reqwest::blocking::Client;
use serde_json::json;

pub fn create_notion_tasks(items: &[String]) -> Result<String, anyhow::Error> {
    let notion_api_key = std::env::var("NOTION_API_KEY").unwrap_or_default();
    let notion_database_id = std::env::var("NOTION_DATABASE_ID").unwrap_or_default();

    if notion_api_key.is_empty() || notion_database_id.is_empty() {
        return Ok("Notion disabled: missing credentials".to_string());
    }

    let client = Client::new();
    for item in items {
        let payload = json!({
            "parent": {"database_id": notion_database_id},
            "properties": {
                "Name": {
                    "title": [{"text": {"content": item}}]
                }
            }
        });

        client
            .post("https://api.notion.com/v1/pages")
            .header("Authorization", format!("Bearer {}", notion_api_key))
            .header("Notion-Version", "2022-06-28")
            .json(&payload)
            .send()?;
    }

    Ok("Notion tasks created".to_string())
}
