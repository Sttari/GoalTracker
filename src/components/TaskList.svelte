<script>
  import { tasks } from '$lib/stores.js';
  import TaskCard from './TaskCard.svelte';

  let taskList = $derived($tasks);
</script>

<div class="task-list">
  {#if taskList.length === 0}
    <div class="empty">
      <p class="empty-icon">📋</p>
      <p class="empty-text">No tasks yet</p>
      <p class="empty-hint">Add one above to get started</p>
    </div>
  {:else}
    {#each taskList as task (task.id)}
      <TaskCard {task} />
    {/each}
  {/if}
</div>

<style>
  .task-list {
    flex: 1;
    overflow-y: auto;
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding-top: 60px;
    gap: 4px;
  }

  .empty-icon {
    font-size: 32px;
    margin-bottom: 8px;
  }

  .empty-text {
    color: var(--text-secondary);
    font-size: 14px;
    font-weight: 500;
  }

  .empty-hint {
    color: var(--text-muted);
    font-size: 12px;
  }
</style>
