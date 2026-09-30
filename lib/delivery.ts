export type DeliveryPackage = {
  id: string
  name: string
  summary: string
  duration: string
  recommended?: boolean
  outcome: string
  includes: string[]
  excludes: string[]
  deliverables: { name: string; result: string }[]
  technologies: { name: string; effect: string }[]
  timeline: { when: string; work: string }[]
  proof: { href: string; label: string }
}

export const deliveryPackages: DeliveryPackage[] = [
  {
    id: "presence",
    name: "Website doanh nghiệp",
    summary: "Một trang để khách hàng tìm hiểu công ty và dịch vụ.",
    duration: "3–5 ngày làm việc",
    outcome:
      "Khách hàng đọc được công ty làm gì, xem dịch vụ trên điện thoại và biết cách liên hệ.",
    includes: [
      "Website doanh nghiệp",
      "Mục dịch vụ",
      "Thông tin liên hệ",
    ],
    excludes: [
      "Form lưu yêu cầu tư vấn",
      "Màn hình để nhân viên theo dõi yêu cầu",
    ],
    deliverables: [
      {
        name: "Website doanh nghiệp",
        result:
          "Khách hàng mở website để xem công ty và dịch vụ trên điện thoại lẫn máy tính.",
      },
    ],
    technologies: [
      {
        name: "Next.js",
        effect:
          "Trang mở nhanh và nội dung hiển thị rõ để khách hàng đọc ngay, không cần tải file thiết kế.",
      },
      {
        name: "Giao diện theo nhận diện",
        effect:
          "Màu sắc, kiểu chữ và bố cục được chỉnh trên mẫu có sẵn, đúng thương hiệu của quý công ty.",
      },
    ],
    timeline: [
      {
        when: "Buổi làm việc đầu",
        work: "Thống nhất nội dung, hình ảnh và các mục cần có trên trang.",
      },
      {
        when: "Những ngày tiếp theo",
        work: "Dựng trên mẫu website doanh nghiệp.",
      },
      {
        when: "Ngày bàn giao",
        work: "Quý công ty xem trên điện thoại và máy tính, sau đó nhận trang để sử dụng.",
      },
    ],
    proof: { href: "/", label: "Xem website doanh nghiệp mẫu" },
  },
  {
    id: "intake",
    name: "Nhận yêu cầu",
    summary:
      "Có website doanh nghiệp và form. Mỗi yêu cầu tư vấn được lưu thành một danh sách để xem lại.",
    duration: "Khoảng 1 tuần",
    outcome:
      "Khách hàng gửi yêu cầu trên website. Nhân viên mở danh sách đã lưu khi cần liên hệ lại. Gói này chưa có màn hình để phân loại và cập nhật tiến độ xử lý.",
    includes: [
      "Toàn bộ gói Website doanh nghiệp",
      "Form nhận yêu cầu tư vấn trên trang",
      "Danh sách yêu cầu được lưu lại, gồm họ tên, điện thoại và nội dung",
    ],
    excludes: [
      "Màn hình cho nhân viên tìm kiếm và lọc yêu cầu",
      "Cập nhật trạng thái xử lý trên từng yêu cầu",
      "Yêu cầu mới hiện ngay trên màn hình làm việc",
    ],
    deliverables: [
      {
        name: "Website doanh nghiệp",
        result:
          "Khách hàng xem thông tin công ty và dịch vụ trên website trước khi gửi yêu cầu tư vấn.",
      },
      {
        name: "Form nhận yêu cầu",
        result:
          "Sau khi gửi, yêu cầu nằm trong danh sách. Nhân viên không phải chép lại từ tin nhắn.",
      },
    ],
    technologies: [
      {
        name: "Next.js",
        effect:
          "Khách hàng điền form trên chính website, không cần tạo tài khoản.",
      },
      {
        name: "Supabase",
        effect:
          "Yêu cầu được lưu tập trung. Nhân viên xem lại danh sách khi cần, thay vì tìm trong từng cuộc trò chuyện.",
      },
    ],
    timeline: [
      {
        when: "Buổi làm việc đầu",
        work: "Thống nhất các thông tin cần khách hàng điền: họ tên, điện thoại, nội dung.",
      },
      {
        when: "Trong tuần",
        work: "Dựng website doanh nghiệp và nối form để mỗi lần gửi đều được lưu.",
      },
      {
        when: "Ngày bàn giao",
        work: "Gửi thử một yêu cầu và cùng đối chiếu trong danh sách đã lưu.",
      },
    ],
    proof: { href: "/#lien-he", label: "Xem form nhận yêu cầu" },
  },
  {
    id: "ops",
    name: "Xử lý yêu cầu",
    summary:
      "Giữ trang và form của gói Nhận yêu cầu, thêm màn hình để nhân viên theo dõi và xử lý từng yêu cầu.",
    duration: "1–2 tuần",
    recommended: true,
    outcome:
      "Nhân viên có một màn hình làm việc: tìm yêu cầu, lọc theo tình trạng, cập nhật tiến độ, và thấy yêu cầu mới ngay khi khách hàng vừa gửi.",
    includes: [
      "Toàn bộ gói Nhận yêu cầu",
      "Màn hình nội bộ để xem toàn bộ yêu cầu",
      "Tìm theo tên, email hoặc công ty",
      "Lọc và cập nhật tình trạng: mới, đã liên hệ, đang xử lý, hoàn tất, đã hủy",
      "Yêu cầu mới xuất hiện ngay, không cần tải lại trang",
    ],
    excludes: [],
    deliverables: [
      {
        name: "Website doanh nghiệp",
        result:
          "Khách hàng xem thông tin công ty và dịch vụ trên website trước khi gửi yêu cầu tư vấn.",
      },
      {
        name: "Form nhận yêu cầu tư vấn",
        result: "Khách hàng gửi yêu cầu ngay trên website. Thông tin được lưu vào danh sách.",
      },
      {
        name: "Màn hình xử lý yêu cầu",
        result:
          "Nhân viên theo dõi danh sách, phân loại tình trạng và cập nhật tiến độ của từng yêu cầu.",
      },
    ],
    technologies: [
      {
        name: "Next.js",
        effect:
          "Trang khách hàng xem và màn hình nhân viên sử dụng nằm trong cùng một hệ thống.",
      },
      {
        name: "Supabase",
        effect:
          "Chỉ tài khoản được cấp mới vào được màn hình xử lý yêu cầu.",
      },
      {
        name: "Cập nhật tức thì",
        effect:
          "Khi khách hàng bấm gửi, yêu cầu hiện trên màn hình nhân viên mà không cần tải lại.",
      },
    ],
    timeline: [
      {
        when: "Buổi làm việc đầu",
        work: "Thống nhất nội dung trang, các tình trạng xử lý và những người được vào màn hình nội bộ.",
      },
      {
        when: "Tuần đầu",
        work: "Dựng trang, form nhận yêu cầu và màn hình xử lý trên mẫu có sẵn.",
      },
      {
        when: "Tuần tiếp theo",
        work: "Đưa dữ liệu vào hệ thống, cấp tài khoản và hướng dẫn nhân viên sử dụng.",
      },
      {
        when: "Ngày bàn giao",
        work: "Quý công ty tự gửi một yêu cầu thử, thấy yêu cầu hiện lên và cập nhật tình trạng.",
      },
    ],
    proof: { href: "/dashboard/leads", label: "Xem màn hình xử lý yêu cầu" },
  },
]
