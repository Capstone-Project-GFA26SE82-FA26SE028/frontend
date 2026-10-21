import { useState } from 'react'
import { Icon } from '../../../components/Icon/Icon'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { loginSchema } from '../schemas/loginSchema'
import { useLogin } from '../hooks/useLogin'
import { authErrorMessage } from '../api/authApi'
import type { LoginInput } from '../types'

export function LoginForm() {
  const [visible, setVisible] = useState(false)
  const mutation = useLogin()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: '', password: '' },
  })
  return (
    <form
      noValidate
      className="mt-8 space-y-5"
      onSubmit={handleSubmit(async (input) => {
        try {
          await mutation.mutateAsync(input)
        } catch {
          /* Error shown below. */
        }
      })}
    >
      <div>
        <label htmlFor="login-email" className="text-sm font-semibold">
          Email or username
        </label>
        <input
          id="login-email"
          autoComplete="username"
          className="field mt-2"
          placeholder="Enter your email or username"
          {...register('email')}
          aria-invalid={!!errors.email}
          aria-describedby={errors.email ? 'email-error' : undefined}
        />
        {errors.email && (
          <p
            id="email-error"
            role="alert"
            className="mt-2 text-sm text-red-700"
          >
            {errors.email.message}
          </p>
        )}
      </div>
      <div>
        <label htmlFor="login-password" className="text-sm font-semibold">
          Password
        </label>
        <div className="relative mt-2">
          <input
            id="login-password"
            autoComplete="current-password"
            type={visible ? 'text' : 'password'}
            className="field pr-16"
            placeholder="Enter your password"
            {...register('password')}
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          <button
            type="button"
            aria-label={visible ? 'Hide password' : 'Show password'}
            aria-pressed={visible}
            className="absolute inset-y-0 right-2 flex min-w-11 items-center justify-center rounded-lg text-muted transition-colors hover:text-brand focus-visible:outline-2 focus-visible:outline-brand"
            onClick={() => setVisible(!visible)}
          >
            <Icon name={visible ? 'eye-off' : 'eye'} size={20} />
          </button>
        </div>
        {errors.password && (
          <p
            id="password-error"
            role="alert"
            className="mt-2 text-sm text-red-700"
          >
            {errors.password.message}
          </p>
        )}
      </div>
      {mutation.isError && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-700"
        >
          {authErrorMessage(mutation.error)}
        </p>
      )}
      <button
        type="submit"
        disabled={isSubmitting}
        className="btn-primary min-h-12 w-full"
      >
        {isSubmitting ? 'Signing in…' : 'Sign in'}
      </button>
      <p className="text-center text-xs leading-5 text-muted">
        Use the account provided by your restaurant. Contact your administrator
        if you need help.
      </p>
    </form>
  )
}
