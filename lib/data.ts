import { hasSupabaseEnv } from "@/utils/supabase/env"
import { createClient } from "@/utils/supabase/server"
import { isLeadStatus, type Lead, type Service } from "@/lib/types"
import type { Workspace, WorkspaceLead } from "@/lib/workspaces"

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

function relatedField(value: unknown, field: "name" | "title" | "slug"): string | null {
  const rows = Array.isArray(value) ? value : value ? [value] : []
  for (const row of rows) {
    if (!row || typeof row !== "object" || !(field in row)) continue
    const fieldValue = (row as Record<string, unknown>)[field]
    if (typeof fieldValue === "string" && fieldValue) return fieldValue
  }
  return null
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
      .select(
        "id, full_name, email, phone, company_name, message, status, created_at, clients(name), products(name), services(title)"
      )
      .order("created_at", { ascending: false })

    if (error) {
      return { leads: [], error: "Không tải được danh sách yêu cầu." }
    }

    const leads = (data ?? []).flatMap((row) => {
      if (!isLeadStatus(row.status)) return []
      const message = row.message ?? ""
      const company =
        (typeof row.company_name === "string" ? row.company_name : null) ??
        message.match(/^Công ty: (.+)$/m)?.[1] ??
        null
      const service =
        relatedField(row.services, "title") ??
        message.match(/^Dịch vụ quan tâm: (.+)$/m)?.[1] ??
        null
      const lead: Lead = {
        id: row.id,
        full_name: row.full_name,
        email: row.email,
        phone: row.phone,
        company,
        service,
        message,
        status: row.status,
        created_at: row.created_at,
        client_name: relatedField(row.clients, "name"),
        product_name: relatedField(row.products, "name"),
      }
      return [lead]
    })

    return { leads, error: null }
  } catch {
    return { leads: [], error: "Không kết nối được Supabase." }
  }
}

export async function getSampleLeads(): Promise<{
  leads: WorkspaceLead[]
  error: string | null
}> {
  if (!hasSupabaseEnv()) {
    return { leads: [], error: "Chưa cấu hình Supabase." }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("leads")
      .select("id, full_name, phone, company_name, message, status, clients(slug), products(name)")
      .eq("is_sample", true)
      .order("created_at", { ascending: true })

    if (error) {
      return { leads: [], error: "Không tải được yêu cầu theo khách hàng." }
    }

    return {
      leads: (data ?? []).flatMap((row) => {
        if (!isLeadStatus(row.status)) return []
        const clientId = relatedField(row.clients, "slug")
        const company = typeof row.company_name === "string" ? row.company_name : ""
        const product = relatedField(row.products, "name") ?? ""
        if (!clientId || !company || !product) return []
        return [
          {
            id: row.id,
            clientId,
            fullName: row.full_name,
            company,
            product,
            phone: row.phone ?? "",
            request: (row.message ?? "").split("\n")[0],
            status: row.status,
          },
        ]
      }),
      error: null,
    }
  } catch {
    return { leads: [], error: "Không kết nối được Supabase." }
  }
}

export async function getClients(): Promise<{
  clients: Workspace[]
  error: string | null
}> {
  if (!hasSupabaseEnv()) {
    return { clients: [], error: "Chưa cấu hình Supabase." }
  }

  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from("clients")
      .select("id, slug, name, site, note, products(name)")
      .order("slug", { ascending: true })

    if (error) {
      return { clients: [], error: "Không tải được danh sách khách hàng." }
    }

    return {
      clients: (data ?? []).flatMap((row) => {
        if (!row.slug || !row.name || !row.site) return []
        return [
          {
            id: row.id,
            slug: row.slug,
            name: row.name,
            site: row.site,
            note: row.note ?? "",
            product: relatedField(row.products, "name") ?? "",
          },
        ]
      }),
      error: null,
    }
  } catch {
    return { clients: [], error: "Không kết nối được Supabase." }
  }
}
