import Database from '@tauri-apps/plugin-sql';

let db = null;

export async function initDb() {
  db = await Database.load('sqlite:goaltracker.db');
  await db.execute(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      priority_score INTEGER DEFAULT 0,
      completed INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS action_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      detail TEXT DEFAULT '',
      timestamp TEXT DEFAULT (datetime('now'))
    )
  `);
  await log('APP_START', 'Application initialized');
  return db;
}

async function log(action, detail) {
  try {
    await db.execute(
      'INSERT INTO action_log (action, detail) VALUES ($1, $2)',
      [action, detail]
    );
  } catch (e) {
    console.error('Logging failed:', e);
  }
}

export async function getAllTasks() {
  return await db.select(
    'SELECT * FROM tasks WHERE completed = 0 ORDER BY priority_score DESC, created_at ASC'
  );
}

export async function addTask(title, priorityScore = 0) {
  await db.execute(
    'INSERT INTO tasks (title, priority_score) VALUES ($1, $2)',
    [title, priorityScore]
  );
  await log('ADD_TASK', `"${title}" with priority ${priorityScore}`);
}

export async function updatePriority(id, score) {
  await db.execute(
    "UPDATE tasks SET priority_score = $1, updated_at = datetime('now') WHERE id = $2",
    [score, id]
  );
  await log('UPDATE_PRIORITY', `Task #${id} set to priority ${score}`);
}

export async function updateTask(id, title, description) {
  await db.execute(
    "UPDATE tasks SET title = $1, description = $2, updated_at = datetime('now') WHERE id = $3",
    [title, description, id]
  );
  await log('UPDATE_TASK', `Task #${id} title="${title}"`);
}

export async function completeTask(id) {
  await db.execute(
    "UPDATE tasks SET completed = 1, updated_at = datetime('now') WHERE id = $1",
    [id]
  );
  await log('COMPLETE_TASK', `Task #${id} marked complete`);
}

export async function deleteTask(id) {
  await db.execute('DELETE FROM tasks WHERE id = $1', [id]);
  await log('DELETE_TASK', `Task #${id} permanently deleted`);
}

export async function getActionLogs(limit = 100) {
  return await db.select(
    'SELECT * FROM action_log ORDER BY timestamp DESC LIMIT $1',
    [limit]
  );
}
