import { apiRequest } from './request'

export function getTraceReport(code) {
  return apiRequest('/api/miniapp/trace', { params: { code } })
}

export function getMyTraces() {
  const token = uni.getStorageSync('auth-token')
  if (!token) return Promise.resolve([])
  return apiRequest('/api/miniapp/my-traces', { token })
}
