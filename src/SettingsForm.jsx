import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const settingsSchema = z.object({
  displayName: z
    .string()
    .min(1, 'Display name is required')
    .min(2, 'Display name must be at least 2 characters')
    .max(50, 'Display name must be at most 50 characters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  bio: z
    .string()
    .max(300, 'Bio must be at most 300 characters')
    .optional()
    .or(z.literal('')),
  emailNotifications: z.boolean(),
  pushNotifications: z.boolean(),
})

export default function SettingsForm() {
  const [successMessage, setSuccessMessage] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    watch,
    setValue,
  } = useForm({
    resolver: zodResolver(settingsSchema),
    mode: 'all',
    defaultValues: {
      displayName: '',
      email: '',
      bio: '',
      emailNotifications: true,
      pushNotifications: false,
    },
  })

  const emailNotifications = watch('emailNotifications')
  const pushNotifications = watch('pushNotifications')

  const onSubmit = (data) => {
    console.log(data)
    setSuccessMessage('Settings saved successfully!')
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto max-w-lg space-y-6 p-6 text-left"
      noValidate
    >
      <h2 className="text-2xl font-semibold text-gray-900">Settings</h2>

      <div>
        <label htmlFor="displayName" className="mb-1 block text-sm font-medium text-gray-700">
          Display name
        </label>
        <input
          id="displayName"
          type="text"
          aria-invalid={errors.displayName ? 'true' : 'false'}
          aria-describedby={errors.displayName ? 'displayName-error' : undefined}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          {...register('displayName')}
        />
        {errors.displayName && (
          <p id="displayName-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.displayName.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          id="email"
          type="email"
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          {...register('email')}
        />
        {errors.email && (
          <p id="email-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.email.message}
          </p>
        )}
      </div>

      <div>
        <label htmlFor="bio" className="mb-1 block text-sm font-medium text-gray-700">
          Bio
        </label>
        <textarea
          id="bio"
          rows={4}
          aria-invalid={errors.bio ? 'true' : 'false'}
          aria-describedby={errors.bio ? 'bio-error' : undefined}
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-purple-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
          {...register('bio')}
        />
        {errors.bio && (
          <p id="bio-error" role="alert" className="mt-1 text-sm text-red-600">
            {errors.bio.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="emailNotifications" className="text-sm font-medium text-gray-700">
          Email notifications
        </label>
        <button
          id="emailNotifications"
          type="button"
          role="switch"
          aria-checked={emailNotifications}
          aria-labelledby="emailNotifications"
          onClick={() => setValue('emailNotifications', !emailNotifications, { shouldValidate: true })}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
            emailNotifications ? 'bg-purple-600' : 'bg-gray-200'
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
              emailNotifications ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <input type="hidden" {...register('emailNotifications')} />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="pushNotifications" className="text-sm font-medium text-gray-700">
          Push notifications
        </label>
        <button
          id="pushNotifications"
          type="button"
          role="switch"
          aria-checked={pushNotifications}
          aria-labelledby="pushNotifications"
          onClick={() => setValue('pushNotifications', !pushNotifications, { shouldValidate: true })}
          className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
            pushNotifications ? 'bg-purple-600' : 'bg-gray-200'
          }`}
        >
          <span
            aria-hidden="true"
            className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition-transform ${
              pushNotifications ? 'translate-x-5' : 'translate-x-0'
            }`}
          />
        </button>
        <input type="hidden" {...register('pushNotifications')} />
      </div>

      <button
        type="submit"
        disabled={!isValid}
        className="w-full rounded-md bg-purple-600 px-4 py-2 font-medium text-white transition-colors hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Save settings
      </button>

      {successMessage && (
        <p role="status" className="text-sm font-medium text-green-600">
          {successMessage}
        </p>
      )}
    </form>
  )
}
