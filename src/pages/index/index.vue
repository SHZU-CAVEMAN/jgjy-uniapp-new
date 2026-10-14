<template>
  <view class="page-shell">
    <view class="hero-wrap">
      <swiper v-if="banners.length" class="hero" circular :autoplay="bannerAutoplay" :interval="4000" @change="handleBannerChange">
        <swiper-item v-for="(banner, index) in banners" :key="banner.image || banner.video" @tap="openBanner(banner)">
          <video v-if="banner.type === 'video' && !banner.videoError" id="home-banner-video" class="hero-image"
            :src="banner.video" :poster="banner.poster" :autoplay="currentBanner === index && bannerAutoplay" loop
            muted :controls="false" :show-center-play-btn="false" :show-play-btn="false"
            :show-fullscreen-btn="false" :enable-progress-gesture="false" object-fit="cover"
            @tap.stop="openBanner(banner)" @error="handleVideoError(banner)" />
          <image v-else class="hero-image" :src="banner.image || banner.poster" mode="aspectFill"
            @error="handleImageError(banner)" />
          <view v-if="banner.type === 'video' && !banner.videoError" class="play-mark">▶</view>
        </swiper-item>
      </swiper>
      <view v-else class="hero" />
      <button class="news-entry" @tap.stop="goNews">查看动态 ›</button>
      <view class="hero-dots">
        <view v-for="(_, index) in banners" :key="index" class="hero-dot" :class="{ active: currentBanner === index }" />
      </view>
    </view>

    <view class="storage-card" @tap="goProducts('storage')">
      <view class="storage-head"><text>总库存</text><text class="storage-link">查看全部 ›</text></view>
      <view class="storage-total"><text class="storage-number">{{ homeSummary.totalTons }}</text><text> 吨</text></view>
      <text class="storage-caption">{{ homeSummary.productCount }} 个上架产品</text>
      <view class="storage-trace"><text>{{ featuredProduct ? `${featuredProduct.tank || '储酒罐'} · ${featuredProduct.name}` : '暂无上架产品' }}</text><text>可溯源 ›</text></view>
    </view>

    <section-title title="主营业务" subtitle="原酒全产业链服务" />
    <view class="business-grid">
      <view v-for="item in businesses" :key="item.title" class="business-item" @tap="handleBusiness(item)">
        <view class="business-icon" :class="item.theme">{{ item.icon }}</view>
        <text class="business-title">{{ item.title }}</text>
        <text class="business-desc">{{ item.description }}</text>
      </view>
    </view>

    <view class="trace-entry" @tap="switchTab('/pages/trace/index')">
      <view class="trace-icon">溯</view>
      <view class="trace-copy"><text class="trace-title">产品可溯源 · 一罐一码</text><text
          class="trace-desc">扫码查看原料、酿造、存储与质检链路</text></view>
      <text class="arrow">›</text>
    </view>
    <button class="primary-button" @tap="goConsult">发起咨询 <text>一对一专属服务 ›</text></button>
  </view>
</template>

<script setup>
import { computed, ref } from 'vue'
import { onHide, onLoad, onShow } from '@dcloudio/uni-app'
import SectionTitle from '../../components/SectionTitle.vue'
import { getHomeSummary } from '../../api/home'

const currentBanner = ref(0)
const bannerAutoplay = ref(true)
const homeSummary = ref({ totalTons: 0, productCount: 0, latestProducts: [] })
const banners = ref([])
const featuredProduct = computed(() => homeSummary.value.latestProducts[0])
const businesses = [
  { title: '原酒收储', description: '集中入库、分级、陈化老熟', icon: '储', theme: 'amber' },
  { title: '原酒销售', description: '平台集中对外销售', icon: '售', theme: 'red' ,route: 'product'},
  { title: '技术服务', description: '提供技术咨询', icon: '技', theme: 'blue',  },
  { title: '白酒金融', description: '面向白酒产业链的产业金融服务', icon: '金', theme: 'green' },
]

function handleBannerChange(event) {
  currentBanner.value = event.detail.current
  const videoContext = uni.createVideoContext('home-banner-video')
  if (banners.value[currentBanner.value]?.type === 'video') videoContext.play()
  else videoContext.pause()
}
function handleImageError(banner) {
  banner.image = ''
}
function handleVideoError(banner) { banner.videoError = true }
// 打开轮播图预览
function openBanner(banner) {
  if (banner.type !== 'video' || banner.videoError) {
    const image = banner.image || banner.poster
    const urls = banners.value.filter((item) => item.type === 'image').map((item) => item.image)
    return uni.previewImage({ current: image, urls: urls.includes(image) ? urls : [image, ...urls] })
  }
  uni.navigateTo({
    url: `/pages/video-player/index?src=${encodeURIComponent(banner.video)}&poster=${encodeURIComponent(banner.poster || defaultBannerImage)}`,
  })
}
function switchTab(url) { uni.switchTab({ url }) }
function goProducts(segment = 'product') {
  uni.setStorageSync('product-segment', segment)
  switchTab('/pages/products/index')
}
function handleBusiness(item) {
  if (item.route === 'product') return goProducts('product')
  goConsult(item.title)
}
function goConsult(type = '') { uni.navigateTo({ url: `/pages/consult/index?type=${encodeURIComponent(type)}` }) }
function goNews() { uni.navigateTo({ url: '/pages/news/index' }) }

