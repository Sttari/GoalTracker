import { writable } from 'svelte/store';
import { getAllTasks } from './db.js';

export const tasks = writable([]);

export async function refreshTasks() {
  const rows = await getAllTasks();
  tasks.set(rows);
}
