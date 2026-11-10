import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import TodoApp from './TodoApp'

const STORAGE_KEY = 'todo-app-tasks'

describe('TodoApp', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('adds a task', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByLabelText(/new task/i)
    await user.type(input, 'Buy groceries')
    await user.click(screen.getByRole('button', { name: /add/i }))

    expect(screen.getByText('Buy groceries')).toBeInTheDocument()
    expect(screen.getByText('1 task remaining')).toBeInTheDocument()

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored).toHaveLength(1)
    expect(stored[0].text).toBe('Buy groceries')
    expect(stored[0].completed).toBe(false)
  })

  it('marks a task complete', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByLabelText(/new task/i), 'Walk the dog')
    await user.click(screen.getByRole('button', { name: /add/i }))

    const checkbox = screen.getByRole('checkbox', { name: /walk the dog/i })
    await user.click(checkbox)

    expect(checkbox).toBeChecked()
    expect(screen.getByText('0 tasks remaining')).toBeInTheDocument()
    expect(screen.getByText('Walk the dog')).toHaveClass('line-through')
  })

  it('deletes a task', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByLabelText(/new task/i), 'Read a book')
    await user.click(screen.getByRole('button', { name: /add/i }))

    await user.click(screen.getByRole('button', { name: /delete task: read a book/i }))

    expect(screen.queryByText('Read a book')).not.toBeInTheDocument()
    expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument()
    expect(JSON.parse(localStorage.getItem(STORAGE_KEY))).toHaveLength(0)
  })

  it('disables add when input is empty or only spaces', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const addButton = screen.getByRole('button', { name: /add/i })
    expect(addButton).toBeDisabled()

    await user.type(screen.getByLabelText(/new task/i), '   ')
    expect(addButton).toBeDisabled()
  })

  it('edits a task', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    await user.type(screen.getByLabelText(/new task/i), 'Old title')
    await user.click(screen.getByRole('button', { name: /add/i }))

    await user.click(screen.getByRole('button', { name: /edit task: old title/i }))

    const editInput = screen.getByLabelText(/edit task/i)
    await user.clear(editInput)
    await user.type(editInput, '  New title  ')
    await user.click(screen.getByRole('button', { name: /^save$/i }))

    expect(screen.getByText('New title')).toBeInTheDocument()
    expect(screen.queryByText('Old title')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /edit task: new title/i })).toBeInTheDocument()

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY))
    expect(stored[0].text).toBe('New title')
  })

  it('filters tasks correctly', async () => {
    const user = userEvent.setup()
    render(<TodoApp />)

    const input = screen.getByLabelText(/new task/i)

    await user.type(input, 'Active task')
    await user.click(screen.getByRole('button', { name: /add/i }))

    await user.type(input, 'Completed task')
    await user.click(screen.getByRole('button', { name: /add/i }))

    await user.click(screen.getByRole('checkbox', { name: /completed task/i }))

    await user.click(screen.getByRole('button', { name: /^active$/i }))
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.queryByText('Completed task')).not.toBeInTheDocument()
    expect(screen.queryByText(/no active tasks/i)).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^completed$/i }))
    expect(screen.queryByText('Active task')).not.toBeInTheDocument()
    expect(screen.getByText('Completed task')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: /^all$/i }))
    expect(screen.getByText('Active task')).toBeInTheDocument()
    expect(screen.getByText('Completed task')).toBeInTheDocument()
  })
})
