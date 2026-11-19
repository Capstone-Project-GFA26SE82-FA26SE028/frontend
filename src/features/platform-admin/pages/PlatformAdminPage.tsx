import { Icon } from '../../../components/Icon/Icon'
export function PlatformAdminPage() {
  return (
    <section className="panel p-6 sm:p-8">
      <span className="inline-flex size-12 items-center justify-center rounded-2xl bg-mint text-brand">
        <Icon name="shield" size={24} />
      </span>
      <h1 className="mt-5 text-2xl font-bold">Quản trị nền tảng</h1>
      <p className="mt-3 max-w-xl text-sm leading-6 text-muted">
        Bạn đang đăng nhập bằng tài khoản quản trị nền tảng DineLink. Các chức
        năng quản trị toàn nền tảng sẽ được bổ sung tại đây.
      </p>
    </section>
  )
}
