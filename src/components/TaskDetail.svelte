<script>
  import { getNotesForTask, addNote, updateNote, deleteNote } from '$lib/db.js';
  import { refreshTasks } from '$lib/stores.js';

  let { task } = $props();
  let notes = $state([]);
  let newNoteText = $state('');
  let editingNoteId = $state(null);
  let editingContent = $state('');

  async function loadNotes() {
    notes = await getNotesForTask(task.id);
  }

  $effect(() => {
    // Re-fetch when task.id changes
    const id = task.id;
    loadNotes();
  });

  async function handleAddNote() {
    const text = newNoteText.trim();
    if (!text) return;
    await addNote(task.id, text);
    newNoteText = '';
    await loadNotes();
    await refreshTasks();
  }

  function handleAddKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddNote();
    }
  }

  function startEdit(note) {
    editingNoteId = note.id;
    editingContent = note.content;
  }

  function cancelEdit() {
    editingNoteId = null;
    editingContent = '';
  }

  async function saveEdit() {
    if (editingContent.trim() === '') return;
    await updateNote(editingNoteId, editingContent.trim());
    editingNoteId = null;
    editingContent = '';
    await loadNotes();
  }

  function handleEditKeydown(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      saveEdit();
    } else if (e.key === 'Escape') {
      cancelEdit();
    }
  }

  async function removeNote(noteId) {
    await deleteNote(noteId);
    await loadNotes();
    await refreshTasks();
  }
</script>

<div class="detail">
  {#if notes.length > 0}
    <div class="notes-list">
      {#each notes as note, i (note.id)}
        <div class="note-item">
          <span class="note-index">{i + 1}.</span>
          {#if editingNoteId === note.id}
            <div class="note-edit">
              <textarea
                class="note-input"
                bind:value={editingContent}
                onkeydown={handleEditKeydown}
                rows="2"
              ></textarea>
              <div class="note-edit-actions">
                <button class="ctrl-btn check" onclick={saveEdit} title="Save">✓</button>
                <button class="ctrl-btn del" onclick={cancelEdit} title="Cancel">✕</button>
              </div>
            </div>
          {:else}
            <!-- svelte-ignore a11y_click_events_have_key_events -->
            <!-- svelte-ignore a11y_no_static_element_interactions -->
            <span class="note-content" onclick={() => startEdit(note)}>{note.content}</span>
            <button class="note-delete" onclick={() => removeNote(note.id)} title="Delete note">✕</button>
          {/if}
        </div>
      {/each}
    </div>
  {/if}

  <div class="add-note">
    <textarea
      class="note-input"
      placeholder="Add a note..."
      bind:value={newNoteText}
      onkeydown={handleAddKeydown}
      rows="1"
    ></textarea>
    <button class="add-btn" onclick={handleAddNote} disabled={!newNoteText.trim()}>+</button>
  </div>
</div>

<style>
  .detail {
    padding: 6px 0 2px 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .notes-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .note-item {
    display: flex;
    align-items: flex-start;
    gap: 6px;
    padding: 3px 4px;
    border-radius: 4px;
    position: relative;
  }

  .note-item:hover {
    background: var(--bg-primary);
  }

  .note-index {
    font-size: 10px;
    color: var(--text-muted);
    font-weight: 600;
    min-width: 16px;
    padding-top: 2px;
    flex-shrink: 0;
  }

  .note-content {
    flex: 1;
    font-size: 12px;
    color: var(--text-secondary);
    line-height: 1.4;
    cursor: pointer;
    word-break: break-word;
    white-space: pre-wrap;
  }

  .note-content:hover {
    color: var(--text-primary);
  }

  .note-delete {
    opacity: 0;
    border: none;
    background: transparent;
    color: var(--text-muted);
    font-size: 9px;
    cursor: pointer;
    padding: 2px 4px;
    flex-shrink: 0;
  }

  .note-item:hover .note-delete {
    opacity: 1;
  }

  .note-delete:hover {
    color: var(--danger);
  }

  .note-edit {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .note-edit-actions {
    display: flex;
    gap: 4px;
    justify-content: flex-end;
  }

  .ctrl-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 22px;
    height: 22px;
    border: none;
    border-radius: 4px;
    background: transparent;
    color: var(--text-muted);
    font-size: 10px;
    cursor: pointer;
  }

  .ctrl-btn:hover {
    background: var(--border);
    color: var(--text-primary);
  }

  .ctrl-btn.check:hover {
    color: var(--success);
  }

  .ctrl-btn.del:hover {
    color: var(--danger);
  }

  .add-note {
    display: flex;
    gap: 4px;
    align-items: flex-start;
  }

  .note-input {
    flex: 1;
    padding: 4px 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg-primary);
    color: var(--text-primary);
    font-size: 12px;
    font-family: inherit;
    line-height: 1.4;
    resize: vertical;
    min-height: 28px;
    outline: none;
  }

  .note-input:focus {
    border-color: var(--accent);
  }

  .note-input::placeholder {
    color: var(--text-muted);
  }

  .add-btn {
    width: 28px;
    height: 28px;
    border: none;
    border-radius: 6px;
    background: var(--accent);
    color: var(--bg-primary);
    font-size: 14px;
    font-weight: 700;
    cursor: pointer;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .add-btn:disabled {
    opacity: 0.3;
    cursor: default;
  }

  .add-btn:hover:not(:disabled) {
    opacity: 0.85;
  }
</style>
