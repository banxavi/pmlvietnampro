"use client"

import { useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "framer-motion"
import { ArrowLeft, ArrowRight, Check } from "lucide-react"

import { ContactForm } from "@/components/contact-form"
import { Button } from "@/components/ui/button"
import { deliveryPackages, type DeliveryPackage } from "@/lib/delivery"

const steps = ["Chọn phạm vi", "Phần nhận được", "Tiến độ", "Đăng ký"]

export function DeliveryWorkflow() {
  const [step, setStep] = useState(0)
  const [packageId, setPackageId] = useState<string>("ops")
  const selected =
    deliveryPackages.find((item) => item.id === packageId) ?? deliveryPackages[2]

  return (
    <div className="mx-auto w-full max-w-6xl px-5 py-12 md:py-16">
      <p className="text-xs font-semibold tracking-[0.18em] text-gold uppercase">
        Phạm vi bàn giao
      </p>
      <h1 className="mt-3 max-w-2xl text-4xl font-semibold text-balance">
        Chọn phần quý công ty muốn PML triển khai.
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-6 text-ink/70">
        Ba phạm vi đi từ website doanh nghiệp, tới việc lưu yêu cầu tư vấn, rồi tới màn hình để nhân viên theo dõi và xử lý những yêu cầu đó.
      </p>

      <ol className="mt-8 grid grid-cols-4 gap-2">
        {steps.map((label, index) => (
          <li key={label}>
            <button
              type="button"
              onClick={() => setStep(index)}
              className={`flex w-full flex-col items-start rounded-xl px-3 py-2 text-left text-xs md:text-sm ${
                index === step
                  ? "bg-ink text-paper"
                  : index < step
                    ? "bg-gold-soft text-ink"
                    : "bg-white text-ink/60 ring-1 ring-ink/10"
              }`}
            >
              <span className="font-semibold">{index + 1}</span>
              {label}
            </button>
          </li>
        ))}
      </ol>

      <div className="mt-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
          >
            {step === 0 ? (
              <PackageStep selectedId={packageId} onSelect={setPackageId} />
            ) : null}
            {step === 1 ? <EffectStep item={selected} /> : null}
            {step === 2 ? <TimelineStep item={selected} /> : null}
            {step === 3 ? <OrderStep item={selected} /> : null}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          className="h-10 px-4"
          disabled={step === 0}
          onClick={() => setStep((value) => Math.max(0, value - 1))}
        >
          <ArrowLeft />
          Quay lại
        </Button>
        {step < steps.length - 1 ? (
          <Button
            type="button"
            className="h-10 px-4"
            onClick={() => setStep((value) => value + 1)}
          >
            Tiếp tục
            <ArrowRight />
          </Button>
        ) : (
          <p className="text-sm text-ink/60">Đăng ký được ghi nhận để PML liên hệ xác nhận phạm vi.</p>
        )}
      </div>
    </div>
  )
}

function PackageStep({
  selectedId,
  onSelect,
}: {
  selectedId: string
  onSelect: (id: string) => void
}) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      {deliveryPackages.map((item) => {
        const active = item.id === selectedId
        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onSelect(item.id)}
            className={`rounded-2xl p-5 text-left ring-1 ${
              active ? "bg-ink text-paper ring-ink" : "bg-white text-ink ring-ink/10"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-lg font-semibold">{item.name}</p>
              {item.recommended ? (
                <span
                  className={`shrink-0 rounded-full px-2 py-0.5 text-xs ${
                    active ? "bg-gold text-ink" : "bg-gold-soft text-ink"
                  }`}
                >
                  Đủ cho đội xử lý
                </span>
              ) : null}
            </div>
            <p className={`mt-3 text-sm leading-6 ${active ? "text-paper/80" : "text-ink/70"}`}>
              {item.summary}
            </p>
            <p className="mt-4 text-sm font-medium">{item.duration}</p>
            <p className={`mt-4 text-xs font-semibold tracking-wide uppercase ${active ? "text-gold" : "text-ink/45"}`}>
              Gồm
            </p>
            <ul className="mt-2 grid gap-2 text-sm">
              {item.includes.map((line) => (
                <li key={line} className="flex gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-gold" />
                  <span>{line}</span>
                </li>
              ))}
            </ul>
            {item.excludes.length > 0 ? (
              <>
                <p className={`mt-4 text-xs font-semibold tracking-wide uppercase ${active ? "text-paper/50" : "text-ink/45"}`}>
                  Chưa gồm
                </p>
                <ul className={`mt-2 grid gap-1.5 text-sm ${active ? "text-paper/70" : "text-ink/55"}`}>
                  {item.excludes.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </>
            ) : (
              <p className={`mt-4 text-sm ${active ? "text-paper/75" : "text-ink/60"}`}>
                Đây là phạm vi đầy đủ: trang, form và màn hình xử lý yêu cầu.
              </p>
            )}
          </button>
        )
      })}
    </div>
  )
}

function EffectStep({ item }: { item: DeliveryPackage }) {
  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <div>
        <p className="text-sm text-ink/60">Gói {item.name}</p>
        <h2 className="mt-2 text-2xl font-semibold text-balance">{item.outcome}</h2>
        <ul className="mt-6 grid gap-3">
          {item.deliverables.map((template) => (
            <li key={template.name} className="rounded-2xl bg-white p-4 ring-1 ring-ink/10">
              <p className="font-medium">{template.name}</p>
              <p className="mt-1 text-sm leading-6 text-ink/70">{template.result}</p>
            </li>
          ))}
        </ul>
        <Button
          render={<Link href={item.proof.href} />}
          nativeButton={false}
          className="mt-4 h-10 px-4"
        >
          {item.proof.label}
          <ArrowRight />
        </Button>
      </div>
      <div className="rounded-2xl bg-ink p-5 text-paper">
        <p className="text-xs font-semibold tracking-[0.16em] text-gold uppercase">
          Công nghệ sử dụng khi bàn giao
        </p>
        <ul className="mt-4 grid gap-4">
          {item.technologies.map((tech) => (
            <li key={tech.name}>
              <p className="font-medium">{tech.name}</p>
              <p className="mt-1 text-sm leading-6 text-paper/75">{tech.effect}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

function TimelineStep({ item }: { item: DeliveryPackage }) {
  return (
    <div>
      <h2 className="text-2xl font-semibold">Tiến độ gói {item.name}</h2>
      <p className="mt-2 text-sm text-ink/65">Thời gian dự kiến: {item.duration}, tính từ buổi thống nhất nội dung.</p>
      <ol className="mt-6 grid gap-3">
        {item.timeline.map((entry, index) => (
          <li key={entry.when} className="grid gap-2 rounded-2xl bg-white p-4 ring-1 ring-ink/10 sm:grid-cols-[140px_1fr]">
            <p className="text-sm font-semibold text-gold">
              {index + 1}. {entry.when}
            </p>
            <p className="text-sm leading-6 text-ink/80">{entry.work}</p>
          </li>
        ))}
      </ol>
    </div>
  )
}

function OrderStep({ item }: { item: DeliveryPackage }) {
  const included = item.includes.join("; ")

  return (
    <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr]">
      <div>
        <h2 className="text-2xl font-semibold">Đăng ký gói {item.name}</h2>
        <p className="mt-3 text-sm leading-6 text-ink/70">
          Điền thông tin liên hệ. PML ghi nhận phạm vi đã chọn và liên hệ để xác nhận trước khi triển khai.
        </p>
        <p className="mt-4 text-sm leading-6 text-ink/80">{item.summary}</p>
      </div>
      <div className="rounded-2xl bg-white p-5 ring-1 ring-ink/10 sm:p-7">
        <ContactForm
          key={item.id}
          services={[]}
          presetService={`Gói ${item.name}`}
          presetMessage={`Tôi muốn đăng ký gói ${item.name} (${item.duration}). Phạm vi gồm: ${included}.`}
          submitLabel={`Đăng ký gói ${item.name}`}
        />
      </div>
    </div>
  )
}
