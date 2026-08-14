import { useState } from 'react'

const DEFAULT_SETTINGS = {
  displayName: '',
  email: '',
  bio: '',
  theme: 'system',
  language: 'en',
  timezone: 'UTC',
  emailNotifications: true,
  pushNotifications: false,
  marketingEmails: false,
  profilePublic: true,
}

const THEMES = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
]

const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Spanish' },
  { value: 'fr', label: 'French' },
  { value: 'de', label: 'German' },
]

const TIMEZONES = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time' },
  { value: 'America/Chicago', label: 'Central Time' },
  { value: 'America/Los_Angeles', label: 'Pacific Time' },
  { value: 'Europe/London', label: 'London' },
  { value: 'Asia/Tokyo', label: 'Tokyo' },
]

function FormField({ id, label, hint, error, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-gray-900 dark:text-gray-100">
        {label}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-gray-500 dark:text-gray-400">{hint}</p>
      )}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

function ToggleField({ id, label, description, checked, onChange }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="flex flex-col gap-0.5 text-left">
        <label htmlFor={id} className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 ${
          checked ? 'bg-violet-600' : 'bg-gray-200 dark:bg-gray-700'
        }`}
      >
        <span
          className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0'
          }`}
        />
      </button>
    </div>
  )
}

function Section({ title, description, children }) {
  return (
    <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900">
      <div className="mb-5 border-b border-gray-100 pb-4 text-left dark:border-gray-800">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h2>
        {description && (
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{description}</p>
        )}
      </div>
      <div className="flex flex-col gap-4">{children}</div>
    </section>
  )
}

function SettingsForm() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS)
  const [errors, setErrors] = useState({})
  const [savedMessage, setSavedMessage] = useState('')

  function updateField(field, value) {
    setSettings((prev) => ({ ...prev, [field]: value }))
    setErrors((prev) => ({ ...prev, [field]: undefined }))
    setSavedMessage('')
  }

  function validate() {
    const nextErrors = {}

    if (!settings.displayName.trim()) {
      nextErrors.displayName = 'Display name is required.'
    }

    if (!settings.email.trim()) {
      nextErrors.email = 'Email is required.'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(settings.email)) {
      nextErrors.email = 'Enter a valid email address.'
    }

    setErrors(nextErrors)
    return Object.keys(nextErrors).length === 0
  }

  function handleSubmit(event) {
    event.preventDefault()
    if (!validate()) return

    setSavedMessage('Settings saved successfully.')
  }

  function handleReset() {
    setSettings(DEFAULT_SETTINGS)
    setErrors({})
    setSavedMessage('')
  }

  const inputClass =
    'w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-100 dark:placeholder:text-gray-500'

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 text-left">
      <header className="mb-8">
        <h1 className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-gray-100">
          Settings
        </h1>
        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
          Manage your account preferences and notification settings.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6" noValidate>
        <Section title="Profile" description="Your public profile information.">
          <FormField id="displayName" label="Display name" error={errors.displayName}>
            <input
              id="displayName"
              type="text"
              value={settings.displayName}
              onChange={(e) => updateField('displayName', e.target.value)}
              placeholder="Jane Doe"
              className={inputClass}
              aria-invalid={Boolean(errors.displayName)}
            />
          </FormField>

          <FormField id="email" label="Email" error={errors.email}>
            <input
              id="email"
              type="email"
              value={settings.email}
              onChange={(e) => updateField('email', e.target.value)}
              placeholder="you@example.com"
              className={inputClass}
              aria-invalid={Boolean(errors.email)}
            />
          </FormField>

          <FormField id="bio" label="Bio" hint="A short description shown on your profile.">
            <textarea
              id="bio"
              rows={3}
              value={settings.bio}
              onChange={(e) => updateField('bio', e.target.value)}
              placeholder="Tell us a little about yourself..."
              className={`${inputClass} resize-y`}
            />
          </FormField>
        </Section>

        <Section title="Preferences" description="Customize your app experience.">
          <FormField id="theme" label="Theme">
            <select
              id="theme"
              value={settings.theme}
              onChange={(e) => updateField('theme', e.target.value)}
              className={inputClass}
            >
              {THEMES.map(({ value, label }) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </FormField>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField id="language" label="Language">
              <select
                id="language"
                value={settings.language}
                onChange={(e) => updateField('language', e.target.value)}
                className={inputClass}
              >
                {LANGUAGES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </FormField>

            <FormField id="timezone" label="Timezone">
              <select
                id="timezone"
                value={settings.timezone}
                onChange={(e) => updateField('timezone', e.target.value)}
                className={inputClass}
              >
                {TIMEZONES.map(({ value, label }) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </FormField>
          </div>
        </Section>

        <Section title="Notifications" description="Choose how you want to be notified.">
          <ToggleField
            id="emailNotifications"
            label="Email notifications"
            description="Receive updates about your account activity."
            checked={settings.emailNotifications}
            onChange={(value) => updateField('emailNotifications', value)}
          />
          <ToggleField
            id="pushNotifications"
            label="Push notifications"
            description="Get real-time alerts in your browser."
            checked={settings.pushNotifications}
            onChange={(value) => updateField('pushNotifications', value)}
          />
          <ToggleField
            id="marketingEmails"
            label="Marketing emails"
            description="Product news, tips, and promotional offers."
            checked={settings.marketingEmails}
            onChange={(value) => updateField('marketingEmails', value)}
          />
        </Section>

        <Section title="Privacy" description="Control your visibility and data sharing.">
          <ToggleField
            id="profilePublic"
            label="Public profile"
            description="Allow others to view your profile and activity."
            checked={settings.profilePublic}
            onChange={(value) => updateField('profilePublic', value)}
          />
        </Section>

        {savedMessage && (
          <p
            role="status"
            className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800 dark:border-green-800 dark:bg-green-950 dark:text-green-200"
          >
            {savedMessage}
          </p>
        )}

        <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={handleReset}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
          >
            Reset
          </button>
          <button
            type="submit"
            className="rounded-lg bg-violet-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-violet-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-500"
          >
            Save changes
          </button>
        </div>
      </form>
    </div>
  )
}

export default SettingsForm
