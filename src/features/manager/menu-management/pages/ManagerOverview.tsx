import { Link } from 'react-router-dom'
import { useAppSelector } from '../../../../app/hooks'
import { Icon } from '../../../../components/Icon/Icon'
import {
  PageHeading,
  Panel,
  SummaryCards,
} from '../../../admin/components/AdminUI'
import { QueryState } from '../components/QueryState'
import { useManagerOverview } from '../hooks/useManagerOverview'

export function ManagerOverview() {
  const name = useAppSelector(
    (s) => s.auth.session?.user.fullName || s.auth.session?.user.userName,
  )
  const stats = useManagerOverview()
  return (
    <>
      <div className="mb-6 rounded-2xl bg-linear-to-r from-[#003b2e] to-emerald-800 p-6 text-white sm:p-8">
        <p className="text-sm text-emerald-100">Manager workspace</p>
        <h1 className="mt-2 text-2xl font-bold sm:text-3xl">
          Hello, {name || 'Manager'}
        </h1>
        <p className="mt-3 max-w-xl text-sm leading-6 text-emerald-100">
          Manage your menu, update prices, and monitor item availability in one
          workspace.
        </p>
        <Link
          to="/manager/menu/items"
          className="mt-5 inline-flex min-h-11 items-center gap-2 rounded-xl bg-white px-4 py-2 text-sm font-semibold text-emerald-900"
        >
          Manage menu items
          <Icon name="arrow" size={16} />
        </Link>
      </div>
      <QueryState
        pending={stats.isPending}
        error={stats.error}
        retry={() => void stats.refetch()}
      >
        <SummaryCards
          items={[
            {
              label: 'Categories',
              value: stats.data?.categories ?? '—',
              icon: 'grid',
              note: 'Menu categories',
            },
            {
              label: 'Menu items',
              value: stats.data?.items ?? '—',
              icon: 'utensils',
              note: 'All statuses',
            },
            {
              label: 'Available',
              value: stats.data?.selling ?? '—',
              icon: 'check',
              note: 'Items available for sale',
            },
            {
              label: 'Price configurations',
              value: stats.data?.prices ?? '—',
              icon: 'coin',
              note: 'Includes scheduled prices',
            },
          ]}
        />
      </QueryState>
      <PageHeading
        eyebrow="Management"
        title="Menu & Pricing"
        description="Organize categories, update menu items, and schedule prices for every occasion."
      />
      <div className="grid gap-4 md:grid-cols-3">
        {[
          {
            path: 'categories',
            label: 'Categories',
            icon: 'grid',
            description:
              'Organize the menu into categories and manage their names and availability.',
          },
          {
            path: 'items',
            label: 'Menu items',
            icon: 'utensils',
            description:
              'Manage images, descriptions, and categories. Mark items as available, out of stock, or inactive.',
          },
          {
            path: 'prices',
            label: 'Pricing',
            icon: 'coin',
            description:
              'Set standard prices and pricing by channel or time window. Check applied prices before selling.',
          },
        ].map((card) => (
          <Panel key={card.path} className="p-6">
            <span className="inline-flex rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <Icon name={card.icon} size={24} />
            </span>
            <h2 className="mt-4 text-lg font-semibold">{card.label}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              {card.description}
            </p>
            <Link
              className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-700"
              to={`/manager/menu/${card.path}`}
            >
              Manage
              <Icon name="arrow" size={16} />
            </Link>
          </Panel>
        ))}
      </div>
      <div className="mt-8">
        <PageHeading
          eyebrow="Management"
          title="Ingredients & Food Cost"
          description="Manage ingredients and units, define recipes, and review food-cost readiness."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              path: 'ingredients',
              title: 'Ingredients',
              description:
                'Manage raw ingredients, base units, and low-stock thresholds.',
            },
            {
              path: 'recipes',
              title: 'Recipes & BOM',
              description:
                'Set quantities per portion and maintain versioned preparation instructions.',
            },
            {
              path: 'food-cost',
              title: 'Food Cost',
              description:
                'Review active recipes and identify missing ingredient cost information.',
            },
          ].map((card) => (
            <Panel key={card.path} className="p-6">
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {card.description}
              </p>
              <Link
                to={`/manager/${card.path}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-700"
              >
                Manage
                <Icon name="arrow" size={16} />
              </Link>
            </Panel>
          ))}
        </div>
      </div>
      <div className="mt-8">
        <PageHeading
          eyebrow="Management"
          title="Inventory Monitoring"
          description="Track stock balances, review receipt lots, and investigate recorded ingredient outflow."
        />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            {
              path: 'stock',
              title: 'Stock overview',
              description:
                'Monitor recorded balances and low-stock alerts across ingredients.',
            },
            {
              path: 'stock-history',
              title: 'Movements & Lots',
              description:
                'Inspect stock movements, receipt quantities, and expiry dates.',
            },
            {
              path: 'stock-variance',
              title: 'Usage & Variance',
              description:
                'Review recorded outflow and identify missing data for usage comparisons.',
            },
          ].map((card) => (
            <Panel key={card.path} className="p-6">
              <h2 className="text-lg font-semibold">{card.title}</h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                {card.description}
              </p>
              <Link
                to={`/manager/${card.path}`}
                className="mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-emerald-700"
              >
                View
                <Icon name="arrow" size={16} />
              </Link>
            </Panel>
          ))}
        </div>
      </div>
    </>
  )
}
