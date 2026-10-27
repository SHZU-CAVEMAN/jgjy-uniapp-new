import { apiRequest, apiUrl } from './request'

const imageCache = new Map()

function normalizeProduct(product) {
  const thumbnailUrl = product.thumbnailUrl ? apiUrl(product.thumbnailUrl) : ''
  const detailImageUrl = product.detailImageUrl ? apiUrl(product.detailImageUrl) : ''
  return {
    ...product,
    imageOriginalUrl: product.imageOriginalUrl ? apiUrl(product.imageOriginalUrl) : '',
    thumbnailUrl,
    detailImageUrl,
    image: thumbnailUrl,
  }
}

export async function getProducts(params = {}) {
  const data = await apiRequest('/api/miniapp/products', { params })
  return {
    ...data,
    items: (data.items || []).map(normalizeProduct),
  }
}

export async function getProduct(productId) {
  const product = await apiRequest(`/api/miniapp/products/${productId}`)
  return normalizeProduct(product)
}

export function downloadProductImage(url) {
  if (!url || url.startsWith('/static/') || url.startsWith('wxfile://')) {
    return Promise.resolve(url || '')
  }
  if (imageCache.has(url)) return imageCache.get(url)
  const task = new Promise((resolve) => {
    uni.downloadFile({
      url,
      success: ({ statusCode, tempFilePath }) => {
        resolve(statusCode === 200 && tempFilePath ? tempFilePath : '')
      },
      fail: () => resolve(''),
    })
  })
  imageCache.set(url, task)
  return task
}