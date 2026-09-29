"use client"

import { useActionState } from "react"
import Link from "next/link"

import { signIn, type AuthState } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const initialState: AuthState = { error: "" }

export function LoginForm({
  alreadySignedIn,
  configured,
}: {
  alreadySignedIn: boolean
  configured: boolean
}) {
  const [state, formAction, pending] = useActionState(signIn, initialState)

  return (
    <div className="mx-auto grid w-full max-w-md gap-6 px-5 py-20">
      <div>
        <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
          Quản trị
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-ink">Đăng nhập</h1>
        <p className="mt-2 text-sm leading-6 text-ink/65">
          Trang leads chỉ mở cho tài khoản admin đã có trong bảng profiles.
        </p>
      </div>

      {!configured ? (
        <p className="rounded-lg bg-gold-soft px-3 py-2 text-sm text-ink">
          Dán URL và anon key thật vào `.env.local`, chạy `supabase/schema.sql`,
          rồi tạo user admin.
        </p>
      ) : null}

      {alreadySignedIn ? (
        <Button render={<Link href="/dashboard/leads" />} nativeButton={false} className="h-10">
          Vào bảng yêu cầu
        </Button>
      ) : (
        <form action={formAction} className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" required className="h-10 bg-white" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Mật khẩu</Label>
            <Input
              id="password"
              name="password"
              type="password"
              required
              className="h-10 bg-white"
            />
          </div>
          {state.error ? (
            <p className="text-sm text-destructive" role="alert">
              {state.error}
            </p>
          ) : null}
          <Button type="submit" disabled={pending} className="h-10">
            {pending ? "Đang đăng nhập..." : "Đăng nhập"}
          </Button>
        </form>
      )}
    </div>
  )
}
