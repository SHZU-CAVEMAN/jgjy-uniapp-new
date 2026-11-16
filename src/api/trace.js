import { apiRequest } from './request'

export function getTraceReport(code) {
  return apiRequest('/api/miniapp/trace', { params: { code } })
}
