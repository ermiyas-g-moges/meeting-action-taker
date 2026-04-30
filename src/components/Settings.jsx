import { useState } from 'react';

export default function Settings() {
  const [app, setApp] = useState('notion');

  return (
    <section className="panel rounded-3xl border p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-[var(--text-color)]">Settings</h2>
      <div className="mt-5 space-y-3">
        <div>
          <label className="mb-2 block text-sm font-medium text-[var(--text-secondary)]">Task destination</label>
          <select
            className="themed-input w-full rounded-xl border px-4 py-3"
            value={app}
            onChange={(event) => setApp(event.target.value)}
          >
            <option value="notion">Notion</option>
            <option value="trello">Trello</option>
          </select>
        </div>
      </div>
      <p className="mt-4 text-sm text-[var(--hint-color)]">Configure API keys using environment variables.</p>
      <p className="text-sm text-[var(--hint-color)]">Logs and integration state appear in the status panel.</p>
    </section>
  );
}
