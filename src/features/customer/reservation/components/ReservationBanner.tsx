export function ReservationBanner() {
  return (
    <div className="hidden items-center justify-center lg:flex">
      <div className="aspect-square w-full max-w-[300px] overflow-hidden rounded-full bg-[#123d30]">
        <img
          src="/images/login-dining.svg"
          alt="Đĩa salad cùng dao và nĩa"
          width={320}
          height={320}
          className="h-full w-full object-contain"
        />
      </div>
    </div>
  )
}
