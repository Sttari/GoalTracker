<script>
  import { updateTask } from '$lib/db.js';
  import { refreshTasks } from '$lib/stores.js';

  let { task } = $props();
  let localDesc = $state(null);
  let description = $derived(localDesc ?? task.description ?? '');
  let saveTimeout = null;

  function handleInput(e) {
    localDesc = e.target.value;
    clearTimeout(saveTimeout);
    saveTimeout = setTimeout(async () => {
      await updateTask(task.id, task.title, localDesc);
      await refreshTasks();
      localDesc = null;
    }, 500);
  }

  function handleKeydown(e) {
    if (e.key === 'Escape') {
      e.target.blur();
    }
  }
</script>

<div class="detail">
  <textarea
    class="notes"
    placeholder="Add notes..."
    value={description}
    oninput={handleInput}
    onkeydown={handleKeydown}
    rows="3"
  ></textarea>
</div>

<style>
  .detail {
    padding: 4px 0 0 0;
  }

  .notes {
    width: 100%;
    padding: 6px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 12px;
    font-family: inherit;
    line-height: 1.4;
    resize: vertical;
    min-height: 48px;
    outline: none;
  }

  .notes:focus {
    border-color: var(--accent);
  }

  .notes::placeholder {
    color: var(--text-muted);
  }
</style>
