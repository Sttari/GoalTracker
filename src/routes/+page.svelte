<script>
  import Titlebar from '../components/Titlebar.svelte';
  import AddTaskForm from '../components/AddTaskForm.svelte';
  import TaskList from '../components/TaskList.svelte';
  import { tasks, completedTasks, cancelledTasks } from '$lib/stores.js';

  let drawerOpen = $state(false);
  let drawerTab = $state('completed');

  let currentTasks = $derived($tasks);
  let completed = $derived($completedTasks);
  let cancelled = $derived($cancelledTasks);
  let drawerCount = $derived(
    drawerTab === 'completed' ? completed.length : cancelled.length
  );
  let totalArchived = $derived(completed.length + cancelled.length);

  function toggleDrawer() {
    drawerOpen = !drawerOpen;
  }

  function selectDrawerTab(tab) {
    drawerTab = tab;
    if (!drawerOpen) drawerOpen = true;
  }
</script>

<div class="layout">
  <Titlebar />
  <AddTaskForm />

  <div class="current-section">
    {#if currentTasks.length === 0}
      <div class="empty">
        <p class="empty-icon">📋</p>
        <p class="empty-text">No tasks yet</p>
        <p class="empty-hint">Add one above to get started</p>
      </div>
    {:else}
      <TaskList tasks={currentTasks} mode="current" />
    {/if}
  </div>

  <div class="drawer" class:open={drawerOpen}>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    <!-- svelte-ignore a11y_no_static_element_interactions -->
    <div class="drawer-bar" onclick={toggleDrawer}>
      <div class="drawer-tabs">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <span
          class="drawer-tab"
          class:active={drawerTab === 'completed'}
          onclick={(e) => { e.stopPropagation(); selectDrawerTab('completed'); }}
        >
          Completed ({completed.length})
        </span>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <span
          class="drawer-tab"
          class:active={drawerTab === 'cancelled'}
          onclick={(e) => { e.stopPropagation(); selectDrawerTab('cancelled'); }}
        >
          Cancelled ({cancelled.length})
        </span>
      </div>
      <span class="drawer-arrow">{drawerOpen ? '▼' : '▲'}</span>
    </div>

    {#if drawerOpen}
      <div class="drawer-content">
        {#if drawerTab === 'completed'}
          <TaskList tasks={completed} mode="completed" emptyText="No completed tasks yet" />
        {:else}
          <TaskList tasks={cancelled} mode="cancelled" emptyText="No cancelled tasks yet" />
        {/if}
      </div>
    {/if}
  </div>
</div>

<style>
  .layout {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  .current-section {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
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

  .drawer {
    border-top: 1px solid var(--border);
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    max-height: 45vh;
    transition: max-height 0.2s ease;
  }

  .drawer:not(.open) {
    max-height: 32px;
  }

  .drawer-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 12px;
    cursor: pointer;
    background: var(--bg-surface);
    flex-shrink: 0;
    min-height: 32px;
  }

  .drawer-bar:hover {
    background: var(--bg-hover);
  }

  .drawer-tabs {
    display: flex;
    gap: 14px;
  }

  .drawer-tab {
    font-size: 11px;
    font-weight: 500;
    color: var(--text-muted);
    cursor: pointer;
    padding-bottom: 2px;
    border-bottom: 2px solid transparent;
    transition: color 0.15s, border-color 0.15s;
  }

  .drawer-tab:hover {
    color: var(--text-secondary);
  }

  .drawer-tab.active {
    color: var(--accent);
    border-bottom-color: var(--accent);
  }

  .drawer-arrow {
    font-size: 10px;
    color: var(--text-muted);
  }

  .drawer-content {
    flex: 1;
    overflow-y: auto;
    min-height: 0;
  }
</style>
