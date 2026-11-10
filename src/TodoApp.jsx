import { useState, useEffect } from 'react'

const STORAGE_KEY = 'todo-app-tasks'

function loadTasks() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

function TodoApp() {
  const [tasks, setTasks] = useState(loadTasks)
  const [filter, setFilter] = useState('all')
  const [inputText, setInputText] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
  }, [tasks])

  const trimmedInput = inputText.trim()
  const canAdd = trimmedInput.length >= 1 && trimmedInput.length <= 100
  const trimmedEdit = editText.trim()
  const canSaveEdit = trimmedEdit.length >= 1 && trimmedEdit.length <= 100

  const activeCount = tasks.filter((task) => !task.completed).length

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'active') return !task.completed
    if (filter === 'completed') return task.completed
    return true
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    const text = inputText.trim()
    if (text.length < 1 || text.length > 100) return

    setTasks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), text, completed: false },
    ])
    setInputText('')
  }

  const toggleTask = (id) => {
    setTasks((prev) =>
      prev.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    )
  }

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.id !== id))
    if (editingId === id) {
      setEditingId(null)
      setEditText('')
    }
  }

  const startEditing = (task) => {
    setEditingId(task.id)
    setEditText(task.text)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditText('')
  }

  const saveEdit = (id) => {
    const text = editText.trim()
    if (text.length < 1 || text.length > 100) return

    setTasks((prev) =>
      prev.map((task) => (task.id === id ? { ...task, text } : task)),
    )
    setEditingId(null)
    setEditText('')
  }

  const emptyMessage =
    filter === 'active'
      ? 'No active tasks.'
      : filter === 'completed'
        ? 'No completed tasks.'
        : 'No tasks yet. Add one above!'

  return (
    <div className="mx-auto max-w-lg p-6">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Todo App</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <div className="flex-1">
          <label htmlFor="new-task" className="mb-1 block text-sm font-medium text-gray-700">
            New task
          </label>
          <input
            id="new-task"
            type="text"
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
            minLength={1}
            maxLength={100}
            required
            placeholder="What needs to be done?"
            className="w-full rounded border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div className="flex items-end">
          <button
            type="submit"
            disabled={!canAdd}
            className="rounded bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Add
          </button>
        </div>
      </form>

      <p className="mb-4 text-sm text-gray-600">
        {activeCount} {activeCount === 1 ? 'task' : 'tasks'} remaining
      </p>

      <div className="mb-4 flex gap-2">
        <button
          type="button"
          onClick={() => setFilter('all')}
          aria-pressed={filter === 'all'}
          className={`rounded px-3 py-1 text-sm font-medium ${
            filter === 'all'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          All
        </button>
        <button
          type="button"
          onClick={() => setFilter('active')}
          aria-pressed={filter === 'active'}
          className={`rounded px-3 py-1 text-sm font-medium ${
            filter === 'active'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Active
        </button>
        <button
          type="button"
          onClick={() => setFilter('completed')}
          aria-pressed={filter === 'completed'}
          className={`rounded px-3 py-1 text-sm font-medium ${
            filter === 'completed'
              ? 'bg-blue-600 text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          Completed
        </button>
      </div>

      {filteredTasks.length === 0 ? (
        <p className="text-center text-gray-500">{emptyMessage}</p>
      ) : (
        <ul className="space-y-2">
          {filteredTasks.map((task) => (
            <li
              key={task.id}
              className="flex items-center gap-3 rounded border border-gray-200 bg-white px-3 py-2"
            >
              {editingId === task.id ? (
                <>
                  <div className="flex-1">
                    <label
                      htmlFor={`edit-task-${task.id}`}
                      className="mb-1 block text-sm font-medium text-gray-700"
                    >
                      Edit task
                    </label>
                    <input
                      id={`edit-task-${task.id}`}
                      type="text"
                      value={editText}
                      onChange={(event) => setEditText(event.target.value)}
                      minLength={1}
                      maxLength={100}
                      required
                      className="w-full rounded border border-gray-300 px-3 py-1.5 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => saveEdit(task.id)}
                    disabled={!canSaveEdit}
                    className="rounded px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={cancelEditing}
                    className="rounded px-2 py-1 text-sm text-gray-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <input
                    id={`task-complete-${task.id}`}
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task.id)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label
                    htmlFor={`task-complete-${task.id}`}
                    className={`flex-1 cursor-pointer ${
                      task.completed ? 'text-gray-400 line-through' : 'text-gray-900'
                    }`}
                  >
                    {task.text}
                  </label>
                  <button
                    type="button"
                    onClick={() => startEditing(task)}
                    aria-label={`Edit task: ${task.text}`}
                    className="rounded px-2 py-1 text-sm text-blue-600 hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    Edit
                  </button>
                  <button
                    type="button"
                    onClick={() => deleteTask(task.id)}
                    aria-label={`Delete task: ${task.text}`}
                    className="rounded px-2 py-1 text-sm text-red-600 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Delete
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default TodoApp
