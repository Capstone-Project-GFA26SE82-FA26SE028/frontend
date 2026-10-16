export const serviceDefinitions = [
  {
    id: 'api',
    name: 'Máy chủ API',
    description: 'Xử lý yêu cầu từ ứng dụng và các nghiệp vụ nền tảng.',
    icon: 'activity',
    latency: 42,
  },
  {
    id: 'database',
    name: 'Cơ sở dữ liệu',
    description: 'Lưu trữ thông tin nhà hàng, tài khoản và giao dịch.',
    icon: 'box',
    latency: 12,
  },
  {
    id: 'payment',
    name: 'Cổng thanh toán',
    description: 'Tiếp nhận thanh toán và cập nhật kết quả giao dịch.',
    icon: 'receipt',
    latency: 86,
  },
  {
    id: 'realtime',
    name: 'Kết nối thời gian thực',
    description: 'Truyền cập nhật trạng thái và thông báo tức thời.',
    icon: 'activity',
    latency: 28,
  },
  {
    id: 'email',
    name: 'Dịch vụ email',
    description: 'Gửi thư thông báo và hỗ trợ tài khoản.',
    icon: 'mail',
    latency: 120,
  },
  {
    id: 'storage',
    name: 'Lưu trữ tệp',
    description: 'Lưu hình ảnh và tài liệu của nền tảng.',
    icon: 'box',
    latency: 35,
  },
] as const
export type HealthScenario = 'normal' | 'slow' | 'outage'
export const scenarioLabels = {
  normal: 'Hoạt động bình thường',
  slow: 'API phản hồi chậm',
  outage: 'Gián đoạn thanh toán',
}
export function serviceSamples(scenario: HealthScenario) {
  return serviceDefinitions.map((s) => ({
    ...s,
    status:
      scenario === 'outage' && s.id === 'payment'
        ? 'down'
        : scenario === 'slow' && s.id === 'api'
          ? 'slow'
          : 'up',
    response:
      scenario === 'outage' && s.id === 'payment'
        ? null
        : scenario === 'slow' && s.id === 'api'
          ? 1850
          : s.latency,
  }))
}
