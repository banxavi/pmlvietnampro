import { LoginForm } from "@/components/login-form"
import { hasSupabaseEnv } from "@/utils/supabase/env"
import { createClient } from "@/utils/supabase/server"

export const dynamic = "force-dynamic"

export default async function LoginPage() {
  let alreadySignedIn = false

  if (hasSupabaseEnv()) {
    try {
      const supabase = await createClient()
      const { data } = await supabase.auth.getClaims()
      alreadySignedIn = Boolean(data?.claims)
    } catch {
      alreadySignedIn = false
    }
  }

  return (
    <main className="min-h-full bg-paper">
      <LoginForm alreadySignedIn={alreadySignedIn} configured={hasSupabaseEnv()} />
    </main>
  )
}
