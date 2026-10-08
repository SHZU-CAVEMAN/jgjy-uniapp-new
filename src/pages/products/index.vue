<template>
  <view class="page-shell safe-bottom">
    <view class="segment">
      <view :class="{ active: segment === 'product' }" @tap="changeSegment('product')">产品中心</view>
      <view :class="{ active: segment === 'storage' }" @tap="changeSegment('storage')">储酒数据</view>
    </view>

    <template v-if="segment === 'product'">
      <view class="search"><text>⌕</text><input v-model.trim="keyword" placeholder="搜索产品名称 / 年份 / 香型"
          confirm-type="search" /></view>
      <view class="type-tabs">
        <view v-for="item in productTypes" :key="item.value" :class="{ active: activeType === item.value }"
          @tap="changeType(item.value)">{{ item.label }}</view>
      </view>
      <view class="product-list">
        <view v-if="loading" class="empty">产品加载中...</view>
        <product-card v-for="product in visibleProducts" v-else :key="product.id" :product="product" @select="openProduct" />
        <view v-if="!loading && !filteredProducts.length" class="empty">暂无匹配产品</view>
        <text v-else-if="!loading" class="list-status">{{ hasMore ? '上拉加载更多' : `已展示全部 ${filteredProducts.length} 款产品` }}</text>
      </view>
    </template>

    <template v-else>
      <!-- <view class="live-card">
        <view class="live-head"><text>酒库实时数据</text><text class="live-status"><text class="live-dot" />LIVE 实时</text>
        </view>
        <view class="metrics">
          <view><text>22.5°C</text><text>库内温度</text></view>
          <view><text>68%RH</text><text>库内湿度</text></view>
          <view><text class="normal">正常</text><text>通风状态</text></view>
        </view>
        <view class="metrics secondary">
          <view><text>101.3 kPa</text><text>气压</text></view>
          <view><text>0.03%</text><text>CO₂ 浓度</text></view>
        </view>
      </view> -->
      <view class="summary">
        <view><text>11,440</text><text>总库存(吨)</text></view>
        <view><text>76</text><text>酒体品种</text></view>
        <view><text>3</text><text>储存区域</text></view>
      </view>
      <section-title title="罐体列表"/>
      <view class="tank-list">
        <view v-for="product in storageProducts" :key="product.id" class="tank" @tap="openStorage(product)">
          <view class="tank-mark">{{ product.zone.includes('钢') ? '钢' : '陶' }}</view>
          <view class="tank-content"><text class="tank-name">{{ product.tank }} · {{ product.name }}</text><text
              class="tank-meta">{{ product.zone }} · 实时监测中</text>
            <view class="progress">
              <view :style="{ width: `${product.fill}%` }" />
            </view>
          </view>
          <view class="tank-value"><text>{{ product.tons }}</text><text>吨</text></view>
        </view>
      </view>
    </template>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onReachBottom, onShow } from '@dcloudio/uni-app'
import ProductCard from '../../components/ProductCard.vue'
import SectionTitle from '../../components/SectionTitle.vue'
import { productTypes } from '../../data/catalog'
import { getProducts } from '../../api/products'

const PAGE_SIZE = 4
const segment = ref('product')
const activeType = ref('nong')
const keyword = ref('')
const page = ref(1)
const products = ref([])
const loading = ref(false)
const filteredProducts = computed(() => products.value.filter((item) => {
  const typeName = productTypes.find((type) => type.value === item.type)?.label || ''
  return item.type === activeType.value && `${item.name}${item.year}${typeName}`.includes(keyword.value)
}))
const visibleProducts = computed(() => filteredProducts.value.slice(0, page.value * PAGE_SIZE))
const hasMore = computed(() => visibleProducts.value.length < filteredProducts.value.length)
const storageProducts = computed(() => products.value.slice(0, 6))

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

function changeSegment(value) { segment.value = value }
function changeType(value) { activeType.value = value; page.value = 1 }
function openProduct(product) { uni.navigateTo({ url: `/pages/product-detail/index?id=${product.id}` }) }
function openStorage(product) { uni.navigateTo({ url: `/pages/storage-detail/index?id=${product.id}` }) }

onShow(() => {
  loadProducts()
  const storedSegment = uni.getStorageSync('product-segment')
  if (storedSegment) {
    segment.value = storedSegment
    uni.removeStorageSync('product-segment')
  }
})
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
  background: linear-gradient(145deg, #082d3e, #075478);
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