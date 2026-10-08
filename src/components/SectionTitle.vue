<template>
  <view class="section-title">
    <view class="section-bar" />
    <text class="section-text">{{ title }}</text>
    <text v-if="subtitle" class="section-subtitle">{{ subtitle }}</text>
  </view>
</template>

<script setup>
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
})
</script>

<style scoped lang="scss">
.section-title { padding: 36rpx 28rpx 20rpx; display: flex; align-items: center; }
.section-bar { width: 7rpx; height: 32rpx; margin-right: 13rpx; border-radius: 4rpx; background: $brand-primary; }
.section-text { color: $text-title; font-size: 32rpx; font-weight: 700; }
.section-subtitle { margin-left: auto; color: $text-muted; font-size: $font-caption; }
</style>