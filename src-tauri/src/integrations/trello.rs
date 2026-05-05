use reqwest::blocking::Client;

pub fn create_trello_cards(items: &[String]) -> Result<String, anyhow::Error> {
    let trello_key = std::env::var("TRELLO_KEY").unwrap_or_default();
    let trello_token = std::env::var("TRELLO_TOKEN").unwrap_or_default();
    let trello_list_id = std::env::var("TRELLO_LIST_ID").unwrap_or_default();

    if trello_key.is_empty() || trello_token.is_empty() || trello_list_id.is_empty() {
        return Ok("Trello disabled: missing credentials".to_string());
    }

    let client = Client::new();
    for item in items {
        let url = format!(
            "https://api.trello.com/1/cards?key={}&token={}&idList={}&name={}",
            trello_key,
            trello_token,
            trello_list_id,
            urlencoding::encode(item)
        );

        client.post(&url).send()?;
    }

    Ok("Trello cards created".to_string())
}
