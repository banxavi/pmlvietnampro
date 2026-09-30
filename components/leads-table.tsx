"use client"

import { useEffect, useMemo, useState } from "react"
import {
  createColumnHelper,
  tableFeatures,
  useTable,
} from "@tanstack/react-table"
import { AnimatePresence, motion } from "framer-motion"
import { Search } from "lucide-react"

import { updateLeadStatus } from "@/lib/actions"
import { createClient } from "@/utils/supabase/client"
import { hasSupabaseEnv } from "@/utils/supabase/env"
import {
  LEAD_STATUSES,
  isLeadStatus,
  leadStatusLabel,
  type Lead,
  type LeadStatus,
} from "@/lib/types"
import { Input } from "@/components/ui/input"

const features = tableFeatures({})
const columnsHelper = createColumnHelper<typeof features, Lead>()

const dateFormatter = new Intl.DateTimeFormat("vi-VN", {
  dateStyle: "short",
  timeStyle: "short",
})

function isLead(value: unknown): value is Lead {
  if (!value || typeof value !== "object") return false
  const row = value as Partial<Lead>
  return (
    typeof row.id === "string" &&
    typeof row.full_name === "string" &&
    typeof row.email === "string" &&
    typeof row.message === "string" &&
    typeof row.created_at === "string" &&
    isLeadStatus(row.status)
  )
}

