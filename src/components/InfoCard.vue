<template>
  <view class="info-card">
    <view class="card-title"><view /><text>{{ title }}</text></view>
    <slot />
  </view>
</template>

<script setup>
defineProps({ title: { type: String, required: true } })
</script>

<style scoped lang="scss">
.info-card { margin: 24rpx 24rpx 0; padding: 30rpx; border-radius: 16rpx; background: #fff; box-shadow: $card-shadow; }
.card-title { margin-bottom: 20rpx; display: flex; align-items: center; gap: 13rpx; color: $text-title; font-size: 30rpx; font-weight: 700; }
.card-title view { width: 7rpx; height: 30rpx; border-radius: 4rpx; background: $brand-primary; }
</style>