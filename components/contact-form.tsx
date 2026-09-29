"use client"

import { useActionState, useEffect, useRef } from "react"
import { CheckCircle2 } from "lucide-react"

import { submitLead, type LeadFormState } from "@/lib/actions"
import type { Service } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

const initialState: LeadFormState = { ok: false, error: "" }

export function ContactForm({ services }: { services: Service[] }) {
  const formRef = useRef<HTMLFormElement>(null)
  const [state, formAction, pending] = useActionState(submitLead, initialState)

  useEffect(() => {
    if (state.ok) formRef.current?.reset()
  }, [state.ok])

  return (
    <form ref={formRef} action={formAction} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Họ tên" name="full_name" required placeholder="Nguyễn Văn A" />
        <Field
          label="Email"
          name="email"
          type="email"
          required
          placeholder="ban@congty.vn"
        />
        <Field label="Số điện thoại" name="phone" required placeholder="09xx xxx xxx" />
        <Field label="Công ty" name="company" placeholder="Tên doanh nghiệp" />
      </div>

      <div className="grid gap-2">
        <Label htmlFor="service">Dịch vụ quan tâm</Label>
        {services.length > 0 ? (
          <select
            id="service"
            name="service"
            className="h-10 w-full rounded-lg border border-input bg-white px-2.5 text-sm outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50"
            defaultValue=""
          >
            <option value="">Chọn dịch vụ</option>
            {services.map((service) => (
              <option key={service.id} value={service.title}>
                {service.title}
              </option>
            ))}
            <option value="Khác">Khác</option>
          </select>
        ) : (
          <Input id="service" name="service" placeholder="Nguyên liệu, xuất khẩu, gia công..." className="h-10 bg-white" />
        )}
      </div>

      <div className="grid gap-2">
        <Label htmlFor="message">Nội dung yêu cầu</Label>
        <Textarea
          id="message"
          name="message"
          required
          placeholder="Mô tả nguyên liệu, thị trường hoặc nhà máy bạn đang cần."
          className="min-h-28 bg-white"
        />
      </div>

      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      {state.ok ? (
        <p className="flex items-center gap-2 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
          <CheckCircle2 className="size-4" />
          Đã ghi nhận yêu cầu. Đội ngũ PML sẽ liên hệ lại.
        </p>
      ) : null}

      <Button type="submit" disabled={pending} className="h-11 w-full sm:w-fit sm:px-5">
        {pending ? "Đang gửi..." : "Gửi yêu cầu tư vấn"}
      </Button>
    </form>
  )
}

function Field({
  label,
  name,
  type = "text",
  required = false,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  required?: boolean
  placeholder: string
}) {
  return (
    <div className="grid gap-2">
      <Label htmlFor={name}>{label}</Label>
      <Input
        id={name}
        name={name}
        type={type}
        required={required}
        placeholder={placeholder}
        className="h-10 bg-white"
      />
    </div>
  )
}
