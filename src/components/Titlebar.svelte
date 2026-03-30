<script>
  import { getCurrentWindow } from '@tauri-apps/api/window';

  function close() {
    getCurrentWindow().close();
  }
</script>

<div class="titlebar" data-tauri-drag-region>
  <span class="title" data-tauri-drag-region>GoalTracker</span>
  <button class="close-btn" onclick={close} title="Close">✕</button>
</div>

<style>
  .titlebar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 32px;
    padding: 0 8px 0 12px;
    background: var(--bg-surface);
    border-bottom: 1px solid var(--border);
    flex-shrink: 0;
  }

  .title {
    font-size: 12px;
    font-weight: 600;
    color: var(--text-secondary);
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .close-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border: none;
    background: transparent;
    color: var(--text-muted);
    font-size: 12px;
    cursor: pointer;
    border-radius: 4px;
  }

  .close-btn:hover {
    background: var(--danger);
    color: var(--bg-primary);
  }
</style>
