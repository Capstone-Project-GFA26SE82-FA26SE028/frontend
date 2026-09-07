import { EmptyState } from '../../../../components/EmptyState/EmptyState'

export function MenuPage() {
  return (
    <>
      <h1>Thực đơn</h1>
      <EmptyState
        title="Thực đơn đang được chuẩn bị"
        description="Các món ăn sẽ được hiển thị tại đây khi thực đơn sẵn sàng."
      />
    </>
  )
}
