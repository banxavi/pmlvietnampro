import type { Metadata } from "next"

import { DatabaseDemo } from "@/components/database-demo"
import { SiteHeader } from "@/components/site-header"
import { getClients, getSampleLeads } from "@/lib/data"

export const metadata: Metadata = {
  title: "Cách triển khai dữ liệu | PML Vietnam",
  description:
    "PML Vietnam tách dữ liệu website của từng khách hàng. Mỗi mục quản lý web chỉ hiện yêu cầu của khách hàng đó.",
}

export const dynamic = "force-dynamic"

export default async function DatabaseDemoPage() {
  const [{ clients }, { leads }] = await Promise.all([getClients(), getSampleLeads()])

  return (
    <div className="min-h-full bg-paper">
      <SiteHeader />
      <main>
        <DatabaseDemo clients={clients} leads={leads} />
      </main>
    </div>
  )
}
