<script>
  import TaskCard from './TaskCard.svelte';

  let { tasks = [], mode = 'current', emptyText = 'No tasks' } = $props();
</script>

<div class="task-list">
  {#if tasks.length === 0}
    <p class="empty">{emptyText}</p>
  {:else}
    {#each tasks as task (task.id)}
      <TaskCard {task} {mode} />
    {/each}
  {/if}
</div>

<style>
  .task-list {
    overflow-y: auto;
    padding: 6px 8px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .empty {
    color: var(--text-muted);
    font-size: 12px;
    text-align: center;
    padding: 16px 0;
  }
</style>
