<template>
  <view class="page-shell safe-bottom">
    <view class="notice-card">
      <view class="notice-badge">!</view>
      <text class="notice-title">{{ title || '温馨提示' }}</text>
      <text class="notice-message">{{ message }}</text>
      <button class="notice-button" @tap="goBack">我知道了</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'

const title = ref('')
const message = ref('当前功能还未上线~')

function decode(value) {
  try {
    return decodeURIComponent(value)
  } catch {
    return value
  }
}

onLoad((options = {}) => {
  if (options.title) {
    title.value = decode(options.title)
    uni.setNavigationBarTitle({ title: title.value })
  }
  if (options.message) message.value = decode(options.message)
})

function goBack() {
  if (getCurrentPages().length > 1) uni.navigateBack()
  else uni.switchTab({ url: '/pages/index/index' })
}
</script>

<style scoped lang="scss">
.page-shell {
  min-height: 100vh;
  padding: 60rpx 40rpx;
  background: $app-bg;
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.notice-card {
  width: 100%;
  padding: 56rpx 40rpx;
  border-radius: 24rpx;
  background: #fff;
  box-shadow: $card-shadow;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 22rpx;
}

.notice-badge {
  width: 108rpx;
  height: 108rpx;
  border-radius: 50%;
  color: #fff;
  background: linear-gradient(140deg, #6cc7f8, $brand-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 52rpx;
  font-weight: 800;
}

.notice-title {
  color: $text-title;
  font-size: 34rpx;
  font-weight: 800;
}

.notice-message {
  color: $text-body;
  font-size: 27rpx;
  line-height: 1.7;
  text-align: center;
}

.notice-button {
  width: 100%;
  height: 84rpx;
  margin-top: 18rpx;
  border-radius: 42rpx;
  color: #fff;
  background: linear-gradient(120deg, #4fb3f2, $brand-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
}
</style>
