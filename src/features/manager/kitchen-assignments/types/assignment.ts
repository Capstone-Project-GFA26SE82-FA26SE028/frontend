import type { z } from 'zod'
import type {
  assignmentSchema,
  employeeSchema,
  stationSchema,
} from '../schemas/assignmentSchema'

export type KitchenEmployee = z.infer<typeof employeeSchema>
export type KitchenAssignment = z.infer<typeof assignmentSchema>
export type AssignmentStation = z.infer<typeof stationSchema>
export type AssignmentRow = AssignmentStation & {
  assignment?: KitchenAssignment
}
export type AssignmentAction =
  | { kind: 'save'; stationId: string; userId: string; expectedUserId?: string }
  | { kind: 'remove'; stationId: string; expectedUserId: string }
