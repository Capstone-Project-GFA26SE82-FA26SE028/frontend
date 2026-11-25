import { useState } from 'react'
import { PageHeading } from '../../../../components/PageHeading/PageHeading'
import { Panel } from '../../../../components/Panel/Panel'
import { SearchField } from '../../../../components/SearchField/SearchField'
import {
  Pagination,
  PAGE_SIZE,
} from '../../../../components/Pagination/Pagination'
import { QueryState } from '../../dishes/components/QueryState'
import { StationTabs } from '../components/StationTabs'
import { ItemStationRow } from '../components/ItemStationRow'
import {
  buttonClass,
  inputClass,
  tableClass,
} from '../constants/kitchenStation'
import {
  useStationChoices,
  useStationItems,
  useStationMutation,
} from '../hooks/useKitchenStations'
import { stationLabel } from '../utils/kitchenStation'

export function KitchenStationItemsPage() {
  const stations = useStationChoices()
  const items = useStationItems()
  const mutation = useStationMutation()
  const [search, setSearch] = useState('')
  const [stationId, setStationId] = useState('')
  const [page, setPage] = useState(1)
  const filtered = (items.data || []).filter(
    (item) =>
      `${item.itemCode} ${item.itemName}`
        .toLocaleLowerCase('vi')
        .includes(search.trim().toLocaleLowerCase('vi')) &&
      (!stationId ||
        (stationId === 'unassigned'
          ? !item.kitchenStationId
          : item.kitchenStationId === stationId)),
  )
  const currentPage = Math.min(
    page,
    Math.max(1, Math.ceil(filtered.length / PAGE_SIZE)),
  )
  const refresh = () => {
    void stations.refetch()
    void items.refetch()
  }
  return (
    <>
      <PageHeading
        eyebrow="Thiết lập bếp"
        title="Phân món cho trạm"
        description="Chọn trạm đang hoạt động rồi lưu từng món. Bỏ gán riêng để dùng định tuyến mặc định."
      />
      <StationTabs />
      <Panel>
        <div className="flex flex-wrap gap-3 p-4">
          <SearchField
            value={search}
            onChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            placeholder="Tìm mã hoặc tên món…"
          />
          <select
            aria-label="Lọc theo trạm bếp"
            className={`${inputClass} sm:w-72`}
            value={stationId}
            onChange={(event) => {
              setStationId(event.target.value)
              setPage(1)
            }}
          >
            <option value="">Tất cả trạm</option>
            <option value="unassigned">Chưa gán riêng</option>
            {stations.data?.map((station) => (
              <option
                key={station.kitchenStationId}
                value={station.kitchenStationId}
              >
                {stationLabel(station)}
              </option>
            ))}
          </select>
          <button className={buttonClass} onClick={refresh}>
            Làm mới
          </button>
        </div>
        {stations.data &&
          !stations.data.some((station) => station.isActive) && (
            <p className="px-4 pb-4 text-amber-700">
              Chưa có trạm đang hoạt động. Hãy tạo hoặc kích hoạt trạm trước khi
              gán món.
            </p>
          )}
        <QueryState
          pending={stations.isPending || items.isPending}
          error={stations.error || items.error}
          retry={refresh}
          empty={!filtered.length}
        >
          <div className="overflow-x-auto">
            <table className={tableClass}>
              <thead>
                <tr>
                  <th>Mã món</th>
                  <th>Tên món</th>
                  <th>Trạm bếp</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filtered
                  .slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)
                  .map((item) => (
                    <ItemStationRow
                      key={`${item.itemId}:${item.version}:${item.kitchenStationId}`}
                      item={item}
                      stations={stations.data || []}
                      pending={
                        mutation.isPending ||
                        items.isFetching ||
                        stations.isFetching
                      }
                      onSave={(id) =>
                        mutation.mutate({ kind: 'assign', item, stationId: id })
                      }
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </QueryState>
        <Pagination
          total={filtered.length}
          page={currentPage}
          onPage={setPage}
        />
      </Panel>
    </>
  )
}
