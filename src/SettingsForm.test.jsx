import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SettingsForm from './SettingsForm'

describe('SettingsForm', () => {
  beforeEach(() => {
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  it('submits successfully with valid data', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await user.type(screen.getByLabelText(/display name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/^email$/i), 'jane@example.com')
    await user.type(screen.getByLabelText(/^bio$/i), 'Frontend developer')

    const submitButton = screen.getByRole('button', { name: /save settings/i })
    await waitFor(() => expect(submitButton).toBeEnabled())
    await user.click(submitButton)

    await waitFor(() => {
      expect(console.log).toHaveBeenCalledWith({
        displayName: 'Jane Doe',
        email: 'jane@example.com',
        bio: 'Frontend developer',
        emailNotifications: true,
        pushNotifications: false,
      })
    })

    expect(screen.getByRole('status')).toHaveTextContent('Settings saved successfully!')
  })

  it('shows an error when display name is missing', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await user.type(screen.getByLabelText(/^email$/i), 'jane@example.com')
    await user.click(screen.getByLabelText(/display name/i))
    await user.tab()

    expect(await screen.findByText(/display name is required/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save settings/i })).toBeDisabled()
  })

  it('shows an error when email format is invalid', async () => {
    const user = userEvent.setup()
    render(<SettingsForm />)

    await user.type(screen.getByLabelText(/display name/i), 'Jane Doe')
    await user.type(screen.getByLabelText(/^email$/i), 'not-an-email')
    await user.tab()

    expect(await screen.findByText(/please enter a valid email address/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /save settings/i })).toBeDisabled()
  })
})
