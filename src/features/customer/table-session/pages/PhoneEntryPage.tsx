import { useLocation, useNavigate } from 'react-router-dom'
import { useAppDispatch } from '../../../../app/hooks'
import { Icon } from '../../../../components/Icon/Icon'
import { PhoneEntryForm } from '../components/PhoneEntryForm'
import { PhoneEntryWelcome } from '../components/PhoneEntryWelcome'
import { PhoneEntrySupport } from '../components/PhoneEntrySupport'
import { enterSession } from '../sessionSlice'

export function PhoneEntryPage() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { search } = useLocation()
  return (
    <main className="min-h-dvh bg-mint sm:px-5 sm:py-8 lg:flex lg:items-center lg:justify-center lg:bg-[radial-gradient(ellipse_at_top_left,#e1ecd8,transparent_65%)] lg:px-10 lg:py-10">
      <div className="mx-auto flex min-h-dvh w-full max-w-[440px] flex-col overflow-hidden bg-cream sm:min-h-[760px] sm:rounded-[2rem] sm:shadow-xl sm:shadow-brand/10 lg:grid lg:min-h-[660px] lg:max-w-[1120px] lg:grid-cols-[1.05fr_1fr] lg:rounded-[2rem] lg:border lg:border-white/80 lg:shadow-2xl lg:shadow-brand/10">
        <PhoneEntryWelcome />
        <section
          aria-labelledby="phone-entry-title"
          className="relative -mt-5 flex flex-1 flex-col rounded-t-3xl bg-cream px-6 pt-7 pb-[max(1.5rem,env(safe-area-inset-bottom))] lg:mt-0 lg:justify-center lg:rounded-none lg:px-10 lg:py-10 xl:px-14"
        >
          <div className="mx-auto flex w-full max-w-sm flex-1 flex-col lg:flex-initial">
            <div className="mb-7 hidden size-14 items-center justify-center rounded-2xl border border-brand/10 bg-mint text-brand lg:flex">
              <Icon name="utensils" size={26} />
            </div>
            <div className="mb-5 flex items-center gap-2 text-xs font-semibold text-brand lg:mb-3">
              <Icon name="utensils" size={17} className="lg:hidden" />
              Một bước nhỏ trước khi chọn món
            </div>
            <h2
              id="phone-entry-title"
              className="text-2xl leading-snug font-bold lg:text-[30px]"
            >
              Cho Mộc biết số
              <br />
              điện thoại nhé
            </h2>
            <p className="mt-3 hidden text-sm leading-6 text-muted lg:block">
              Để bắt đầu gọi món tại bàn, bạn chỉ cần nhập số điện thoại bên
              dưới.
            </p>
            <PhoneEntryForm
              onSubmit={({ phone }) => {
                dispatch(enterSession({ phone, qrContext: search }))
                navigate({ pathname: '/menu', search }, { replace: true })
              }}
            />
            <PhoneEntrySupport />
          </div>
        </section>
      </div>
    </main>
  )
}
