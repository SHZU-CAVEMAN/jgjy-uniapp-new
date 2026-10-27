<template>
  <view class="product-card" @tap="$emit('select', product)">
    <async-image class="product-image" :src="imageSource" :pending="imagePending" mode="aspectFill" lazy-load />
    <view class="product-content">
      <text class="product-name">{{ product.name }}</text>
      <view class="tags"><text class="tag">{{ typeLabel }}</text><text class="tag">{{ product.year }}陈藏</text></view>
      <text class="product-description">{{ product.description }}</text>
      <view class="price"><text>¥{{ product.price }}</text><text class="unit"> / 吨</text></view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from 'vue'
import AsyncImage from './AsyncImage.vue'
import { downloadProductImage } from '../api/products'

const props = defineProps({ product: { type: Object, required: true } })
defineEmits(['select'])
const imageSource = ref('')
const imagePending = ref(true)
const typeNames = { nong: '浓香型', jiang: '酱香型', qing: '清香型' }
const typeLabel = typeNames[props.product.type]
watch(
  () => props.product.thumbnailUrl || props.product.image,
  async (url) => {
    imagePending.value = Boolean(url)
    imageSource.value = ''
    try {
      imageSource.value = await downloadProductImage(url)
    } finally {
      imagePending.value = false
    }
  },
  { immediate: true },
)
</script>

<style scoped lang="scss">
.product-card { display: flex; gap: 24rpx; margin-bottom: 22rpx; padding: 26rpx; border-radius: 16rpx; background: #fff; box-shadow: $card-shadow; }
.product-image { width: 176rpx; height: 176rpx; flex-shrink: 0; border-radius: 14rpx; background: #eaf4f8; }
.product-content { flex: 1; min-width: 0; display: flex; flex-direction: column; }
.product-name { color: $text-title; font-size: 30rpx; line-height: 1.4; font-weight: 700; }
.tags { margin-top: 11rpx; display: flex; gap: 9rpx; }
.tag { padding: 5rpx 11rpx; border-radius: 6rpx; color: $brand-primary; background: #e6f5fa; font-size: $font-caption; }
.product-description { margin-top: 11rpx; color: $text-muted; font-size: 24rpx; line-height: 1.55; }
.price { margin-top: 12rpx; color: $brand-primary; font-size: 32rpx; font-weight: 700; }
.unit { color: $text-muted; font-size: $font-caption; font-weight: 400; }
</style>