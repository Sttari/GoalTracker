<script>
  import { updatePriority, completeTask, cancelTask, deleteTask } from '$lib/db.js';
  import { refreshTasks } from '$lib/stores.js';
  import TaskDetail from './TaskDetail.svelte';

  let { task, mode = 'current' } = $props();
  let expanded = $state(false);

  // 11 distinct colors, one per priority level (0-10)
  const priorityColors = [
    '#45475a', // 0 - muted gray
    '#585b70', // 1 - lighter gray
    '#7287af', // 2 - steel blue
    '#74c7ec', // 3 - sky blue
    '#89dceb', // 4 - teal
    '#a6e3a1', // 5 - green
    '#f9e2af', // 6 - yellow
    '#fab387', // 7 - peach
    '#f38ba8', // 8 - pink
    '#eb6f92', // 9 - hot pink
    '#ed4a7a', // 10 - bright red
  ];

  function getPriorityColor(score) {
    return priorityColors[Math.max(0, Math.min(10, score))];
  }

  function toggle() {
    expanded = !expanded;
  }

  async function increment() {
    if (task.priority_score < 10) {
      await updatePriority(task.id, task.priority_score + 1);
      await refreshTasks();
    }
  }

  async function decrement() {
    if (task.priority_score > 0) {
      await updatePriority(task.id, task.priority_score - 1);
      await refreshTasks();
    }
  }

  async function complete() {
    await completeTask(task.id);
    await refreshTasks();
  }

  async function cancel() {
    await cancelTask(task.id);
    await refreshTasks();
  }

  async function remove() {
    await deleteTask(task.id);
    await refreshTasks();
  }

  function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr + 'Z');
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }

  function handleKeydown(e) {
    if (e.key === 'Escape' && expanded) {
      expanded = false;
    }
  }
</script>

<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="card" onkeydown={handleKeydown}>
  <div class="card-header">
    <button
      class="priority-badge"
      style="background: {getPriorityColor(task.priority_score)}"
      title="Priority: {task.priority_score}"
      onclick={toggle}
    >
      {task.priority_score}
    </button>

    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="task-info" onclick={toggle}>
      <span class="task-title-row">
        <span class="task-title" title={task.title}>{task.title}</span>
        {#if task.note_count > 0}
          <span class="note-count">{task.note_count}</span>
        {/if}
      </span>
      <span class="task-date">{formatDate(task.created_at)}</span>
    </div>

    <div class="controls">
      {#if mode === 'current'}
        <button class="ctrl-btn up" onclick={increment} title="Increase priority" disabled={task.priority_score >= 10}>▲</button>
        <button class="ctrl-btn down" onclick={decrement} title="Decrease priority" disabled={task.priority_score <= 0}>▼</button>
        <button class="ctrl-btn check" onclick={complete} title="Complete">✓</button>
        <button class="ctrl-btn del" onclick={cancel} title="Cancel">✕</button>
      {:else}
        <button class="ctrl-btn del" onclick={remove} title="Delete permanently">🗑</button>
      {/if}
    </div>
  </div>

  {#if expanded}
    <TaskDetail {task} />
  {/if}
</div>

<style>
  .card {
    background: var(--bg-surface);
    border-radius: 8px;
    padding: 8px 10px;
    transition: background 0.15s;
  }

  .card:hover {
    background: var(--bg-hover);
  }

  .card-header {
    display: flex;
    align-items: center;
    gap: 8px;
    min-height: 28px;
  }

  .priority-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: 6px;
    border: none;
    font-size: 13px;
    font-weight: 700;
    color: var(--bg-primary);
    cursor: pointer;
    flex-shrink: 0;
  }

  .task-info {
    flex: 1;
    min-width: 0;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }

  .task-title-row {
    display: flex;
    align-items: center;
    gap: 6px;
    min-width: 0;
  }

  .task-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 15px;
  }

  .note-count {
    font-size: 9px;
    color: var(--text-muted);
    background: var(--border);
    border-radius: 4px;
    padding: 1px 4px;
    flex-shrink: 0;
    line-height: 1.3;
  }

  .task-date {
    font-size: 10px;
    color: var(--text-muted);
  }

  .controls {
    display: flex;
    gap: 2px;
    flex-shrink: 0;
    opacity: 0;
    transition: opacity 0.15s;
  }

  .card:hover .controls {
    opacity: 1;
  }

  .ctrl-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--text-muted);
    font-size: 10px;
    cursor: pointer;
  }

  .ctrl-btn:hover:not(:disabled) {
    background: var(--border);
    color: var(--text-primary);
  }

  .ctrl-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .ctrl-btn.check:hover:not(:disabled) {
    color: var(--success);
  }

  .ctrl-btn.del:hover:not(:disabled) {
    color: var(--danger);
  }
</style>
