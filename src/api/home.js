import { apiRequest, apiUrl } from './request'

function resolveAssetUrl(url) {
  if (!url || /^https?:\/\//.test(url)) return url || ''
  return apiUrl(url)
}

export async function getHomeSummary() {
  const data = await apiRequest('/api/miniapp/home')
  return {
    ...data,
    latestProducts: (data.latestProducts || []).map((product) => ({
      ...product,
      thumbnailUrl: resolveAssetUrl(product.thumbnailUrl),
    })),
  }
}

export function getCompany() {
  return apiRequest('/api/miniapp/company')
}
