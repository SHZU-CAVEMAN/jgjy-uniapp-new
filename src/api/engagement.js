import { apiRequest, apiUrl } from './request'
import { normalizeWechatImageUrl } from './news'

function requireToken() {
  const token = uni.getStorageSync('auth-token')
  if (!token) throw new Error('请先登录')
  return token
}

export function getMyFavorites() {
  return apiRequest('/api/miniapp/favorites', { token: requireToken() }).then((favorites) =>
    favorites.map((favorite) => {
      if (!favorite.item) return favorite
      const resolveAsset = (url) => {
        const normalizedUrl = normalizeWechatImageUrl(url)
        if (!normalizedUrl || /^https?:\/\//.test(normalizedUrl)) return normalizedUrl
        return apiUrl(normalizedUrl)
      }
      if (favorite.type === '产品') {
        const thumbnailUrl = resolveAsset(favorite.item.thumbnailUrl)
        return {
          ...favorite,
          item: {
            ...favorite.item,
            imageOriginalUrl: resolveAsset(favorite.item.imageOriginalUrl),
            thumbnailUrl,
            detailImageUrl: resolveAsset(favorite.item.detailImageUrl),
            image: thumbnailUrl,
          },
        }
      }
      return {
        ...favorite,
        item: { ...favorite.item, image: resolveAsset(favorite.item.image) },
      }
    }),
  )
}

export function toggleFavorite(type, targetId) {
  return apiRequest('/api/miniapp/favorites/toggle', {
    method: 'POST',
    data: { type, targetId: String(targetId) },
    token: requireToken(),
  })
}

export function getArticleInteractions(articleId) {
  const token = uni.getStorageSync('auth-token')
  return apiRequest(
    `/api/miniapp/news/${encodeURIComponent(articleId)}/interactions`,
    token ? { token } : {},
  )
}

export function toggleArticleLike(articleId) {
  return apiRequest(
    `/api/miniapp/news/${encodeURIComponent(articleId)}/likes/toggle`,
    { method: 'POST', token: requireToken() },
  )
}

export function recordArticleShare(articleId) {
  return apiRequest(
    `/api/miniapp/news/${encodeURIComponent(articleId)}/shares`,
    { method: 'POST', token: requireToken() },
  )
}

export function getArticleComments(articleId) {
  return apiRequest(`/api/miniapp/news/${encodeURIComponent(articleId)}/comments`)
}

export function createArticleComment(articleId, content) {
  return apiRequest(`/api/miniapp/news/${encodeURIComponent(articleId)}/comments`, {
    method: 'POST',
    data: { content },
    token: requireToken(),
  })
}

export function getMyComments() {
  return apiRequest('/api/miniapp/my-comments', { token: requireToken() })
}