mod notion;
mod trello;

pub fn create_tasks_for_items(items: &[String]) -> Result<String, anyhow::Error> {
    let notion_ok = notion::create_notion_tasks(items)?;
    let trello_ok = trello::create_trello_cards(items)?;
    Ok(format!("{} | {}", notion_ok, trello_ok))
}