async function loadHome() {
  try {
    homeSummary.value = await getHomeSummary()
    banners.value = homeSummary.value.latestProducts
      .filter((product) => product.thumbnailUrl)
      .map((product) => ({ type: 'image', image: product.thumbnailUrl }))
  } catch (error) {
    uni.showToast({ title: error.message || '首页数据加载失败', icon: 'none' })
  }
}

onLoad(loadHome)
onShow(() => {
  bannerAutoplay.value = true
  if (banners.value[currentBanner.value]?.type === 'video') uni.createVideoContext('home-banner-video').play()
})
onHide(() => {
  bannerAutoplay.value = false
  uni.createVideoContext('home-banner-video').pause()
})

</script>

<style scoped lang="scss">
.page-shell {
  min-height: 100vh;
  padding-bottom: calc(32rpx + env(safe-area-inset-bottom));
  background: $app-bg;
}

.hero {
  height: 360rpx;
  background: $brand-deep;
}

.hero-wrap {
  position: relative;
}

.hero-image {
  position: absolute;
  width: 100%;
  height: 100%;
}

.news-entry {
  position: absolute;
  z-index: 6;
  top: 22rpx;
  right: 24rpx;
  height: 58rpx;
  padding: 0 20rpx;
  border: 1rpx solid rgba(255, 255, 255, .58);
  border-radius: 29rpx;
  color: #fff;
  background: rgba(7, 59, 82, .38);
  backdrop-filter: blur(8rpx);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23rpx;
  font-weight: 700;
}

.play-mark {
  width: 82rpx;
  height: 82rpx;
  padding-left: 5rpx;
  position: absolute;
  z-index: 4;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 2rpx solid rgba(255, 255, 255, .8);
  border-radius: 50%;
  color: #fff;
  background: rgba(7, 59, 82, .5);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32rpx;
}

.hero-dots {
  position: absolute;
  z-index: 2;
  right: 28rpx;
  bottom: 22rpx;
  display: flex;
  gap: 10rpx;
}

.hero-dot {
  width: 12rpx;
  height: 12rpx;
  border-radius: 6rpx;
  background: rgba(255, 255, 255, .55);
}

.hero-dot.active {
  width: 30rpx;
  background: #fff;
}

.storage-card {
  margin: 26rpx 24rpx 0;
  padding: 32rpx;
  color: #fff;
  border-radius: 16rpx;
  background: linear-gradient(135deg, $brand-primary, $brand-deep);
  box-shadow: 0 12rpx 30rpx rgba(2, 132, 199, .2);
}

.storage-head {
  display: flex;
  justify-content: space-between;
  font-size: 26rpx;
  opacity: .94;
}

.storage-link {
  color: #bae6fd;
}

.storage-total {
  margin-top: 16rpx;
  font-size: 24rpx;
}

.storage-number {
  font-size: 58rpx;
  line-height: 1;
  font-weight: 800;
}

.storage-caption {
  display: block;
  margin-top: 10rpx;
  font-size: 24rpx;
  opacity: .82;
}

.storage-trace {
  margin-top: 24rpx;
  padding: 20rpx;
  border-radius: 12rpx;
  background: rgba(255, 255, 255, .13);
  display: flex;
  justify-content: space-between;
  font-size: 24rpx;
}

.business-grid {
  padding: 0 24rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20rpx;
}

.business-item {
  padding: 30rpx 18rpx;
  border: 1rpx solid $line-color;
  border-radius: 16rpx;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: $card-shadow;
}

.business-icon {
  width: 88rpx;
  height: 88rpx;
  border-radius: 16rpx;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 30rpx;
  font-weight: 700;
}

.business-icon.amber {
  background: #c99524;
}

.business-icon.red {
  background: #be3d3d;
}

.business-icon.blue {
  background: $brand-primary;
}

.business-icon.green {
  background: #24835f;
}

.business-title {
  margin-top: 16rpx;
  color: $text-title;
  font-size: 31rpx;
  font-weight: 700;
}

.business-desc {
  margin-top: 8rpx;
  color: $text-muted;
  font-size: 23rpx;
}

.trace-entry {
  margin: 24rpx 24rpx 0;
  padding: 26rpx;
  display: flex;
  align-items: center;
  border-radius: 16rpx;
  background: #fff;
  box-shadow: $card-shadow;
}

.trace-icon {
  width: 78rpx;
  height: 78rpx;
  border-radius: 14rpx;
  color: #fff;
  background: $brand-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  font-weight: 700;
}

.trace-copy {
  flex: 1;
  min-width: 0;
  margin-left: 20rpx;
  display: flex;
  flex-direction: column;
}

.trace-title {
  color: $text-title;
  font-size: 28rpx;
  font-weight: 700;
}

.trace-desc {
  margin-top: 7rpx;
  color: $text-muted;
  font-size: 23rpx;
}

.arrow {
  color: $brand-primary;
  font-size: 34rpx;
}

.primary-button {
  margin: 24rpx 24rpx 0;
}

.primary-button text {
  margin-left: 12rpx;
  font-size: 24rpx;
  font-weight: 400;
  opacity: .9;
}
</style>
