import type { Metadata } from "next"
import { Be_Vietnam_Pro, Geist_Mono } from "next/font/google"

import "./globals.css"

const beVietnam = Be_Vietnam_Pro({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-be-vietnam",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "PML Vietnam",
  description:
    "PML Vietnam cung ứng nguyên liệu, hỗ trợ xuất khẩu và kết nối sản xuất cho doanh nghiệp Việt Nam.",
}

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="vi"
      className={`${beVietnam.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-paper text-ink">{children}</body>
    </html>
  )
}
