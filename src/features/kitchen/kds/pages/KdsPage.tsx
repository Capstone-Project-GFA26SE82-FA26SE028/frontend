import { Icon } from '../../../../components/Icon/Icon'
import { KdsHeader } from '../components/KdsHeader'
import { KdsOverview } from '../components/KdsOverview'
import { KdsFilters } from '../components/KdsFilters'
import { KdsBoard } from '../components/KdsBoard'
import { KdsFeedback } from '../components/KdsFeedback'
import { KdsDishDetailModal } from '../components/KdsDishDetailModal'
import { RecipeModal } from '../components/RecipeModal'
import { useKdsBoard } from '../hooks/useKdsBoard'

export function KdsPage() {
  const m = useKdsBoard()
  return (
    <div
      className={`text-[#183c33] [&_button]:outline-offset-4 [&_input]:outline-offset-4 [&_select]:outline-offset-4 ${m.focus ? 'fixed inset-0 z-[45] overflow-auto bg-[#f2f6f4] px-3 py-[18px] md:px-8 md:py-6' : 'relative px-0.5 pt-1 pb-3'}`}
    >
      <KdsHeader
        now={m.now}
        focus={m.focus}
        onToggleFocus={() => m.setFocus((value) => !value)}
      />
      <KdsOverview
        area={m.state.area}
        orders={m.orders}
        active={m.active}
        late={m.late}
      />
      <KdsFilters
        query={m.query}
        setQuery={m.setQuery}
        filter={m.filter}
        setFilter={m.setFilter}
        sort={m.sort}
        setSort={m.setSort}
        active={m.active}
      />
      <KdsBoard
        shown={m.shown}
        active={m.active}
        dishes={m.state.dishes}
        now={m.now}
        late={m.late}
        isFiltered={!!m.query || m.filter !== 'All'}
        onSelect={m.setSelected}
        onRecipe={m.setRecipeId}
        onTransition={m.act}
      />
      <div className="mt-[18px] flex flex-wrap items-center justify-between gap-3 text-sm text-[#475569] [&>span]:flex [&>span]:items-center [&>span]:gap-[7px]">
        <span>
          <Icon name="shield" size={14} /> Quản lý từng món · Tự động kiểm tra
          nguyên liệu khi bắt đầu nấu
        </span>
      </div>
      {m.notice && (
        <KdsFeedback
          message={m.state.feedback?.error ? m.state.feedback.text : m.notice}
          onDismiss={() => m.setNotice('')}
        />
      )}
      {m.selectedTicket && m.selectedDish && (
        <KdsDishDetailModal
          ticket={m.selectedTicket}
          dish={m.selectedDish}
          onClose={() => m.setSelected('')}
          onRecipe={m.setRecipeId}
        />
      )}
      {m.recipeDish && (
        <RecipeModal dish={m.recipeDish} onClose={() => m.setRecipeId('')} />
      )}
    </div>
  )
}
