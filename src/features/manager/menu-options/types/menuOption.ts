import type { z } from 'zod'
import type {
  itemChoiceSchema,
  optionRowSchema,
} from '../schemas/menuOptionSchema'
import type { title } from '../utils/menuOptions'
export type Row = z.infer<typeof optionRowSchema>
export type Item = z.infer<typeof itemChoiceSchema>
export type Mode = keyof typeof title
export type OptionDialog = { row?: Row; action: 'save' | 'delete' }
