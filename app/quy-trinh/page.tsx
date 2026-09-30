import type { Metadata } from "next"

import { DeliveryWorkflow } from "@/components/delivery-workflow"
import { SiteHeader } from "@/components/site-header"

export const metadata: Metadata = {
  title: "Phạm vi bàn giao | PML Vietnam",
  description:
    "Ba phạm vi PML Vietnam bàn giao: website doanh nghiệp, nhận yêu cầu tư vấn, và màn hình xử lý yêu cầu.",
}

export default function DeliveryPage() {
  return (
    <div className="min-h-full bg-paper">
      <SiteHeader />
      <main>
        <DeliveryWorkflow />
      </main>
    </div>
  )
}
