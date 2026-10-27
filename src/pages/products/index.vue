<template>
  <view class="page-shell safe-bottom" @touchstart="onTouchStart" @touchend="onTouchEnd" @touchcancel="onTouchCancel">
      <view class="search"><text>⌕</text><input v-model.trim="keyword" placeholder="搜索产品名称 / 年份 / 香型"
          confirm-type="search" /></view>
      <view class="type-tabs">
        <view v-for="item in productTypes" :key="item.value" :class="{ active: activeType === item.value }"
          @tap="changeType(item.value)">{{ item.label }}</view>
      </view>
      <view class="product-list">
        <template v-if="loading">
          <view v-for="index in 3" :key="index" class="product-skeleton">
            <t-skeleton class="product-skeleton-image" theme="image" animation="gradient" loading />
            <view class="product-skeleton-copy">
              <t-skeleton theme="paragraph" :row-col="productSkeletonRows" animation="gradient" loading />
            </view>
          </view>
        </template>
        <template v-else>
          <product-card v-for="product in visibleProducts" :key="product.id" :product="product" @select="openProduct" />
          <view v-if="!filteredProducts.length" class="empty">暂无匹配产品</view>
          <text v-else class="list-status">{{ hasMore ? '上拉加载更多' : `已展示全部 ${filteredProducts.length} 款产品` }}</text>
        </template>
      </view>

    <view class="contact-ball" :style="contactBallStyle" @touchstart="onContactBallTouchStart"
      @touchmove.stop.prevent="onContactBallTouchMove" @touchend="onContactBallTouchEnd"
      @touchcancel="onContactBallTouchEnd">
      <t-icon name="service" size="44rpx" color="#fff" />
      <text>客服</text>
      <button class="contact-ball-trigger" open-type="contact" aria-label="在线客服" />
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onReachBottom, onShow } from '@dcloudio/uni-app'
import ProductCard from '../../components/ProductCard.vue'
import { productTypes } from '../../data/catalog'
import { getProducts } from '../../api/products'
import { createHorizontalSwipeHandlers } from '../../utils/horizontalSwipe'
import { useContactBallDrag } from '../../utils/contactBallDrag'

const { contactBallStyle, contactBallDragged, onContactBallTouchStart, onContactBallTouchMove, onContactBallTouchEnd } =
  useContactBallDrag()

const PAGE_SIZE = 4
const activeType = ref('nong')
const keyword = ref('')
const page = ref(1)
const products = ref([])
const loading = ref(true)
const productSkeletonRows = [
  { width: '76%', height: '30rpx' },
  { width: '54%', height: '22rpx' },
  { width: '92%', height: '24rpx' },
]
const filteredProducts = computed(() => products.value.filter((item) => {
  const typeName = productTypes.find((type) => type.value === item.type)?.label || ''
  return item.type === activeType.value && `${item.name}${item.year}${typeName}`.includes(keyword.value)
}))
const visibleProducts = computed(() => filteredProducts.value.slice(0, page.value * PAGE_SIZE))
const hasMore = computed(() => visibleProducts.value.length < filteredProducts.value.length)

