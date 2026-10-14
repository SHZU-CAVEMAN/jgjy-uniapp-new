const DEFAULT_API_BASE_URL = 'https://lzbjtjt.online/jgjy'

export function apiUrl(path) {
  const baseUrl = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/$/, '')
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`
}

export function apiRequest(path, options = {}) {
  const query = Object.entries(options.params || {})
    .filter(([, value]) => value !== '' && value !== undefined && value !== null)
    .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
    .join('&')

  return new Promise((resolve, reject) => {
    uni.request({
      url: `${apiUrl(path)}${query ? `?${query}` : ''}`,
      method: options.method || 'GET',
      data: options.data,
      header: options.token ? { Authorization: `Bearer ${options.token}` } : {},
      success: ({ statusCode, data }) => {
        if (statusCode < 200 || statusCode >= 300) {
          return reject(new Error(data?.message || '服务端请求失败'))
        }
        resolve(data?.data || data || {})
      },
      fail: () => reject(new Error('网络异常，请稍后重试')),
    })
  })
}