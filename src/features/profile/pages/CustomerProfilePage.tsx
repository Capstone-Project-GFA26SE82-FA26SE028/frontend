import { HomeHeader } from '../../../components/HomeHeader/HomeHeader'
import { ProfilePage } from './ProfilePage'

export function CustomerProfilePage() {
  return (
    <div className="min-h-dvh">
      <HomeHeader />
      <main className="mx-auto w-full max-w-6xl px-4 py-6 sm:px-6 sm:py-9">
        <ProfilePage />
      </main>
    </div>
  )
}
