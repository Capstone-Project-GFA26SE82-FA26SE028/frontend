import { HomeHeader } from '../../../../components/HomeHeader/HomeHeader'
import { Icon } from '../../../../components/Icon/Icon'
import { RestaurantList } from '../components/RestaurantList'
import { RestaurantBanner } from '../components/RestaurantBanner'

export function RestaurantsPage() {
  return (
    <div
      lang="vi"
      className="flex min-h-dvh flex-col bg-[#faf9f6] text-[#173e32]"
    >
      <HomeHeader />
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 pt-6 pb-10 sm:px-8 sm:pt-8">
        <RestaurantBanner />
        <RestaurantList />
      </main>
      <footer className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 py-5 text-xs text-slate-500 sm:px-8">
        <span>DineLink</span>
        <a
          href="mailto:foodhub@gmail.com"
          className="flex items-center gap-2 hover:text-emerald-800"
        >
          <Icon name="mail" size={14} />
          foodhub@gmail.com
        </a>
      </footer>
    </div>
  )
}
