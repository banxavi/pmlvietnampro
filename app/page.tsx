import { Factory, Package, Ship, ShieldCheck, type LucideIcon } from "lucide-react"

import { ContactForm } from "@/components/contact-form"
import { Hero } from "@/components/hero"
import { SiteHeader } from "@/components/site-header"
import { getServices } from "@/lib/data"
import type { Service } from "@/lib/types"

export const dynamic = "force-dynamic"

const icons: Record<string, LucideIcon> = {
  package: Package,
  ship: Ship,
  factory: Factory,
}

const capabilities = [
  {
    title: "Nguyên liệu có hồ sơ",
    text: "Mỗi lô đi kèm tài liệu nhà sản xuất để nhà máy đối chiếu trước khi đặt cọc.",
  },
  {
    title: "Đường xuất khẩu",
    text: "Từ nhu cầu thị trường đến đối tác mua và điều phối giao nhận ra nước ngoài.",
  },
  {
    title: "Nhà máy gia công",
    text: "Chọn đối tác đúng năng lực, thống nhất công thức và theo dõi tiến độ.",
  },
  {
    title: "Đúng chứng từ ngành",
    text: "Tư vấn bộ hồ sơ phù hợp với thực phẩm, TPCN, mỹ phẩm hoặc dược.",
  },
]

export default async function HomePage() {
  const { services, configured, error } = await getServices()

  return (
    <div className="min-h-full bg-paper">
      <SiteHeader />
      <main>
        <Hero />

        <section id="nang-luc" className="mx-auto w-full max-w-6xl px-5 py-20">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
              Năng lực
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-balance">
              Một đầu mối cho nguyên liệu, xuất khẩu và sản xuất.
            </h2>
          </div>
          <ul className="mt-10 grid gap-4 sm:grid-cols-2">
            {capabilities.map((item) => (
              <li key={item.title} className="rounded-2xl bg-white p-5 ring-1 ring-ink/10">
                <ShieldCheck className="size-5 text-gold" />
                <h3 className="mt-4 text-lg font-medium">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-ink/70">{item.text}</p>
              </li>
            ))}
          </ul>
        </section>

        <section id="dich-vu" className="bg-ink py-20 text-paper">
          <div className="mx-auto w-full max-w-6xl px-5">
            <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
              Dịch vụ
            </p>
            <h2 className="mt-3 max-w-xl text-3xl font-semibold">
              Danh mục lấy trực tiếp từ bảng services.
            </h2>
            <ServiceList services={services} configured={configured} error={error} />
          </div>
        </section>

        <section id="lien-he" className="mx-auto grid w-full max-w-6xl gap-10 px-5 py-20 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
              Liên hệ
            </p>
            <h2 className="mt-3 text-3xl font-semibold text-balance">
              Gửi yêu cầu tư vấn, dữ liệu vào thẳng bảng leads.
            </h2>
            <p className="mt-4 text-sm leading-6 text-ink/70">
              Form dùng Server Action. Khách không cần tài khoản. Yêu cầu mới
              hiện trên dashboard admin qua Supabase Realtime.
            </p>
          </div>
          <div className="rounded-2xl bg-white p-5 ring-1 ring-ink/10 sm:p-7">
            <ContactForm services={services} />
          </div>
        </section>
      </main>
      <footer className="border-t border-ink/10 px-5 py-8 text-sm text-ink/55">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <p>PML Vietnam</p>
          <p>Nguyên liệu · Xuất khẩu · Kết nối sản xuất</p>
        </div>
      </footer>
    </div>
  )
}

function ServiceList({
  services,
  configured,
  error,
}: {
  services: Service[]
  configured: boolean
  error: string | null
}) {
  if (!configured) {
    return (
      <p className="mt-8 max-w-xl text-sm leading-6 text-paper/70">
        Chưa kết nối Supabase. Dán URL và anon key vào `.env.local`, chạy
        `supabase/schema.sql`, rồi tải lại trang để hiện dịch vụ.
      </p>
    )
  }

  if (error) {
    return <p className="mt-8 text-sm text-gold-soft">{error}</p>
  }

  if (services.length === 0) {
    return (
      <p className="mt-8 text-sm text-paper/70">Bảng services chưa có dòng nào.</p>
    )
  }

  return (
    <ul className="mt-10 grid gap-4 md:grid-cols-3">
      {services.map((service) => {
        const Icon = icons[service.icon] ?? Package
        return (
          <li key={service.id} className="rounded-2xl border border-paper/10 bg-paper/5 p-5">
            <Icon className="size-5 text-gold" />
            <h3 className="mt-4 text-lg font-medium">{service.title}</h3>
            <p className="mt-2 text-sm leading-6 text-paper/70">{service.description}</p>
          </li>
        )
      })}
    </ul>
  )
}
