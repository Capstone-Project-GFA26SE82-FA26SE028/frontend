import { Icon } from '../../../../components/Icon/Icon'

export function ReservationBanner() {
  return (
    <div className="relative overflow-hidden rounded-t-3xl bg-brand-dark px-6 pt-6 pb-11 text-white lg:min-h-72 lg:rounded-3xl lg:p-12">
      <Icon
        name="leaf"
        size={38}
        className="absolute top-6 right-6 text-lime-200/40 lg:static lg:text-lime-200"
      />
      <p className="relative pr-12 text-[10px] font-semibold tracking-[.2em] text-lime-200 lg:mt-12 lg:pr-0 lg:text-xs">
        HẸN NHAU Ở MỘC
      </p>
      <h1 className="relative mt-3 text-[28px] leading-[1.35] font-semibold lg:mt-4 lg:text-5xl lg:leading-tight">
        Một chiếc bàn.
        <br />
        Nhiều câu chuyện.
      </h1>
      <p className="mt-6 hidden max-w-sm text-sm leading-7 text-white/75 lg:block">
        Bữa cơm gia đình, buổi hẹn nhẹ nhàng hay một cuộc gặp bạn bè. Mộc dành
        một góc thật ấm cho bạn.
      </p>
      <div className="mt-10 hidden border-t border-white/20 pt-6 text-sm text-white/80 lg:block">
        Không gian vườn · Bữa ăn tươi lành
      </div>
    </div>
  )
}
