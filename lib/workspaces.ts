import type { LeadStatus } from "@/lib/types"

export type Workspace = {
  id: string
  slug: string
  name: string
  site: string
  note: string
  product: string
}

export type WorkspaceLead = {
  id: string
  clientId: string
  fullName: string
  company: string
  product: string
  phone: string
  request: string
  status: LeadStatus
}

export const adminWorkflow = [
  {
    title: "Khách gửi yêu cầu trên website",
    technology: "Next.js",
    detail:
      "Khách mở website doanh nghiệp của Startup Viet Inc và gửi form. Form xử lý trên máy chủ, khách không cần tài khoản.",
    clientId: "kh1",
    phase: "submit" as const,
  },
  {
    title: "Lưu yêu cầu theo đúng khách hàng",
    technology: "Supabase",
    detail:
      "Yêu cầu được ghi vào bảng yêu cầu, gắn Startup Viet Inc và sản phẩm Cổng kết nối B2B. Không ghi sang khách hàng khác.",
    clientId: "kh1",
    phase: "saved" as const,
  },
  {
    title: "Nhân viên vào màn hình quản trị",
    technology: "Đăng nhập",
    detail:
      "Nhân viên dùng tài khoản được cấp cho Startup Viet Inc. Tài khoản này không mở được mục của khách hàng khác.",
    clientId: "kh1",
    phase: "saved" as const,
  },
  {
    title: "Chỉ hiện yêu cầu của website đang quản lý",
    technology: "Lọc theo mã khách hàng",
    detail:
      "Màn hình lấy các dòng của Startup Viet Inc. Yêu cầu của LogisticsX Vietnam và Linh Do Fashion không nằm trong danh sách này.",
    clientId: "kh1",
    phase: "saved" as const,
  },
  {
    title: "Cập nhật tình trạng xử lý",
    technology: "Cập nhật dữ liệu",
    detail:
      "Nhân viên chuyển yêu cầu vừa nhận từ Mới sang Đã liên hệ. Chỉ dòng của Startup Viet Inc đổi tình trạng.",
    clientId: "kh1",
    phase: "updated" as const,
  },
  {
    title: "PML chuyển sang khách hàng khác",
    technology: "Đổi mục quản lý web",
    detail:
      "PML Vietnam chọn LogisticsX Vietnam. Danh sách đổi sang yêu cầu và sản phẩm của khách hàng này. Yêu cầu vừa xử lý không còn trên màn hình.",
    clientId: "kh2",
    phase: "switch" as const,
  },
]

export const platformName = "PML Vietnam"

export const clientWorkspaces: Workspace[] = [
  {
    id: "kh1",
    slug: "kh1",
    name: "Startup Viet Inc",
    site: "Website doanh nghiệp Startup Viet Inc",
    note: "Sản phẩm: Cổng kết nối B2B.",
    product: "Cổng kết nối B2B",
  },
  {
    id: "kh2",
    slug: "kh2",
    name: "LogisticsX Vietnam",
    site: "Website doanh nghiệp LogisticsX Vietnam",
    note: "Sản phẩm: Nền tảng điều phối vận tải.",
    product: "Nền tảng điều phối vận tải",
  },
  {
    id: "kh3",
    slug: "kh3",
    name: "Linh Do Fashion",
    site: "Website doanh nghiệp Linh Do Fashion",
    note: "Sản phẩm: Cửa hàng thời trang trực tuyến.",
    product: "Cửa hàng thời trang trực tuyến",
  },
  {
    id: "kh4",
    slug: "kh4",
    name: "Chuỗi F&B Hoàng Nam",
    site: "Website doanh nghiệp Chuỗi F&B Hoàng Nam",
    note: "Sản phẩm: Web đặt món.",
    product: "Web đặt món",
  },
]

export const workspaceLeads: WorkspaceLead[] = [
  {
    id: "L-101",
    clientId: "kh1",
    fullName: "Lê Hoàng Cường",
    company: "Startup Viet Inc",
    product: "Cổng kết nối B2B",
    phone: "0933 112 233",
    request: "Cần tư vấn xây dựng hệ thống MVP SaaS cho mảng B2B.",
    status: "new",
  },
  {
    id: "L-201",
    clientId: "kh2",
    fullName: "Phạm Minh Tuấn",
    company: "LogisticsX Vietnam",
    product: "Nền tảng điều phối vận tải",
    phone: "0944 556 677",
    request: "Muốn nâng cấp máy chủ hiện tại lên AWS và Supabase.",
    status: "in_progress",
  },
  {
    id: "L-301",
    clientId: "kh3",
    fullName: "Đỗ Mỹ Linh",
    company: "Linh Do Fashion",
    product: "Cửa hàng thời trang trực tuyến",
    phone: "0977 889 900",
    request: "Cần thiết kế lại app bán hàng để khách dễ đặt hơn.",
    status: "contacted",
  },
  {
    id: "L-401",
    clientId: "kh4",
    fullName: "Ngô Hoàng Nam",
    company: "Chuỗi F&B Hoàng Nam",
    product: "Web đặt món",
    phone: "0911 223 344",
    request: "Cần web đặt món, thanh toán và trang quản lý đơn.",
    status: "completed",
  },
]
