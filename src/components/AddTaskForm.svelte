<script>
  import { addTask } from '$lib/db.js';
  import { refreshTasks } from '$lib/stores.js';

  let title = $state('');
  let score = $state(5);

  async function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    await addTask(trimmed, score);
    await refreshTasks();
    title = '';
    score = 5;
  }
</script>

<form class="add-form" onsubmit={handleSubmit}>
  <input
    class="title-input"
    type="text"
    placeholder="New task..."
    bind:value={title}
    maxlength="200"
  />
  <input
    class="score-input"
    type="number"
    min="0"
    max="10"
    bind:value={score}
    title="Priority (0-10)"
  />
  <button class="add-btn" type="submit" disabled={!title.trim()}>+</button>
</form>

<style>
  .add-form {
    display: flex;
    gap: 4px;
    padding: 8px;
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .title-input {
    flex: 1;
    min-width: 0;
    padding: 6px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 13px;
    font-family: inherit;
    outline: none;
  }

  .title-input:focus {
    border-color: var(--accent);
  }

  .title-input::placeholder {
    color: var(--text-muted);
  }

  .score-input {
    width: 44px;
    padding: 6px 4px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 13px;
    font-family: inherit;
    text-align: center;
    outline: none;
    -moz-appearance: textfield;
  }

  .score-input:focus {
    border-color: var(--accent);
  }

  .score-input::-webkit-inner-spin-button,
  .score-input::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  .add-btn {
    width: 34px;
    border: none;
    border-radius: 6px;
    background: var(--accent);
    color: var(--bg-primary);
    font-size: 18px;
    font-weight: 700;
    cursor: pointer;
    flex-shrink: 0;
  }

  .add-btn:hover:not(:disabled) {
    opacity: 0.85;
  }

  .add-btn:disabled {
    opacity: 0.4;
    cursor: default;
  }
</style>
