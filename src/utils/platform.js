export function compareVersion(versionA, versionB) {
  const left = String(versionA).split('.').map(Number)
  const right = String(versionB).split('.').map(Number)
  const length = Math.max(left.length, right.length)
  for (let index = 0; index < length; index += 1) {
    const difference = (left[index] || 0) - (right[index] || 0)
    if (difference !== 0) return difference > 0 ? 1 : -1
  }
  return 0
}

export function supportsBaseLibrary(minimumVersion) {
  const systemInfo = uni.getSystemInfoSync()
  return compareVersion(systemInfo.SDKVersion || '0.0.0', minimumVersion) >= 0
}

export function scanTraceCode(onSuccess) {
  if (!supportsBaseLibrary('1.9.6')) {
    uni.showModal({ title: '微信版本过低', content: '当前微信不支持扫码，请手动输入溯源码。', showCancel: false })
    return
  }
  uni.scanCode({
    scanType: ['qrCode'],
    success: ({ result }) => onSuccess(result),
    fail: ({ errMsg }) => {
      if (!errMsg.includes('cancel')) uni.showToast({ title: '扫码失败，请手动输入', icon: 'none' })
    },
  })
}

export function parseCompatibleDate(value) {
  return new Date(String(value).replace(/-/g, '/'))
}