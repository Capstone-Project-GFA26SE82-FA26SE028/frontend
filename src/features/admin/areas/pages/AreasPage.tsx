import { Modal } from '../../../../components/Modal/Modal'
import {
  PageHeading,
  Panel,
  Pagination,
  primaryButton,
  secondaryButton,
} from '../../components/AdminUI'
import { AreaFilters } from '../components/AreaFilters'
import { AreaTable } from '../components/AreaTable'
import { AreaForm } from '../components/AreaForm'
import { AreaDetail } from '../components/AreaDetail'
import { useAreas } from '../hooks/useAreas'
import { areaError } from '../api/areaApi'
export function AreasPage() {
  const m = useAreas(),
    { target, detail, mutation } = m
  const restaurants = m.restaurants.data || []
  const area = detail.data
  return (
    <>
      <PageHeading
        title="Restaurant Areas"
        description="Manage service areas for each restaurant."
        action={
          <button className={primaryButton} onClick={() => m.open('create')}>
            + Add area
          </button>
        }
      />
      {m.restaurants.isError && (
        <div
          role="alert"
          className="mb-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700"
        >
          Unable to load restaurant names.{' '}
          <button
            className="underline"
            onClick={() => void m.restaurants.refetch()}
          >
            Retry
          </button>
        </div>
      )}
      <Panel>
        <AreaFilters
          search={m.search}
          onSearch={m.setSearch}
          status={m.status}
          onStatus={m.filterStatus}
          restaurantId={m.restaurantId}
          onRestaurant={m.filterRestaurant}
          restaurants={restaurants}
          onReset={m.reset}
        />
        {m.list.isPending ? (
          <p role="status" className="p-8 text-center text-slate-500">
            Loading areas...
          </p>
        ) : m.list.isError ? (
          <div className="space-y-3 p-8 text-center">
            <p role="alert">{areaError(m.list.error)}</p>
            <button
              className={secondaryButton}
              onClick={() => void m.list.refetch()}
            >
              Try again
            </button>
          </div>
        ) : (
          <fieldset
            className="min-w-0"
            disabled={m.list.isPlaceholderData}
            aria-busy={m.list.isFetching}
          >
            <AreaTable
              items={m.list.data.items}
              restaurants={restaurants}
              onAction={m.open}
            />
            <Pagination
              locale="en"
              total={m.list.data.totalCount}
              page={m.page}
              size={10}
              onPage={m.changePage}
            />
          </fieldset>
        )}
      </Panel>
      {target && (
        <Modal
          size={
            target.mode === 'create' || target.mode === 'edit'
              ? 'wide'
              : 'default'
          }
          title={
            target.mode === 'create'
              ? 'Add area'
              : target.mode === 'edit'
                ? 'Edit area'
                : target.mode === 'view'
                  ? 'Area details'
                  : target.mode === 'delete'
                    ? 'Delete area'
                    : area?.isActive
                      ? 'Deactivate area'
                      : 'Activate area'
          }
          closeLabel="Close"
          onClose={m.close}
        >
          {target.mode === 'create' ? (
            m.restaurants.isPending ? (
              <p role="status" className="p-6">
                Loading restaurants...
              </p>
            ) : m.restaurants.isError ? (
              <p className="p-6">
                Restaurant list unavailable. Close and retry.
              </p>
            ) : restaurants.length === 0 ? (
              <p className="p-6">Create a restaurant before adding an area.</p>
            ) : (
              <AreaForm
                restaurants={restaurants}
                restaurantId={m.restaurantId}
                pending={mutation.isPending}
                onClose={m.close}
                onSave={(values) =>
                  mutation.mutateAsync({ kind: 'save', values })
                }
              />
            )
          ) : detail.isPending ? (
            <p role="status" className="p-6">
              Loading area...
            </p>
          ) : detail.isError ? (
            <div className="space-y-3 p-6">
              <p role="alert">{areaError(detail.error)}</p>
              <button
                className={secondaryButton}
                onClick={() => void detail.refetch()}
              >
                Try again
              </button>
            </div>
          ) : (
            area &&
            (target.mode === 'view' ? (
              <AreaDetail
                area={area}
                restaurantName={
                  restaurants.find((r) => r.restaurantId === area.restaurantId)
                    ?.restaurantName || 'Restaurant unavailable'
                }
                onClose={m.close}
                onEdit={() => m.open('edit', area.areaId)}
              />
            ) : target.mode === 'edit' ? (
              <AreaForm
                key={area.areaId}
                area={area}
                restaurants={restaurants}
                restaurantId={area.restaurantId}
                pending={mutation.isPending}
                onClose={m.close}
                onSave={(values) =>
                  mutation.mutateAsync({
                    kind: 'save',
                    values,
                    id: area.areaId,
                  })
                }
              />
            ) : (
              <div className="space-y-5 p-6">
                <p className="break-words text-sm text-slate-600">
                  {target.mode === 'delete'
                    ? 'Delete ?' +
                      area.areaName +
                      '?? Areas containing tables cannot be deleted.'
                    : area.isActive
                      ? 'Deactivate ?' +
                        area.areaName +
                        '?? This is blocked while service sessions remain open.'
                      : 'Activate ?' + area.areaName + '??'}
                </p>
                {mutation.isError && (
                  <p
                    role="alert"
                    className="rounded-xl bg-rose-50 p-3 text-sm text-rose-700"
                  >
                    {areaError(mutation.error)}
                  </p>
                )}
                <div className="flex justify-end gap-3">
                  <button
                    disabled={mutation.isPending}
                    className={secondaryButton}
                    onClick={m.close}
                  >
                    Cancel
                  </button>
                  <button
                    disabled={mutation.isPending}
                    className={
                      target.mode === 'delete'
                        ? 'rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white disabled:opacity-50'
                        : primaryButton
                    }
                    onClick={() =>
                      mutation.mutate(
                        target.mode === 'delete'
                          ? { kind: 'delete', id: area.areaId }
                          : {
                              kind: 'status',
                              id: area.areaId,
                              isActive: !area.isActive,
                            },
                      )
                    }
                  >
                    {mutation.isPending
                      ? 'Saving...'
                      : target.mode === 'delete'
                        ? 'Delete'
                        : area.isActive
                          ? 'Deactivate'
                          : 'Activate'}
                  </button>
                </div>
              </div>
            ))
          )}
        </Modal>
      )}
    </>
  )
}
