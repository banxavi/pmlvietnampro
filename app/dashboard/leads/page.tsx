import { LeadsTable } from "@/components/leads-table"
import { getLeads } from "@/lib/data"

export const dynamic = "force-dynamic"

export default async function LeadsPage() {
  const { leads, error } = await getLeads()

  return (
    <main className="grid gap-6">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
          Admin
        </p>
        <h1 className="mt-2 text-3xl font-semibold">Yêu cầu tư vấn</h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-ink/65">
          Tìm kiếm, lọc theo trạng thái, và nhận dòng mới ngay khi khách gửi
          form ở trang chủ.
        </p>
      </div>
      {error ? (
        <p className="rounded-lg bg-gold-soft px-3 py-2 text-sm">{error}</p>
      ) : null}
      <LeadsTable initialLeads={leads} />
    </main>
  )
}
