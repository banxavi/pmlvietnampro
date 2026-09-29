import Link from "next/link"
import { redirect } from "next/navigation"

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/actions"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  const userId = data?.claims?.sub

  if (!userId) {
    redirect("/login")
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle()

  const email = typeof data.claims.email === "string" ? data.claims.email : "Admin"

  if (profile?.role !== "admin") {
    return (
      <main className="mx-auto grid min-h-full w-full max-w-lg place-content-center gap-4 px-5 py-20">
        <h1 className="text-2xl font-semibold">Tài khoản chưa có quyền admin</h1>
        <p className="text-sm leading-6 text-ink/70">
          Thêm dòng role = admin vào bảng profiles cho user này, rồi đăng nhập lại.
        </p>
        <form action={signOut}>
          <Button type="submit" variant="outline">
            Đăng xuất
          </Button>
        </form>
      </main>
    )
  }

  return (
    <div className="min-h-full bg-paper">
      <header className="border-b border-ink/10 bg-white">
        <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
          <div>
            <Link href="/dashboard/leads" className="text-sm font-semibold">
              PML · Quản trị leads
            </Link>
            <p className="text-xs text-ink/55">{email}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              render={<Link href="/" />}
              nativeButton={false}
            >
              Xem website
            </Button>
            <form action={signOut}>
              <Button type="submit" variant="outline">
                Đăng xuất
              </Button>
            </form>
          </div>
        </div>
      </header>
      <div className="mx-auto w-full max-w-6xl px-5 py-8">{children}</div>
    </div>
  )
}
