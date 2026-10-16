import { useRestaurantProfile } from '../hooks/useRestaurantProfile'
import { RestaurantProfileForm } from '../components/RestaurantProfileForm'
import { RestaurantHeading } from '../../components/RestaurantHeading'
export function RestaurantProfilePage() {
  const { state, saveProfile } = useRestaurantProfile()
  return (
    <>
      <RestaurantHeading
        title="Thông tin nhà hàng"
        description="Thông tin liên hệ và nhận diện của nhà hàng"
      />
      <RestaurantProfileForm profile={state.profile} onSave={saveProfile} />
    </>
  )
}
