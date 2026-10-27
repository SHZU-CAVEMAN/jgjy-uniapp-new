<template>
  <view class="page-shell safe-bottom">
    <view class="hero">
      <async-image class="hero-image" :src="heroImage" mode="aspectFill" />
      <view class="mask" />
      <view class="hero-copy"><text>{{ company.name || '酒谷酒业' }}</text></view>
    </view>
    <view class="intro"><text class="company">{{ company.name || '酒谷酒业' }}</text>
      <view class="intro-body">
        <text class="paragraph">{{ company.description || '企业资料正在加载。' }}</text>
      </view>
    </view>
    <view class="strengths">
      <view><text>11,440</text><text>吨储酒</text></view>
      <view><text>76</text><text>酒体品种</text></view>
      <view><text>全链路</text><text>数字化溯源</text></view>
    </view>
    <section-title title="企业实力" />
    <view class="photos">
      <async-image v-for="(image, index) in photos" :key="index" class="photo-image" :src="image"
        mode="aspectFill" lazy-load />
    </view>
    <view class="trace-copy"><text>从原料、酿造、存储到质检全程可查，每一罐原酒均配备独立溯源码，支持扫码验真。</text></view>
    <view class="contact"><text>联系电话</text><text selectable>{{ company.servicePhone || company.phone || '-' }}</text><text>公司地址</text><text>{{ company.address || '-' }}</text><text>电子邮箱</text><text>{{ company.email || '-' }}</text></view>
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
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import AsyncImage from '../../components/AsyncImage.vue'
import SectionTitle from '../../components/SectionTitle.vue'
import { getCompany } from '../../api/home'
import { useContactBallDrag } from '../../utils/contactBallDrag'

const { contactBallStyle, contactBallDragged, onContactBallTouchStart, onContactBallTouchMove, onContactBallTouchEnd } =
  useContactBallDrag()

const resourceBase = 'https://lzbjtjt.online/jgjy/resource'
const heroImage = ref(`${resourceBase}/48dcc5dd10c3f4fe14af9ec847e4010d.jpg`)
const company = ref({})
const photos = ref([
  `${resourceBase}/138d63084c6ff384217f7568b3b0d014.jpg`,
  `${resourceBase}/ac0412e9d010ac09059754425226451c.jpg`,
  `${resourceBase}/bd103da8a9a17928697ed32e58c54831.jpg`,
])

onLoad(async () => {
  try {
    company.value = await getCompany()
  } catch (error) {
    uni.showToast({ title: error.message || '企业资料加载失败', icon: 'none' })
  }
})
</script>

<style scoped lang="scss">
.page-shell {
  min-height: 100vh;
  background: $app-bg;
}

.hero {
  height: 340rpx;
  position: relative;
  overflow: hidden;
}

.hero-image,
.mask {
  width: 100%;
  height: 100%;
  position: absolute;
}

.mask {
  background: linear-gradient(180deg, rgba(7, 59, 82, .12), rgba(7, 59, 82, .9));
}

.hero-copy {
  position: absolute;
  left: 32rpx;
  right: 32rpx;
  bottom: 26rpx;
  color: #fff;
  display: flex;
  flex-direction: column;
}

.hero-copy text:first-child {
  font-size: 38rpx;
  font-weight: 800;
}

.intro,
.trace-copy,
.contact {
  margin: 24rpx 24rpx 0;
  padding: 30rpx;
  border-radius: 16rpx;
  background: #fff;
  box-shadow: $card-shadow;
  color: $text-body;
  font-size: 25rpx;
  line-height: 1.85;
  display: flex;
  flex-direction: column;
}

.intro-body {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.paragraph {
  display: block;
  text-align: justify;
}

.company {
  margin-bottom: 12rpx;
  color: $brand-primary;
  font-size: 28rpx;
  font-weight: 700;
}

.strengths {
  margin: 24rpx 24rpx 0;
  display: flex;
  gap: 16rpx;
}

.strengths view {
  flex: 1;
  padding: 26rpx 8rpx;
  border-radius: 14rpx;
  background: #fff;
  text-align: center;
  box-shadow: $card-shadow;
}

.strengths text {
  display: block;
  color: $brand-primary;
  font-size: 31rpx;
  font-weight: 800;
}

.strengths text:last-child {
  margin-top: 7rpx;
  color: $text-muted;
  font-size: 21rpx;
  font-weight: 400;
}

.photos {
  padding: 0 24rpx;
  display: flex;
  gap: 14rpx;
}

.photos .photo-image {
  width: calc((100% - 28rpx) / 3);
  height: 150rpx;
  border-radius: 12rpx;
  background: #dce9ed;
}

.trace-copy {
  color: $brand-deep;
  background: #eaf6f8;
}

.contact {
  display: grid;
  grid-template-columns: 140rpx 1fr;
  gap: 16rpx 20rpx;
  line-height: 1.65;
}

.contact text:nth-child(odd) {
  color: $text-muted;
}

.contact text:nth-child(even) {
  color: $text-title;
  font-weight: 600;
}
</style>