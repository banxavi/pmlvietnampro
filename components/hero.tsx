"use client"

import { motion } from "framer-motion"
import { ArrowRight, FileCheck2, FlaskConical, Globe2 } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"

const proofs = [
  {
    icon: FileCheck2,
    title: "Hồ sơ theo từng lô",
    text: "COA, TDS, MSDS và chứng nhận xuất xứ để đối chiếu trước khi chốt.",
  },
  {
    icon: Globe2,
    title: "Mạng lưới nhà cung cấp",
    text: "Nguyên liệu từ nhà sản xuất có chứng nhận, nguồn gốc nói rõ được.",
  },
  {
    icon: FlaskConical,
    title: "Đúng ngành hàng",
    text: "Tư vấn chứng từ cho thực phẩm, TPCN, mỹ phẩm và dược.",
  },
]

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-ink text-paper">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(169,120,47,0.35),transparent_42%)]" />
      <div className="mx-auto grid w-full max-w-6xl gap-12 px-5 py-20 md:grid-cols-[1.2fr_0.8fr] md:py-28">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: "easeOut" }}
        >
          <p className="text-xs font-semibold tracking-[0.22em] text-gold uppercase">
            Xuất nhập khẩu nguyên liệu
          </p>
          <h1 className="mt-4 max-w-xl text-4xl leading-tight font-semibold text-balance md:text-5xl">
            Năng lực kết nối nguyên liệu, nhà máy và thị trường.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-paper/75">
            PML Vietnam đồng hành cùng nhà sản xuất thực phẩm, mỹ phẩm và thực
            phẩm chức năng. Chúng tôi đưa nguyên liệu nhập khẩu có hồ sơ rõ
            ràng vào nhà máy, mở đường xuất khẩu và kết nối đối tác gia công.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              render={<Link href="/#lien-he" />}
              nativeButton={false}
              className="h-11 bg-gold px-4 text-ink hover:bg-gold/90"
            >
              Gửi yêu cầu tư vấn
              <ArrowRight />
            </Button>
            <Button
              variant="outline"
              render={<Link href="/#dich-vu" />}
              nativeButton={false}
              className="h-11 border-paper/20 bg-transparent px-4 text-paper hover:bg-paper/10 hover:text-paper"
            >
              Xem dịch vụ
            </Button>
          </div>
        </motion.div>

        <motion.ul
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1, ease: "easeOut" }}
          className="grid gap-3 self-end"
        >
          {proofs.map((item) => (
            <li
              key={item.title}
              className="flex gap-4 rounded-2xl border border-paper/10 bg-paper/5 p-4"
            >
              <item.icon className="mt-0.5 size-5 shrink-0 text-gold" />
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="mt-1 text-sm leading-6 text-paper/70">{item.text}</p>
              </div>
            </li>
          ))}
        </motion.ul>
      </div>
    </section>
  )
}
