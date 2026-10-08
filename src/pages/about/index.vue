<template>
  <view class="page-shell safe-bottom">
    <view class="hero">
      <view v-if="!heroLoaded" class="hero-placeholder" />
      <image :class="['hero-image', { loaded: heroLoaded }]" :src="heroImage" mode="aspectFill"
        @load="heroLoaded = true" @error="handleHeroError" />
      <view class="mask" />
      <view class="hero-copy"><text>白酒投集团 · 酒谷酒业</text><text>泸州产区原酒全产业链综合服务商</text></view>
    </view>
    <view class="intro"><text class="company">泸州白酒产业发展投资集团酒谷酒业有限公司</text>
      <view class="intro-body">
        <text class="paragraph">
        按照四川省委、省政府赋予泸州建设世界级优质白酒产业集群的战略部署，以及泸州市委、市政府关于“深入实施产业建圈强链行动，持续增强产业核心竞争力”的决策要求，充分依托泸州原酒产区资源禀赋和品质基础。2025年1月9日，在白酒投集团的高度重视下，“泸州白酒产业发展投资集团酒谷酒业有限公司”注册成立，于2025年3月25日更名为“泸州白酒产业发展投资集团酒谷酒业有限公司”。
        </text>
        <text class="paragraph">
        主营业务：根植于“泸州产区”这一世界级白酒原产地，专注于原酒这一产业根基，超越传统原酒买卖模式，向产业链上下游延伸，致力于打造中国泸州优质产区原酒品牌，聚焦于原酒全产业链综合服务商。
        </text>
      </view>
    </view>
    <view class="strengths">
      <view><text>11,440</text><text>吨储酒</text></view>
      <view><text>76</text><text>酒体品种</text></view>
      <view><text>全链路</text><text>数字化溯源</text></view>
    </view>
    <section-title title="企业实力" />
    <view class="photos">
      <image v-for="(image, index) in photos" :key="index" :src="image" mode="aspectFill" lazy-load
        @error="photos[index] = '/static/logo.png'" />
    </view>
    <view class="trace-copy"><text>从原料、酿造、存储到质检全程可查，每一罐原酒均配备独立溯源码，支持扫码验真。</text></view>
    <view class="contact"><text>联系电话</text><text
        selectable>0830-6660008</text><text>公司地址</text><text>四川省泸州市龙马潭区安宁街道安宁大道三段 20
        号</text><text>营业时间</text><text>周一至周五 9:00-18:00</text></view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import SectionTitle from '../../components/SectionTitle.vue'

const resourceBase = 'https://lzbjtjt.online/jgjy/resource'
const heroImage = ref(`${resourceBase}/48dcc5dd10c3f4fe14af9ec847e4010d.jpg`)
const heroLoaded = ref(false)
const photos = ref([
  `${resourceBase}/138d63084c6ff384217f7568b3b0d014.jpg`,
  `${resourceBase}/ac0412e9d010ac09059754425226451c.jpg`,
  `${resourceBase}/bd103da8a9a17928697ed32e58c54831.jpg`,
])

function handleHeroError() {
  heroLoaded.value = true
  heroImage.value = ''
}
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

.hero-image {
  opacity: 0;
  transition: opacity .25s ease;
}

.hero-image.loaded {
  opacity: 1;
}

.hero-placeholder {
  position: absolute;
  inset: 0;
  background: #dce9ed;
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

.hero-copy text:last-child {
  margin-top: 9rpx;
  font-size: 24rpx;
  opacity: .88;
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

.photos image {
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