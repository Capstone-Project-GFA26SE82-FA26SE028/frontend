import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAppSelector } from '../../../app/hooks'
import { BrandLogo } from '../../../components/BrandLogo/BrandLogo'
import { BrandBackground } from '../../../components/BrandBackground/BrandBackground'
import { RestaurantHours } from '../../platform-admin/restaurants/components/RestaurantHours'
import { restaurantSchema } from '../../platform-admin/restaurants/schemas/restaurantSchema'
import { registerSchema } from '../schemas/registerSchema'
import { registerErrorMessage } from '../api/authApi'
import {
  registerRestaurant,
  type RegistrationReceipt,
} from '../api/restaurantRegistrationApi'

const accountSchema = registerSchema.safeExtend({
  phoneNumber: z.string().trim().max(20, 'Số điện thoại tối đa 20 ký tự.'),
})
const schema = restaurantSchema.safeExtend({
  fullName: z.string(),
  email: z.string(),
  phoneNumber: z.string(),
  password: z.string(),
  confirmPassword: z.string(),
})
type Values = z.infer<typeof schema>
const initialHours = Array.from({ length: 7 }, (_, dayOfWeek) => ({
  dayOfWeek,
  openAt: '09:00',
  closeAt: '22:00',
}))

export function RestaurantRegisterPage() {
  const { session, status } = useAppSelector((state) => state.auth)
  const [receipt, setReceipt] = useState<RegistrationReceipt | null>(null)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  // Keep the same id when retrying after a timeout: the backend reserves the account by this id.
  const registrationId = useRef<string | null>(null)
  const businessRef = useRef<HTMLInputElement>(null)
  const safetyRef = useRef<HTMLInputElement>(null)
  const {
    register,
    handleSubmit,
    setError: setFieldError,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      restaurantName: '',
      address: '',
      hotline: '',
      taxCode: '',
      timeZone: 'Asia/Ho_Chi_Minh',
      openingHours: initialHours,
      fullName: '',
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    },
  })
  const eligible =
    !session ||
    (session.user.roleId === 'customer' &&
      !session.user.restaurantId &&
      session.user.isActive)

  async function submit(values: Values) {
    setError('')
    const account = session ? null : accountSchema.safeParse(values)
    if (account && !account.success) {
      for (const issue of account.error.issues)
        setFieldError(
          issue.path[0] as keyof Values,
          { message: issue.message },
          { shouldFocus: true },
        )
      return
    }
    const business = businessRef.current?.files?.[0]
    const safety = safetyRef.current?.files?.[0]
    for (const file of [business, safety]) {
      if (
        !file ||
        file.size === 0 ||
        file.size > 2 * 1024 * 1024 ||
        !['image/jpeg', 'image/png', 'image/webp'].includes(file.type)
      ) {
        setError(
          'Vui lòng chọn đủ hai ảnh JPEG, PNG hoặc WebP, mỗi ảnh không quá 2 MiB.',
        )
        return
      }
    }
    try {
      registrationId.current ??= crypto.randomUUID()
      setReceipt(
        await registerRestaurant(
          registrationId.current,
          values,
          account?.success ? account.data : null,
          business!,
          safety!,
        ),
      )
    } catch (cause) {
      setError(registerErrorMessage(cause))
    }
  }

  function field(
    name: Exclude<keyof Values, 'openingHours'>,
    label: string,
    type = 'text',
    autoComplete?: string,
    maxLength?: number,
  ) {
    return (
      <div key={name} className={name === 'address' ? 'sm:col-span-2' : ''}>
        <label htmlFor={`restaurant-${name}`} className="text-sm font-semibold">
          {label}
        </label>
        <input
          id={`restaurant-${name}`}
          type={type}
          autoComplete={autoComplete}
          maxLength={maxLength}
          className="field mt-2"
          {...register(name)}
          aria-invalid={!!errors[name]}
          aria-describedby={errors[name] ? `${name}-error` : undefined}
        />
        {errors[name] && (
          <p
            id={`${name}-error`}
            role="alert"
            className="mt-1 text-sm text-rose-700"
          >
            {errors[name]?.message}
          </p>
        )}
      </div>
    )
  }

  return (
    <main
      lang="vi"
      className="relative isolate min-h-dvh bg-[#123d30] px-4 py-10 text-[#173e32]"
    >
      <BrandBackground />
      <div className="relative mx-auto max-w-3xl">
        <Link
          to="/"
          className="mb-6 inline-block rounded-lg py-2 text-sm text-white hover:underline"
        >
          ← Trang chủ
        </Link>
        <div className="mb-7 flex justify-center">
          <Link to="/" aria-label="DineLink - Trang chủ">
            <BrandLogo />
          </Link>
        </div>
        <section className="rounded-3xl bg-white p-6 shadow-2xl sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-wider text-emerald-700">
            Dành cho đối tác DineLink
          </p>
          <h1 className="mt-2 text-3xl font-bold">Đăng ký admin nhà hàng</h1>
          {receipt ? (
            <div role="status" className="mt-6 space-y-4">
              <h2 className="text-xl font-semibold">
                {receipt.status === 'Approved'
                  ? 'Hồ sơ đã được duyệt'
                  : 'Đã tiếp nhận hồ sơ'}
              </h2>
              <p>
                {receipt.status === 'Approved'
                  ? 'Vui lòng đăng nhập lại để sử dụng quyền quản trị nhà hàng.'
                  : 'Hồ sơ đang được nền tảng xét duyệt. Quyền admin nhà hàng sẽ được cấp sau khi hồ sơ được duyệt.'}
              </p>
              {!session && receipt.status !== 'Approved' && (
                <p>Tài khoản mới chỉ có thể đăng nhập sau khi được duyệt.</p>
              )}
              <p className="break-all rounded-xl bg-emerald-50 p-4 text-sm">
                Mã hồ sơ: <strong>{receipt.registrationId}</strong>
              </p>
              <Link to="/" className="btn-primary inline-flex">
                Về trang chủ
              </Link>
            </div>
          ) : !eligible ? (
            <p role="alert" className="mt-6 rounded-xl bg-amber-50 p-4">
              Chỉ khách chưa có tài khoản hoặc tài khoản khách hàng đang hoạt
              động, chưa thuộc nhà hàng mới có thể nộp hồ sơ.
            </p>
          ) : (
            <>
              <p className="mt-3 text-sm leading-6 text-muted">
                Điền thông tin và gửi giấy tờ để nền tảng xét duyệt nhà hàng của
                bạn.
              </p>
              <form
                noValidate
                className="mt-8 space-y-7"
                onSubmit={(event) => {
                  void handleSubmit((values) => submit(values))(event)
                }}
              >
                <fieldset
                  disabled={
                    isSubmitting || status === 'checking' || status === 'error'
                  }
                  className="min-w-0 space-y-7 disabled:opacity-70"
                >
                  <section>
                    <h2 className="mb-4 text-lg font-bold">
                      1. Tài khoản quản trị
                    </h2>
                    {session ? (
                      <p className="rounded-xl bg-emerald-50 p-4 text-sm">
                        Sử dụng tài khoản hiện tại:{' '}
                        <strong className="break-all">
                          {session.user.email}
                        </strong>
                        . Tài khoản sẽ nhận quyền admin khi hồ sơ được duyệt.
                      </p>
                    ) : (
                      <div className="grid gap-4 sm:grid-cols-2">
                        {field('fullName', 'Họ và tên', 'text', 'name', 255)}
                        {field('email', 'Email', 'email', 'email', 255)}
                        {field(
                          'phoneNumber',
                          'Số điện thoại (không bắt buộc)',
                          'tel',
                          'tel',
                          20,
                        )}
                        {field(
                          'password',
                          'Mật khẩu (ít nhất 8 ký tự)',
                          showPassword ? 'text' : 'password',
                          'new-password',
                        )}
                        {field(
                          'confirmPassword',
                          'Nhập lại mật khẩu',
                          showPassword ? 'text' : 'password',
                          'new-password',
                        )}
                        <label className="flex items-center gap-2 text-sm">
                          <input
                            type="checkbox"
                            checked={showPassword}
                            onChange={(e) => setShowPassword(e.target.checked)}
                          />
                          Hiện mật khẩu
                        </label>
                        <p className="text-sm text-muted sm:col-span-2">
                          Đã có tài khoản khách hàng?{' '}
                          <Link
                            className="font-semibold text-brand hover:underline"
                            to="/login"
                            state={{ from: '/register/restaurant' }}
                          >
                            Đăng nhập để dùng tài khoản hiện tại
                          </Link>
                          .
                        </p>
                      </div>
                    )}
                  </section>
                  <section className="space-y-4 border-t border-slate-100 pt-6">
                    <h2 className="text-lg font-bold">2. Thông tin nhà hàng</h2>
                    <div className="grid gap-4 sm:grid-cols-2">
                      {field(
                        'restaurantName',
                        'Tên nhà hàng',
                        'text',
                        'organization',
                        255,
                      )}
                      {field('hotline', 'Hotline', 'tel', 'tel', 20)}
                      {field(
                        'address',
                        'Địa chỉ',
                        'text',
                        'street-address',
                        500,
                      )}
                      {field(
                        'taxCode',
                        'Mã số thuế (không bắt buộc)',
                        'text',
                        undefined,
                        50,
                      )}
                      <div>
                        <label
                          htmlFor="restaurant-timeZone"
                          className="text-sm font-semibold"
                        >
                          Múi giờ
                        </label>
                        <select
                          id="restaurant-timeZone"
                          className="field mt-2"
                          {...register('timeZone')}
                        >
                          <option value="Asia/Ho_Chi_Minh">
                            Việt Nam (UTC+7)
                          </option>
                        </select>
                      </div>
                    </div>
                    <RestaurantHours
                      initialHours={initialHours}
                      onChange={(hours) =>
                        setValue('openingHours', hours, {
                          shouldValidate: true,
                        })
                      }
                      error={
                        errors.openingHours
                          ? 'Kiểm tra lịch hoạt động: giờ đóng cửa phải sau giờ mở cửa trong cùng ngày.'
                          : undefined
                      }
                    />
                  </section>
                  <section className="space-y-4 border-t border-slate-100 pt-6">
                    <h2 className="text-lg font-bold">3. Giấy tờ xác minh</h2>
                    <p id="document-help" className="text-sm text-muted">
                      Mỗi giấy tờ cần một ảnh JPEG, PNG hoặc WebP, tối đa 2 MiB.
                    </p>
                    {[
                      {
                        id: 'business',
                        label: 'Giấy chứng nhận đăng ký kinh doanh',
                        ref: businessRef,
                      },
                      {
                        id: 'safety',
                        label: 'Giấy chứng nhận an toàn thực phẩm',
                        ref: safetyRef,
                      },
                    ].map((doc) => (
                      <div key={doc.id}>
                        <label
                          htmlFor={doc.id}
                          className="text-sm font-semibold"
                        >
                          {doc.label}
                        </label>
                        <input
                          id={doc.id}
                          ref={doc.ref}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          aria-describedby="document-help"
                          className="field mt-2 text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:text-emerald-800"
                        />
                      </div>
                    ))}
                  </section>
                  {error && (
                    <p
                      role="alert"
                      className="rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
                    >
                      {error}
                    </p>
                  )}
                  <button type="submit" className="btn-primary min-h-12 w-full">
                    {isSubmitting ? 'Đang gửi hồ sơ…' : 'Gửi hồ sơ đăng ký'}
                  </button>
                </fieldset>
                {(status === 'checking' || status === 'error') && (
                  <p role="status">
                    {status === 'checking'
                      ? 'Đang kiểm tra tài khoản…'
                      : 'Không thể xác minh tài khoản. Vui lòng vào trang đăng nhập để thử lại.'}
                  </p>
                )}
              </form>
            </>
          )}
        </section>
      </div>
    </main>
  )
}
