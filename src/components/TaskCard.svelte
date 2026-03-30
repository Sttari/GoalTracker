<script>
  import { updatePriority, completeTask, deleteTask } from '$lib/db.js';
  import { refreshTasks } from '$lib/stores.js';
  import TaskDetail from './TaskDetail.svelte';

  let { task } = $props();
  let expanded = $state(false);

  function getPriorityColor(score) {
    if (score >= 8) return 'var(--priority-high)';
    if (score >= 4) return 'var(--priority-medium)';
    return 'var(--priority-low)';
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

  async function remove() {
    await deleteTask(task.id);
    await refreshTasks();
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
    <span class="task-title" onclick={toggle} title={task.title}>
      {task.title}
    </span>

    <div class="controls">
      <button class="ctrl-btn up" onclick={increment} title="Increase priority" disabled={task.priority_score >= 10}>▲</button>
      <button class="ctrl-btn down" onclick={decrement} title="Decrease priority" disabled={task.priority_score <= 0}>▼</button>
      <button class="ctrl-btn check" onclick={complete} title="Complete">✓</button>
      <button class="ctrl-btn del" onclick={remove} title="Delete">✕</button>
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
    width: 24px;
    height: 24px;
    border-radius: 6px;
    border: none;
    font-size: 11px;
    font-weight: 700;
    color: var(--bg-primary);
    cursor: pointer;
    flex-shrink: 0;
  }

  .task-title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    cursor: pointer;
    font-size: 13px;
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