export function LeadsTable({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads)
  const [query, setQuery] = useState("")
  const [status, setStatus] = useState<LeadStatus | "all">("all")
  const [live, setLive] = useState(false)
  const [notice, setNotice] = useState<string | null>(null)
  const [statusError, setStatusError] = useState<string | null>(null)
  const [freshIds, setFreshIds] = useState<string[]>([])

  useEffect(() => {
    if (!hasSupabaseEnv()) return

    const supabase = createClient()
    const channel = supabase
      .channel("leads-admin")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "leads" },
        (payload) => {
          if (!isLead(payload.new)) return
          const incoming = payload.new
          setLeads((current) =>
            current.some((lead) => lead.id === incoming.id)
              ? current
              : [{ ...incoming, client_name: incoming.client_name ?? null, product_name: incoming.product_name ?? null }, ...current]
          )
          setFreshIds((current) => [incoming.id, ...current].slice(0, 8))
          setNotice(`${incoming.full_name} vừa gửi yêu cầu tư vấn`)
        }
      )
      .on(
        "postgres_changes",
        { event: "UPDATE", schema: "public", table: "leads" },
        (payload) => {
          if (!isLead(payload.new)) return
          const incoming = payload.new
          setLeads((current) =>
            current.map((lead) =>
              lead.id === incoming.id
                ? {
                    ...lead,
                    ...incoming,
                    client_name: incoming.client_name ?? lead.client_name,
                    product_name: incoming.product_name ?? lead.product_name,
                  }
                : lead
            )
          )
        }
      )
      .subscribe((nextStatus) => {
        setLive(nextStatus === "SUBSCRIBED")
      })

    return () => {
      void supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (!notice) return
    const timer = window.setTimeout(() => setNotice(null), 4000)
    return () => window.clearTimeout(timer)
  }, [notice])

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase()
    return leads.filter((lead) => {
      const matchesStatus = status === "all" || lead.status === status
      if (!matchesStatus) return false
      if (!needle) return true
      return [lead.full_name, lead.email, lead.phone, lead.company, lead.message, lead.service, lead.client_name, lead.product_name]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(needle)
    })
  }, [leads, query, status])

  const columns = useMemo(
    () =>
      columnsHelper.columns([
        columnsHelper.accessor("created_at", {
          header: "Thời gian",
          cell: (info) => dateFormatter.format(new Date(info.getValue())),
        }),
        columnsHelper.accessor("full_name", {
          header: "Khách hàng",
          cell: (info) => (
            <div>
              <p className="font-medium text-ink">{info.getValue()}</p>
              <p className="text-ink/60">{info.row.original.company || "—"}</p>
            </div>
          ),
        }),
        columnsHelper.accessor("product_name", {
          header: "Sản phẩm",
          cell: (info) => info.getValue() || "—",
        }),
        columnsHelper.accessor("client_name", {
          header: "Website quản lý",
          cell: (info) => info.getValue() || "Chưa gán",
        }),
        columnsHelper.accessor("email", {
          header: "Liên hệ",
          cell: (info) => (
            <div>
              <p>{info.getValue()}</p>
              <p className="text-ink/60">{info.row.original.phone || "—"}</p>
            </div>
          ),
        }),
        columnsHelper.accessor("service", {
          header: "Dịch vụ",
          cell: (info) => info.getValue() || "—",
        }),
        columnsHelper.accessor("message", {
          header: "Nội dung",
          cell: (info) => (
            <p className="max-w-xs whitespace-normal text-ink/80">{info.getValue()}</p>
          ),
        }),
        columnsHelper.accessor("status", {
          id: "status",
          header: "Trạng thái",
          cell: (info) => (
            <select
              aria-label={`Trạng thái của ${info.row.original.full_name}`}
              value={info.getValue()}
              className="h-8 rounded-md border border-input bg-white px-2 text-xs"
              onChange={async (event) => {
                const next = event.target.value
                if (!isLeadStatus(next)) return
                const id = info.row.original.id
                const previous = info.getValue()
                setLeads((current) =>
                  current.map((lead) =>
                    lead.id === id ? { ...lead, status: next } : lead
                  )
                )
                const result = await updateLeadStatus(id, next)
                if (!result.ok) {
                  setStatusError(result.error)
                  setLeads((current) =>
                    current.map((lead) =>
                      lead.id === id ? { ...lead, status: previous } : lead
                    )
                  )
                  return
                }
                setStatusError(null)
              }}
            >
              {LEAD_STATUSES.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          ),
        }),
      ]),
    []
  )

  const table = useTable({
    features,
    columns,
    data: filtered,
    getRowId: (row) => row.id,
  })

  return (
    <div className="grid gap-4">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="relative w-full max-w-sm">
          <Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-ink/40" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm tên, email, công ty..."
            className="h-10 bg-white pl-8"
            aria-label="Tìm yêu cầu"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterButton
            active={status === "all"}
            onClick={() => setStatus("all")}
            label="Tất cả"
          />
          {LEAD_STATUSES.map((item) => (
            <FilterButton
              key={item.value}
              active={status === item.value}
              onClick={() => setStatus(item.value)}
              label={item.label}
            />
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-ink/60">
        <p>
          {filtered.length} / {leads.length} yêu cầu
          {status !== "all" ? ` · ${leadStatusLabel(status)}` : ""}
        </p>
        <p className="inline-flex items-center gap-2">
          <span
            className={`size-2 rounded-full ${live ? "bg-emerald-500" : "bg-ink/25"}`}
          />
          {live ? "Realtime đang bật" : "Realtime chưa kết nối"}
        </p>
      </div>

      <AnimatePresence>
        {notice ? (
          <motion.p
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="rounded-lg bg-gold-soft px-3 py-2 text-sm text-ink"
          >
            {notice}
          </motion.p>
        ) : null}
      </AnimatePresence>

      {statusError ? (
        <p className="text-sm text-destructive" role="alert">
          {statusError}
        </p>
      ) : null}

      <div className="overflow-x-auto rounded-xl bg-white ring-1 ring-ink/10">
        <table className="w-full min-w-[860px] border-collapse text-left text-sm">
          <thead className="bg-paper text-xs tracking-wide text-ink/55 uppercase">
            {table.getHeaderGroups().map((group) => (
              <tr key={group.id}>
                {group.headers.map((header) => (
                  <th key={header.id} className="px-4 py-3 font-medium">
                    {header.isPlaceholder ? null : <table.FlexRender header={header} />}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-12 text-center text-ink/55">
                  Chưa có yêu cầu nào khớp bộ lọc.
                </td>
              </tr>
            ) : (
              table.getRowModel().rows.map((row) => (
                <motion.tr
                  key={row.id}
                  layout
                  initial={
                    freshIds.includes(row.original.id)
                      ? { backgroundColor: "rgba(169, 120, 47, 0.28)" }
                      : false
                  }
                  animate={{ backgroundColor: "rgba(169, 120, 47, 0)" }}
                  transition={{ duration: 1.4 }}
                  className="border-t border-ink/8 align-top"
                >
                  {row.getAllCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-3">
                      <table.FlexRender cell={cell} />
                    </td>
                  ))}
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function FilterButton({
  active,
  label,
  onClick,
}: {
  active: boolean
  label: string
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={`h-8 rounded-full px-3 text-xs font-medium ${
        active ? "bg-ink text-paper" : "bg-white text-ink ring-1 ring-ink/10"
      }`}
    >
      {label}
    </button>
  )
}
