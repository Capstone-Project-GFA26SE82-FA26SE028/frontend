export type Table = {
  tableId: string
  areaId: string
  tableCode: string
  capacity: number
  positionX: number | null
  positionY: number | null
  version: string
  isActive: boolean
  cleaningStatus: string
}
export type TableMode =
  | 'view'
  | 'create'
  | 'edit'
  | 'move'
  | 'status'
  | 'delete'
