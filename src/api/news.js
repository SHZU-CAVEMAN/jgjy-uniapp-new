import { apiRequest, apiUrl } from './request'

function resolveAssetUrl(url) {
  if (!url || /^https?:\/\//.test(url)) return url || ''
  return apiUrl(url)
}

function normalizeNews(article) {
  return {
    ...article,
    image: resolveAssetUrl(article.image),
  }
}

export async function getNews(params = {}) {
  const data = await apiRequest('/api/miniapp/news', { params })
  return {
    ...data,
    items: (data.items || []).map(normalizeNews),
  }
}

export async function getNewsArticle(articleId) {
  const article = await apiRequest(`/api/miniapp/news/${encodeURIComponent(articleId)}`)
  return normalizeNews(article)
}
