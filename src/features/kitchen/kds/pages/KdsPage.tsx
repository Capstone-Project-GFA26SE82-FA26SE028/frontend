import { KdsOperations } from '../components/KdsOperations'
import { KdsFilters } from '../components/KdsFilters'
import { KdsBoard } from '../components/KdsBoard'
import { KdsFeedback } from '../components/KdsFeedback'
import { KdsDishDetailModal } from '../components/KdsDishDetailModal'
import { RecipeModal } from '../components/RecipeModal'
import { useKdsBoard } from '../hooks/useKdsBoard'

export function KdsPage() {
  const m = useKdsBoard()
  const lateCount = m.active.filter(m.late).length

  return (
    <div
      className={`text-slate-800 flex flex-col flex-1 min-h-0 overflow-hidden ${
        m.focus
          ? 'fixed inset-0 z-50 bg-slate-100 p-2 sm:p-3'
          : 'h-full w-full'
      }`}
    >
      {/* 1. Thanh điều phối bếp tiện gọn + Đồng hồ + Toàn màn hình (Hợp nhất 1 dòng duy nhất, dễ thấy) */}
      <div className="shrink-0">
        <KdsOperations
          now={m.now}
          focus={m.focus}
          onToggleFocus={() => m.setFocus((value) => !value)}
          area={m.state.area}
          lateCount={lateCount}
        />
      </div>

      {/* 2. Thanh điều hướng cho các ô + Bộ lọc & Tìm kiếm (Hợp nhất 1 dòng) */}
      <div className="shrink-0">
        <KdsFilters
          query={m.query}
          setQuery={m.setQuery}
          filter={m.filter}
          setFilter={m.setFilter}
          sort={m.sort}
          setSort={m.setSort}
          active={m.active}
          activeColumn={m.activeColumn}
          setActiveColumn={m.setActiveColumn}
          orders={m.orders}
        />
      </div>

      {/* 3. Bảng KDS Kanban - Chiếm trọn 100% không gian còn lại. Màn hình CỐ ĐỊNH, CHỈ cuộn bên trong mỗi ô */}
      <div className="flex-1 min-h-0 overflow-hidden">
        <KdsBoard
          shown={m.shown}
          active={m.active}
          dishes={m.state.dishes}
          now={m.now}
          late={m.late}
          isFiltered={!!m.query || m.filter !== 'All'}
          activeColumn={m.activeColumn}
          onSelect={m.setSelected}
          onRecipe={m.setRecipeId}
          onTransition={m.act}
        />
      </div>

      {/* Thông báo phản hồi */}
      {m.notice && (
        <KdsFeedback
          message={m.state.feedback?.error ? m.state.feedback.text : m.notice}
          onDismiss={() => m.setNotice('')}
        />
      )}

      {/* Modal chi tiết dòng món */}
      {m.selectedTicket && m.selectedDish && (
        <KdsDishDetailModal
          ticket={m.selectedTicket}
          dish={m.selectedDish}
          onClose={() => m.setSelected('')}
          onRecipe={m.setRecipeId}
        />
      )}

      {/* Modal xem công thức */}
      {m.recipeDish && (
        <RecipeModal dish={m.recipeDish} onClose={() => m.setRecipeId('')} />
      )}
    </div>
  )
}
