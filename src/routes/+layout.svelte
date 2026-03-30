<script>
  import { onMount } from 'svelte';
  import { initDb } from '$lib/db.js';
  import { refreshTasks } from '$lib/stores.js';
  import '../styles/global.css';

  let { children } = $props();
  let ready = $state(false);

  onMount(async () => {
    // Position window as sidebar on right edge
    try {
      const { getCurrentWindow, currentMonitor } = await import('@tauri-apps/api/window');
      const { PhysicalSize, PhysicalPosition } = await import('@tauri-apps/api/dpi');
      const appWindow = getCurrentWindow();
      const monitor = await currentMonitor();
      if (monitor) {
        const screenWidth = monitor.size.width;
        const screenHeight = monitor.size.height;
        const sidebarWidth = Math.round(340 * monitor.scaleFactor);

        await appWindow.setSize(new PhysicalSize(sidebarWidth, screenHeight));
        await appWindow.setPosition(new PhysicalPosition(screenWidth - sidebarWidth, 0));
      }
      await appWindow.show();
      await appWindow.setFocus();
    } catch (e) {
      console.warn('Window positioning skipped:', e);
    }

    // Initialize database
    try {
      await initDb();
      await refreshTasks();
    } catch (e) {
      console.error('DB init failed:', e);
    }

    ready = true;
  });
</script>

{#if ready}
  <div class="app-shell">
    {@render children()}
  </div>
{:else}
  <div class="loading">Loading...</div>
{/if}

<style>
  .app-shell {
    display: flex;
    flex-direction: column;
    height: 100vh;
    overflow: hidden;
  }

  .loading {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100vh;
    color: var(--text-muted);
  }
</style>
