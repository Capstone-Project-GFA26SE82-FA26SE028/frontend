export type StaffCall = {
  serviceRequestId: string
  status: 'Requested' | 'Acknowledged' | 'Completed'
}
