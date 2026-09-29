import { hasSupabaseEnv } from "@/utils/supabase/env"
import { createClient } from "@/utils/supabase/server"
import { isLeadStatus, type Lead, type Service } from "@/lib/types"

export async function getServices(): Promise<{
  services: Service[]
  configured: boolean
  error: string | null
}> {
  if (!hasSupabaseEnv()) {
    return { services: [], configured: false, error: null }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("services")
      .select("id, title, description")
      .order("created_at", { ascending: true })

    if (error) {
      return {
        services: [],
        configured: true,
        error: "Không tải được danh sách dịch vụ.",
      }
    }

    return {
      services: (data ?? []).map((row) => ({
        id: row.id,
        title: row.title,
        description: row.description ?? "",
        icon: "package",
        sort_order: 0,
      })),
      configured: true,
      error: null,
    }
  } catch {
    return {
      services: [],
      configured: true,
      error: "Không kết nối được Supabase.",
    }
  }
}

export async function getLeads(): Promise<{
  leads: Lead[]
  error: string | null
}> {
  if (!hasSupabaseEnv()) {
    return { leads: [], error: "Chưa cấu hình Supabase." }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("leads")
      .select("id, full_name, email, phone, message, status, created_at")
      .order("created_at", { ascending: false })

    if (error) {
      return { leads: [], error: "Không tải được danh sách yêu cầu." }
    }

    const leads = (data ?? []).flatMap((row) => {
      if (!isLeadStatus(row.status)) return []
      const company = row.message.match(/^Công ty: (.+)$/m)?.[1] ?? null
      const service = row.message.match(/^Dịch vụ quan tâm: (.+)$/m)?.[1] ?? null
      const lead: Lead = {
        id: row.id,
        full_name: row.full_name,
        email: row.email,
        phone: row.phone,
        company,
        service,
        message: row.message,
        status: row.status,
        created_at: row.created_at,
      }
      return [lead]
    })

    return { leads, error: null }
  } catch {
    return { leads: [], error: "Không kết nối được Supabase." }
  }
}
