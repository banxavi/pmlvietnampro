"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"

import { Button } from "@/components/ui/button"

const links = [
  { href: "/#nang-luc", label: "Năng lực" },
  { href: "/#dich-vu", label: "Dịch vụ" },
  { href: "/#lien-he", label: "Liên hệ" },
]

export function SiteHeader() {
  const [open, setOpen] = useState(false)

  return (
    <header className="sticky top-0 z-40 border-b border-ink/10 bg-paper/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-md bg-ink text-xs font-semibold tracking-wide text-paper">
            PML
          </span>
          <span className="text-sm font-semibold tracking-wide text-ink">
            PML Vietnam
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-ink/75 md:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-ink">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button
            render={<Link href="/login" />}
            nativeButton={false}
            className="h-9 px-3.5"
          >
            Đăng nhập quản trị
          </Button>
        </div>

        <button
          type="button"
          className="grid size-9 place-items-center rounded-md text-ink md:hidden"
          aria-expanded={open}
          aria-label={open ? "Đóng menu" : "Mở menu"}
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-ink/10 px-5 py-4 md:hidden">
          <nav className="flex flex-col gap-3 text-sm">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/login" onClick={() => setOpen(false)}>
              Đăng nhập quản trị
            </Link>
          </nav>
        </div>
      ) : null}
    </header>
  )
}
