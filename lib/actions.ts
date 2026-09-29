"use server"

import { redirect } from "next/navigation"

import { hasSupabaseEnv } from "@/utils/supabase/env"
import { createClient } from "@/utils/supabase/server"
import { isLeadStatus, type LeadStatus } from "@/lib/types"

export type LeadFormState = {
  ok: boolean
  error: string
}

const initialError = ""

function readText(formData: FormData, key: string, max: number) {
  return String(formData.get(key) ?? "").trim().slice(0, max)
}

export async function submitLead(
  _previous: LeadFormState,
  formData: FormData
): Promise<LeadFormState> {
  if (!hasSupabaseEnv()) {
    return {
      ok: false,
      error: "Chưa cấu hình Supabase. Dán URL và anon key vào .env.local.",
    }
  }

  const fullName = readText(formData, "full_name", 120)
  const email = readText(formData, "email", 160)
  const phone = readText(formData, "phone", 30)
  const company = readText(formData, "company", 160)
  const service = readText(formData, "service", 160)
  const message = readText(formData, "message", 2000)

  if (!fullName || !email || !phone || !message) {
    return {
      ok: false,
      error: "Vui lòng điền họ tên, email, số điện thoại và nội dung.",
    }
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { ok: false, error: "Email chưa đúng định dạng." }
  }

  const messageLines = [message]
  if (company) messageLines.push(`Công ty: ${company}`)
  if (service) messageLines.push(`Dịch vụ quan tâm: ${service}`)

  const supabase = await createClient()
  const { error } = await supabase.from("leads").insert({
    full_name: fullName,
    email,
    phone,
    message: messageLines.join("\n"),
    status: "new",
  })

  if (error) {
    return {
      ok: false,
      error: "Chưa gửi được yêu cầu. Kiểm tra bảng leads và quyền ghi.",
    }
  }

  return { ok: true, error: initialError }
}

export async function updateLeadStatus(id: string, status: string) {
  if (!hasSupabaseEnv() || !isLeadStatus(status) || !id) {
    return { ok: false as const, error: "Trạng thái không hợp lệ." }
  }

  const supabase = await createClient()
  const { data } = await supabase.auth.getClaims()
  if (!data?.claims) {
    return { ok: false as const, error: "Phiên đăng nhập đã hết hạn." }
  }

  const { error } = await supabase.from("leads").update({ status }).eq("id", id)

  if (error) {
    return {
      ok: false as const,
      error: "Không lưu được trạng thái. Bảng leads chỉ nhận: Mới, Đã liên hệ, Đang xử lý, Hoàn tất, Đã hủy.",
    }
  }

  return { ok: true as const, status: status as LeadStatus }
}

export type AuthState = {
  error: string
}

export async function signIn(
  _previous: AuthState,
  formData: FormData
): Promise<AuthState> {
  if (!hasSupabaseEnv()) {
    return { error: "Chưa cấu hình Supabase trong .env.local." }
  }

  const email = readText(formData, "email", 160)
  const password = String(formData.get("password") ?? "")

  if (!email || !password) {
    return { error: "Nhập email và mật khẩu quản trị." }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) {
    return { error: "Email hoặc mật khẩu không đúng." }
  }

  redirect("/dashboard/leads")
}

export async function signOut() {
  if (hasSupabaseEnv()) {
    const supabase = await createClient()
    await supabase.auth.signOut()
  }

  redirect("/login")
}
