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
      cancelled INTEGER DEFAULT 0,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
  // Add cancelled column if upgrading from older schema
  try {
    await db.execute('ALTER TABLE tasks ADD COLUMN cancelled INTEGER DEFAULT 0');
  } catch (e) {
    // Column already exists, ignore
  }
  await db.execute(`
    CREATE TABLE IF NOT EXISTS action_log (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      action TEXT NOT NULL,
      detail TEXT DEFAULT '',
      timestamp TEXT DEFAULT (datetime('now'))
    )
  `);
  await db.execute(`
    CREATE TABLE IF NOT EXISTS task_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      task_id INTEGER NOT NULL,
      note_number INTEGER NOT NULL,
      content TEXT NOT NULL DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      FOREIGN KEY (task_id) REFERENCES tasks(id)
    )
  `);
  // Migrate existing descriptions into task_notes
  try {
    await db.execute(`
      INSERT INTO task_notes (task_id, note_number, content, created_at, updated_at)
      SELECT id, 1, description, created_at, updated_at
      FROM tasks
      WHERE description IS NOT NULL AND description != ''
      AND id NOT IN (SELECT DISTINCT task_id FROM task_notes)
    `);
  } catch (e) {
    // Migration already done or no data, ignore
  }
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
    `SELECT t.*, (SELECT COUNT(*) FROM task_notes WHERE task_id = t.id) as note_count
     FROM tasks t WHERE t.completed = 0 AND t.cancelled = 0
     ORDER BY t.priority_score DESC, t.created_at ASC`
  );
}

export async function getCompletedTasks() {
  return await db.select(
    `SELECT t.*, (SELECT COUNT(*) FROM task_notes WHERE task_id = t.id) as note_count
     FROM tasks t WHERE t.completed = 1 ORDER BY t.updated_at DESC`
  );
}

export async function getCancelledTasks() {
  return await db.select(
    `SELECT t.*, (SELECT COUNT(*) FROM task_notes WHERE task_id = t.id) as note_count
     FROM tasks t WHERE t.cancelled = 1 ORDER BY t.updated_at DESC`
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

export async function cancelTask(id) {
  await db.execute(
    "UPDATE tasks SET cancelled = 1, updated_at = datetime('now') WHERE id = $1",
    [id]
  );
  await log('CANCEL_TASK', `Task #${id} cancelled`);
}

export async function deleteTask(id) {
  await db.execute('DELETE FROM task_notes WHERE task_id = $1', [id]);
  await db.execute('DELETE FROM tasks WHERE id = $1', [id]);
  await log('DELETE_TASK', `Task #${id} permanently deleted`);
}

// --- Note functions ---

export async function getNotesForTask(taskId) {
  return await db.select(
    'SELECT * FROM task_notes WHERE task_id = $1 ORDER BY note_number ASC',
    [taskId]
  );
}

export async function addNote(taskId, content) {
  const result = await db.select(
    'SELECT COALESCE(MAX(note_number), 0) + 1 as next_num FROM task_notes WHERE task_id = $1',
    [taskId]
  );
  const nextNum = result[0].next_num;
  await db.execute(
    'INSERT INTO task_notes (task_id, note_number, content) VALUES ($1, $2, $3)',
    [taskId, nextNum, content]
  );
  await log('ADD_NOTE', `Note #${nextNum} added to Task #${taskId}`);
}

export async function updateNote(noteId, content) {
  await db.execute(
    "UPDATE task_notes SET content = $1, updated_at = datetime('now') WHERE id = $2",
    [content, noteId]
  );
  await log('UPDATE_NOTE', `Note #${noteId} updated`);
}

export async function deleteNote(noteId) {
  await db.execute('DELETE FROM task_notes WHERE id = $1', [noteId]);
  await log('DELETE_NOTE', `Note #${noteId} deleted`);
}

export async function getActionLogs(limit = 100) {
  return await db.select(
    'SELECT * FROM action_log ORDER BY timestamp DESC LIMIT $1',
    [limit]
  );
}
