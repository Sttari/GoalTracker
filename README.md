# GoalTracker

A lightweight desktop sidebar app for managing tasks with priority-based ranking. Built with Tauri + SvelteKit, it runs as an always-on-top panel pinned to the right edge of your screen.

## Features

- **Priority-based tasks** -- Add tasks with a priority score (0-10). Higher priority tasks float to the top. Each score has a distinct color from muted gray (0) to bright red (10).
- **Multi-note system** -- Expand any task to add, edit, or delete numbered notes. Notes persist across sessions.
- **Task lifecycle** -- Mark tasks as completed or cancelled. A collapsible bottom drawer shows archived tasks with counts.
- **Persistent storage** -- SQLite database stores all tasks, notes, and an action log.
- **Compact dark UI** -- Catppuccin-inspired dark theme designed for a narrow 340px sidebar. Custom titlebar with drag support.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | SvelteKit 2 + Svelte 5 |
| Desktop | Tauri 2 |
| Database | SQLite (via tauri-plugin-sql) |
| Build | Vite 6 + Rust |

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Rust](https://www.rust-lang.org/tools/install)
- [Tauri CLI prerequisites](https://v2.tauri.app/start/prerequisites/)

### Install and Run

```bash
npm install
npx tauri dev
```

### Build for Production

```bash
npx tauri build
```

## Project Structure

```
src/
  components/     # Svelte UI components (Titlebar, TaskCard, TaskDetail, etc.)
  lib/            # Database layer (db.js) and reactive stores (stores.js)
  routes/         # SvelteKit pages and layout
  styles/         # Global CSS with theme variables
src-tauri/
  src/            # Rust entry point and Tauri app builder
  capabilities/   # Tauri security permissions
  tauri.conf.json # Window config (size, position, always-on-top)
```

## Database Schema

- **tasks** -- id, title, description, priority_score, completed, cancelled, timestamps
- **task_notes** -- id, task_id, note_number, content, timestamps
- **action_log** -- id, action, detail, timestamp

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Svelte](https://marketplace.visualstudio.com/items?itemName=svelte.svelte-vscode) + [Tauri](https://marketplace.visualstudio.com/items?itemName=tauri-apps.tauri-vscode) + [rust-analyzer](https://marketplace.visualstudio.com/items?itemName=rust-lang.rust-analyzer)