async function loadProducts() {
  loading.value = true
  try {
    const data = await getProducts({ page: 1, pageSize: 100 })
    products.value = data.items
    page.value = 1
  } catch (error) {
    uni.showToast({ title: error.message || '产品加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
}

function changeType(value) { activeType.value = value; page.value = 1 }
function openProduct(product) { uni.navigateTo({ url: `/pages/product-detail/index?id=${product.id}` }) }

function stepType(direction) {
  const index = productTypes.findIndex((type) => type.value === activeType.value)
  const next = (index + direction + productTypes.length) % productTypes.length
  changeType(productTypes[next].value)
}
const { onTouchStart, onTouchEnd, onTouchCancel } = createHorizontalSwipeHandlers(
  () => stepType(1),
  () => stepType(-1),
  () => contactBallDragged.value,
)

onShow(loadProducts)
onReachBottom(() => { if (hasMore.value) page.value += 1 })
</script>

<style scoped lang="scss">
.page-shell {
  min-height: 100vh;
  padding-top: 20rpx;
  background: $app-bg;
}

.segment,
.type-tabs {
  margin: 0 24rpx;
  padding: 8rpx;
  border-radius: 14rpx;
  background: #e6edf1;
  display: flex;
}

.segment view,
.type-tabs view {
  flex: 1;
  padding: 17rpx 0;
  border-radius: 10rpx;
  color: #64748b;
  text-align: center;
  font-size: 27rpx;
  font-weight: 600;
}

.segment .active,
.type-tabs .active {
  color: #fff;
  background: $brand-primary;
}

.search {
  margin: 20rpx 24rpx 0;
  height: 88rpx;
  padding: 0 26rpx;
  border-radius: 44rpx;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 16rpx;
  box-shadow: $card-shadow;
  color: $text-muted;
}

.search input {
  flex: 1;
  font-size: 26rpx;
}

.type-tabs {
  margin-top: 16rpx;
}

.product-list,
.tank-list {
  padding: 22rpx 24rpx 0;
}

.product-skeleton,
.tank-skeleton {
  margin-bottom: 22rpx;
  padding: 26rpx;
  border: 1rpx solid $line-color;
  border-radius: 16rpx;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 24rpx;
  box-shadow: $card-shadow;
}

.product-skeleton-image { width: 176rpx; height: 176rpx; flex-shrink: 0; }
.product-skeleton-copy,
.tank-skeleton-copy { flex: 1; min-width: 0; }
.tank-skeleton { min-height: 132rpx; }

.empty,
.list-status {
  display: block;
  padding: 60rpx 0;
  color: $text-muted;
  text-align: center;
  font-size: 24rpx;
}

.live-card {
  margin: 24rpx 24rpx 0;
  padding: 32rpx;
  border-radius: 16rpx;
  color: #fff;
  background: linear-gradient(145deg, #55baf4, $brand-primary);
}

.live-head {
  display: flex;
  justify-content: space-between;
  font-size: 28rpx;
  font-weight: 700;
}

.live-status {
  color: #52db8d;
  font-size: 22rpx;
}

.live-dot {
  display: inline-block;
  width: 12rpx;
  height: 12rpx;
  margin-right: 8rpx;
  border-radius: 50%;
  background: #52db8d;
}

.metrics {
  margin-top: 24rpx;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.metrics.secondary {
  grid-template-columns: repeat(2, 1fr);
  gap: 16rpx;
}

.metrics view {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.metrics view>text:first-child {
  color: #8bdcf4;
  font-size: 34rpx;
  font-weight: 800;
}

.metrics view>text:last-child {
  margin-top: 7rpx;
  color: #a9c4cf;
  font-size: 22rpx;
}

.metrics .normal {
  color: #52db8d !important;
}

.secondary view {
  padding: 18rpx;
  border-radius: 10rpx;
  background: rgba(255, 255, 255, .07);
}

.summary {
  margin: 24rpx 24rpx 0;
  display: flex;
  gap: 16rpx;
}

.summary view {
  flex: 1;
  padding: 26rpx 8rpx;
  border-radius: 16rpx;
  background: #fff;
  text-align: center;
  box-shadow: $card-shadow;
}

.summary text {
  display: block;
  color: $brand-primary;
  font-size: 34rpx;
  font-weight: 800;
}

.summary text:last-child {
  margin-top: 7rpx;
  color: $text-muted;
  font-size: 22rpx;
  font-weight: 400;
}

.tank {
  margin-bottom: 22rpx;
  padding: 26rpx;
  border-radius: 16rpx;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 22rpx;
  box-shadow: $card-shadow;
}

.tank-mark {
  width: 88rpx;
  height: 88rpx;
  border-radius: 14rpx;
  color: #fff;
  background: #9a6a3c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 700;
}

.tank-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.tank-name {
  color: $text-title;
  font-size: 27rpx;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.tank-meta {
  margin-top: 7rpx;
  color: $text-muted;
  font-size: 22rpx;
}

.progress {
  height: 8rpx;
  margin-top: 12rpx;
  border-radius: 4rpx;
  background: #e7eef2;
  overflow: hidden;
}

.progress view {
  height: 100%;
  border-radius: 4rpx;
  background: $brand-primary;
}

.tank-value {
  text-align: right;
}

.tank-value text {
  display: block;
  color: $text-title;
  font-size: 32rpx;
  font-weight: 800;
}

.tank-value text:last-child {
  color: $text-muted;
  font-size: 21rpx;
  font-weight: 400;
}
</style>