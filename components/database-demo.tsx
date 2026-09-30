"use client"

import { useMemo, useState } from "react"

import {
  adminWorkflow,
  clientWorkspaces,
  platformName,
  workspaceLeads,
  type Workspace,
  type WorkspaceLead,
} from "@/lib/workspaces"
import { leadStatusLabel } from "@/lib/types"

const incomingLead: WorkspaceLead = {
  id: "L-NEW",
  clientId: "kh1",
  fullName: "Khách vừa gửi form",
  company: "Startup Viet Inc",
  product: "Cổng kết nối B2B",
  phone: "0988 000 111",
  request: "Xin tư vấn thêm phân quyền cho cổng kết nối B2B.",
  status: "new",
}

export function DatabaseDemo({
  clients,
  leads,
}: {
  clients: Workspace[]
  leads: WorkspaceLead[]
}) {
  const workspaces = clients.length > 0 ? clients : clientWorkspaces
  const storedLeads = leads.length > 0 ? leads : workspaceLeads
  const [step, setStep] = useState(0)
  const [clientSlug, setClientSlug] = useState<string>("kh1")
  const current = adminWorkflow[step]
  const selected = workspaces.find((item) => item.slug === clientSlug) ?? workspaces[0]
  const showIncoming = current.phase === "saved" || current.phase === "updated"
  const rows = useMemo(() => {
    const stored = storedLeads.filter((lead) => lead.clientId === selected.slug)
    if (!showIncoming || selected.slug !== "kh1") return stored
    const arrived = {
      ...incomingLead,
      status: current.phase === "updated" ? ("contacted" as const) : incomingLead.status,
    }
    return [arrived, ...stored]
  }, [current.phase, selected.slug, showIncoming, storedLeads])

  function openStep(index: number) {
    const next = adminWorkflow[index]
    setStep(index)
    setClientSlug(next.clientId)
  }

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
        Cách triển khai dữ liệu
      </p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold text-balance">
        {platformName} quản lý riêng website của từng khách hàng.
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/70">
        Khách hàng và sản phẩm bên dưới được đọc từ Supabase. Đi lần lượt sáu bước để xem yêu cầu gắn đúng khách hàng và đúng sản phẩm.
      </p>

      <ol className="mt-8 grid gap-2 md:grid-cols-2">
        {adminWorkflow.map((item, index) => (
          <li key={item.title}>
            <button
              type="button"
              onClick={() => openStep(index)}
              className={`flex h-full w-full gap-3 rounded-xl px-3 py-3 text-left ${
                index === step ? "bg-ink text-paper" : "bg-white text-ink ring-1 ring-ink/10"
              }`}
            >
              <span className={`text-sm font-semibold ${index === step ? "text-gold" : "text-ink/40"}`}>
                {index + 1}
              </span>
              <span>
                <span className="block text-sm font-medium">{item.title}</span>
                <span className={`mt-1 block text-xs ${index === step ? "text-paper/70" : "text-ink/50"}`}>
                  {item.technology}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ol>

      <p className="mt-4 rounded-xl bg-gold-soft px-4 py-3 text-sm leading-6 text-ink">
        <span className="font-semibold">
          Bước {step + 1}. {current.technology}.{" "}
        </span>
        {current.detail}
      </p>

      <div className="mt-8 grid gap-6 lg:grid-cols-[280px_1fr]">
        <nav className="grid content-start gap-2">
          <p className="px-3 text-sm font-semibold">{platformName}</p>
          {workspaces.map((workspace) => (
            <WorkspaceButton
              key={workspace.id}
              workspace={workspace}
              active={workspace.slug === selected.slug}
              count={
                storedLeads.filter((lead) => lead.clientId === workspace.slug).length +
                (showIncoming && workspace.slug === "kh1" ? 1 : 0)
              }
              onSelect={() => setClientSlug(workspace.slug)}
            />
          ))}
        </nav>

        <section className="rounded-2xl bg-white p-5 ring-1 ring-ink/10">
          <p className="text-xs font-semibold tracking-wide text-gold uppercase">Đang quản trị</p>
          <h2 className="mt-1 text-2xl font-semibold">{selected.name}</h2>
          <p className="mt-2 text-sm text-ink/70">{selected.product}</p>
          <p className="mt-1 text-sm text-ink/60">{selected.note}</p>

          {current.phase === "submit" && selected.slug === "kh1" ? (
            <p className="mt-4 rounded-xl border border-dashed border-ink/20 px-4 py-3 text-sm text-ink/70">
              Form trên website Startup Viet Inc vừa được gửi. Yêu cầu chưa vào danh sách cho đến bước lưu dữ liệu.
            </p>
          ) : null}

          <div className="mt-5 overflow-x-auto">
            <table className="w-full min-w-[640px] border-collapse text-left text-sm">
              <thead className="text-xs tracking-wide text-ink/50 uppercase">
                <tr>
                  <th className="px-3 py-2 font-medium">Khách hàng</th>
                  <th className="px-3 py-2 font-medium">Sản phẩm</th>
                  <th className="px-3 py-2 font-medium">Người gửi</th>
                  <th className="px-3 py-2 font-medium">Nội dung</th>
                  <th className="px-3 py-2 font-medium">Tình trạng</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((lead) => (
                  <tr
                    key={lead.id}
                    className={`border-t border-ink/10 align-top ${
                      lead.id === "L-NEW" ? "bg-gold-soft" : ""
                    }`}
                  >
                    <td className="px-3 py-3 font-medium">{lead.company}</td>
                    <td className="px-3 py-3">{lead.product}</td>
                    <td className="px-3 py-3">{lead.fullName}</td>
                    <td className="px-3 py-3 text-ink/80">{lead.request}</td>
                    <td className="px-3 py-3">{leadStatusLabel(lead.status)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <div className="mt-6 grid gap-3 rounded-2xl bg-ink p-5 text-sm text-paper md:grid-cols-2">
        <p>
          <span className="font-semibold text-gold">Khách hàng.</span> Startup Viet Inc, LogisticsX Vietnam, Linh Do Fashion và Chuỗi F&B Hoàng Nam.
        </p>
        <p>
          <span className="font-semibold text-gold">Sản phẩm.</span> Mỗi khách hàng có một sản phẩm riêng. Yêu cầu trên màn hình gắn đúng sản phẩm đó.
        </p>
      </div>
    </div>
  )
}

function WorkspaceButton({
  workspace,
  active,
  count,
  onSelect,
}: {
  workspace: Workspace
  active: boolean
  count: number
  onSelect: () => void
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`rounded-xl px-3 py-3 text-left ${
        active ? "bg-ink text-paper" : "bg-white text-ink ring-1 ring-ink/10"
      }`}
    >
      <span className="block text-sm font-medium">{workspace.name}</span>
      <span className={`mt-1 block text-xs ${active ? "text-paper/70" : "text-ink/50"}`}>
        {workspace.product}
        {count > 0 ? ` · ${count} yêu cầu` : ""}
      </span>
    </button>
  )
}
