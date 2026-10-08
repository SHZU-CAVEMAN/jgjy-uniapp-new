import { apiRequest } from './request'

export function getNeedCategories() {
  return apiRequest('/api/miniapp/need-categories')
}

export function submitConsultation(data) {
  const token = uni.getStorageSync('auth-token')
  if (!token) return Promise.reject(new Error('请先登录'))
  return apiRequest('/api/miniapp/consultations', {
    method: 'POST',
    data,
    token,
  })
}

export function getMyConsultations() {
  const token = uni.getStorageSync('auth-token')
  if (!token) return Promise.resolve([])
  return apiRequest('/api/miniapp/consultations', { token })
}