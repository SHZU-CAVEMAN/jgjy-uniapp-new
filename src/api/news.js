import { apiRequest, apiUrl } from './request'

export function normalizeWechatImageUrl(url) {
  if (!url) return ''
  return String(url).replace(
    /^(?:http:)?\/\/((?:[a-z0-9-]+\.)*qpic\.cn)(\/.*)$/i,
    'https://$1$2',
  )
}

function normalizeArticleContent(content) {
  return String(content || '').replace(
    /((?:src|data-src)\s*=\s*)(["'])(.*?)\2/gi,
    (_, prefix, quote, url) => `${prefix}${quote}${normalizeWechatImageUrl(url)}${quote}`,
  )
}

function resolveAssetUrl(url) {
  if (!url) return ''
  const normalizedUrl = normalizeWechatImageUrl(url)
  if (/^https?:\/\//.test(normalizedUrl)) return normalizedUrl
  return apiUrl(normalizedUrl)
}

function normalizeNews(article) {
  return {
    ...article,
    image: resolveAssetUrl(article.image),
    content: normalizeArticleContent(article.content),
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
