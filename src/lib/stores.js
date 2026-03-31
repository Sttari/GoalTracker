import { writable } from 'svelte/store';
import { getAllTasks, getCompletedTasks, getCancelledTasks } from './db.js';

export const tasks = writable([]);
export const completedTasks = writable([]);
export const cancelledTasks = writable([]);

export async function refreshTasks() {
  const [current, completed, cancelled] = await Promise.all([
    getAllTasks(),
    getCompletedTasks(),
    getCancelledTasks()
  ]);
  tasks.set(current);
  completedTasks.set(completed);
  cancelledTasks.set(cancelled);
}
