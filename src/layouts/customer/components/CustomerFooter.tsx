export function CustomerFooter() {
  return (
    <footer className="shrink-0 border-t border-stone-200/70 pb-24 md:pb-5">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-1.5 px-5 pt-5 text-center text-xs text-muted sm:flex-row sm:justify-between sm:px-8 lg:px-12">
        <p>
          &copy; {new Date().getFullYear()}{' '}
          <span className="font-semibold text-brand">FoodHub.</span> Bảo lưu mọi
          quyền.
        </p>
        <p>
          Liên hệ:{' '}
          <a
            href="mailto:foodhub@gmail.com"
            className="font-medium text-brand hover:underline"
          >
            foodhub@gmail.com
          </a>
        </p>
      </div>
    </footer>
  )
}
