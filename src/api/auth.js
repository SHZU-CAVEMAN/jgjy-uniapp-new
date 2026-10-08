import { apiRequest, apiUrl } from './request'

const avatarCacheKey = 'miniapp-avatar-cache'

function normalizeProfile(profile) {
  const avatarRemoteUrl = profile?.avatarUrl ? apiUrl(profile.avatarUrl) : ''
  return {
    ...profile,
    avatarUrl: avatarRemoteUrl,
    avatarRemoteUrl,
  }
}

function cacheProfileAvatar(profile) {
  const normalized = normalizeProfile(profile)
  const remoteUrl = normalized.avatarRemoteUrl
  if (!remoteUrl) return Promise.resolve(normalized)

  const cached = uni.getStorageSync(avatarCacheKey) || {}
  if (cached.remoteUrl === remoteUrl && cached.localPath) {
    return Promise.resolve({ ...normalized, avatarUrl: cached.localPath })
  }

  return new Promise((resolve) => {
    uni.downloadFile({
      url: remoteUrl,
      success: ({ statusCode, tempFilePath }) => {
        if (statusCode !== 200 || !tempFilePath) return resolve(normalized)
        uni.saveFile({
          tempFilePath,
          success: ({ savedFilePath }) => {
            if (cached.localPath && cached.localPath !== savedFilePath) {
              uni.removeSavedFile({ filePath: cached.localPath })
            }
            uni.setStorageSync(avatarCacheKey, { remoteUrl, localPath: savedFilePath })
            resolve({ ...normalized, avatarUrl: savedFilePath })
          },
          fail: () => resolve({ ...normalized, avatarUrl: tempFilePath }),
        })
      },
      fail: () => resolve(normalized),
    })
  })
}

export function clearAvatarCache() {
  const cached = uni.getStorageSync(avatarCacheKey) || {}
  if (cached.localPath) uni.removeSavedFile({ filePath: cached.localPath })
  uni.removeStorageSync(avatarCacheKey)
}

function getLoginCode() {
  return new Promise((resolve, reject) => {
    uni.login({
      provider: 'weixin',
      success: ({ code }) => code ? resolve(code) : reject(new Error('未获取到微信登录凭证')),
      fail: () => reject(new Error('微信登录失败，请稍后重试')),
    })
  })
}

export async function loginWithPhoneCode(phoneCode) {
  const loginCode = await getLoginCode()
  const result = await apiRequest('/api/miniapp/auth/phone-login', {
    method: 'POST',
    data: { phoneCode, loginCode },
  })
  if (!result.phoneNumber) throw new Error('服务端未返回手机号')
  return cacheProfileAvatar(result)
}

export function getCurrentMiniappUser() {
  const token = uni.getStorageSync('auth-token')
  if (!token) return Promise.resolve(null)
  return apiRequest('/api/miniapp/auth/me', { token }).then(cacheProfileAvatar)
}

export function updateMiniappProfile(nickname) {
  const token = uni.getStorageSync('auth-token')
  if (!token) return Promise.reject(new Error('请先登录'))
  return apiRequest('/api/miniapp/profile', {
    method: 'PUT',
    data: { nickname },
    token,
  }).then(cacheProfileAvatar)
}

export function uploadMiniappAvatar(filePath) {
  const token = uni.getStorageSync('auth-token')
  if (!apiUrl('/api/miniapp/profile/avatar')) return Promise.reject(new Error('小程序服务地址尚未配置'))
  if (!token) return Promise.reject(new Error('请先登录'))
  return new Promise((resolve, reject) => {
    uni.uploadFile({
      url: apiUrl('/api/miniapp/profile/avatar'),
      filePath,
      name: 'avatar',
      header: { Authorization: `Bearer ${token}` },
      success: ({ statusCode, data }) => {
        let body
        try {
          body = typeof data === 'string' ? JSON.parse(data) : data
        } catch {
          return reject(new Error('头像上传响应异常'))
        }
        if (statusCode < 200 || statusCode >= 300) {
          return reject(new Error(body?.message || '头像上传失败'))
        }
        resolve(cacheProfileAvatar(body?.data || body || {}))
      },
      fail: () => reject(new Error('头像上传失败，请检查网络')),
    })
  })
}