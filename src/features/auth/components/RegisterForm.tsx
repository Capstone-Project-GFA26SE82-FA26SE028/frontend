import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Icon } from '../../../components/Icon/Icon'
import { registerSchema } from '../schemas/registerSchema'
import { useRegister } from '../hooks/useRegister'
import { registerErrorMessage } from '../api/authApi'
import type { RegisterFormValues } from '../types/types'

export function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const mutation = useRegister()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  })
  return (
    <form
      noValidate
      className="mt-6 space-y-4"
      onSubmit={handleSubmit(async (values) => {
        try {
          await mutation.mutateAsync({
            fullName: values.fullName,
            email: values.email,
            phoneNumber: values.phoneNumber,
            password: values.password,
          })
        } catch {
          /* Error is displayed below; do not automatically replay registration. */
        }
      })}
    >
      <fieldset disabled={isSubmitting} className="space-y-4">
        <div>
          <label htmlFor="register-fullName" className="text-sm font-semibold">
            Họ và tên
          </label>
          <input
            id="register-fullName"
            type="text"
            autoComplete="name"
            placeholder="Nguyễn Văn A"
            className="field mt-2"
            {...register('fullName')}
            aria-invalid={!!errors.fullName}
            aria-describedby={
              errors.fullName ? 'register-fullName-error' : undefined
            }
          />
          {errors.fullName && (
            <p
              id="register-fullName-error"
              role="alert"
              className="mt-1.5 text-xs text-rose-700"
            >
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="register-email" className="text-sm font-semibold">
            Email
          </label>
          <input
            id="register-email"
            type="email"
            autoComplete="email"
            placeholder="ABC@gmail.com"
            className="field mt-2"
            {...register('email')}
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'register-email-error' : undefined}
          />
          {errors.email && (
            <p
              id="register-email-error"
              role="alert"
              className="mt-1.5 text-xs text-rose-700"
            >
              {errors.email.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="register-phoneNumber"
            className="text-sm font-semibold"
          >
            Số điện thoại (không bắt buộc)
          </label>
          <input
            id="register-phoneNumber"
            type="tel"
            inputMode="tel"
            autoComplete="tel-national"
            placeholder="0901234567"
            className="field mt-2"
            {...register('phoneNumber')}
            aria-invalid={!!errors.phoneNumber}
            aria-describedby={
              errors.phoneNumber ? 'register-phoneNumber-error' : undefined
            }
          />
          {errors.phoneNumber && (
            <p
              id="register-phoneNumber-error"
              role="alert"
              className="mt-1.5 text-xs text-rose-700"
            >
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="register-password" className="text-sm font-semibold">
            Mật khẩu
          </label>
          <div className="relative mt-2">
            <input
              id="register-password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Nhập mật khẩu ít nhất 8 ký tự"
              className="field pr-14"
              {...register('password')}
              aria-invalid={!!errors.password}
              aria-describedby={
                errors.password ? 'register-password-error' : undefined
              }
            />
            <button
              type="button"
              aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
              aria-pressed={showPassword}
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-1 flex min-w-11 items-center justify-center rounded-lg text-muted hover:text-brand"
            >
              <Icon name={showPassword ? 'eye-off' : 'eye'} size={19} />
            </button>
          </div>
          {errors.password && (
            <p
              id="register-password-error"
              role="alert"
              className="mt-1.5 text-xs text-rose-700"
            >
              {errors.password.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="register-confirmPassword"
            className="text-sm font-semibold"
          >
            Nhập lại mật khẩu
          </label>
          <div className="relative mt-2">
            <input
              id="register-confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              placeholder="Nhập lại mật khẩu"
              className="field pr-14"
              {...register('confirmPassword')}
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={
                errors.confirmPassword
                  ? 'register-confirmPassword-error'
                  : undefined
              }
            />
            <button
              type="button"
              aria-label={
                showConfirmPassword
                  ? 'Ẩn nhập lại mật khẩu'
                  : 'Hiện nhập lại mật khẩu'
              }
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-1 flex min-w-11 items-center justify-center rounded-lg text-muted hover:text-brand"
            >
              <Icon name={showConfirmPassword ? 'eye-off' : 'eye'} size={19} />
            </button>
          </div>
          {errors.confirmPassword && (
            <p
              id="register-confirmPassword-error"
              role="alert"
              className="mt-1.5 text-xs text-rose-700"
            >
              {errors.confirmPassword.message}
            </p>
          )}
        </div>
        {mutation.isError && (
          <p
            role="alert"
            className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
          >
            {registerErrorMessage(mutation.error)}
          </p>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="btn-primary min-h-12 w-full"
        >
          {isSubmitting ? 'Đang đăng ký…' : 'Tạo tài khoản'}
        </button>
      </fieldset>
      <p className="text-center text-sm text-muted">
        Đã có tài khoản?{' '}
        <Link to="/login" className="font-semibold text-brand hover:underline">
          Đăng nhập
        </Link>
      </p>
    </form>
  )
}
