export const LEAD_STATUSES = [
  { value: "new", label: "Mới" },
  { value: "contacted", label: "Đã liên hệ" },
  { value: "in_progress", label: "Đang xử lý" },
  { value: "completed", label: "Hoàn tất" },
  { value: "cancelled", label: "Đã hủy" },
] as const

export type LeadStatus = (typeof LEAD_STATUSES)[number]["value"]

export type Service = {
  id: string
  title: string
  description: string
  icon: string
  sort_order: number
}

export type Lead = {
  id: string
  full_name: string
  email: string
  phone: string | null
  company: string | null
  service: string | null
  message: string
  status: LeadStatus
  created_at: string
  client_name: string | null
  product_name: string | null
}

export function isLeadStatus(value: unknown): value is LeadStatus {
  return LEAD_STATUSES.some((status) => status.value === value)
}

export function leadStatusLabel(status: LeadStatus) {
  return LEAD_STATUSES.find((item) => item.value === status)?.label ?? status
}
