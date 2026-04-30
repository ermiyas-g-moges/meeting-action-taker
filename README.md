# Meeting Action Taker

A Tauri desktop app that records meeting audio, extracts action items, and creates tasks in Notion or Trello.

## What is included

- React + Vite frontend
- Tauri Rust backend with placeholder audio, AI, and integration commands
- Notion and Trello task creation scaffolding
- Image upload support placeholder

## Setup

### 1. Install prerequisites

- Node.js 20.x or later
- Rust toolchain (stable)
- Tauri prerequisites for Windows: Visual Studio Build Tools with "Desktop development with C++" and optional OpenSSL if you use native Rust HTTP clients

### 2. Install dependencies

Open PowerShell in the project folder and run:

```powershell
npm install
```

### 3. Configure environment variables

Copy `.env.example` to `.env` and fill in your values:

```powershell
copy .env.example .env
```

Then update the file with your values:

```env
OPENAI_API_KEY=your_openai_api_key
NOTION_API_KEY=your_notion_api_key
NOTION_DATABASE_ID=your_notion_database_id
TRELLO_KEY=your_trello_key
TRELLO_TOKEN=your_trello_token
TRELLO_LIST_ID=your_trello_list_id
```

If you prefer a free, local transcription approach, you can replace the `transcribe_audio` stub in `src-tauri/src/ai/mod.rs` with a `whisper.cpp` or other open-source Whisper implementation.

### 4. Run the app

```powershell
npm run tauri:dev
```

## Notes

- This scaffold includes the UI and backend command wiring.
- Add your own Whisper transcription integration or use OpenAI if you want GPT summarization.
- The app stores audio locally and exposes commands to the frontend through Tauri.
