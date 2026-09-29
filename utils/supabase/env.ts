export function getSupabaseKey() {
  return (
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )
}

export function hasSupabaseEnv() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = getSupabaseKey()

  if (!url || !key) return false
  if (
    url.includes("your-project.supabase.co") ||
    key === "your-anon-key" ||
    key.startsWith("sb_publishable_your")
  ) {
    return false
  }

  return true
}
