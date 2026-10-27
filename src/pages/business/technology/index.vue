<template>
  <view class="page-shell safe-bottom">
    <view class="hero">
      <view class="hero-glow" />
      <view class="hero-ring" />
      <text class="eyebrow">TECHNICAL SUPPORT</text>
      <text class="title">技术服务</text>
      <text class="summary">围绕原酒品质与产品需求，先把问题说清楚</text>
    </view>

    <view class="block-head">
      <view class="head-bar" />
      <text class="block-title">可沟通方向</text>
      <text class="block-note">按实际需求确认</text>
    </view>
    <view class="service-grid">
      <view class="service-item">
        <view class="service-badge">A</view>
        <text class="service-title">酒体分析</text>
        <text class="service-desc">沟通酒体特点与目标风格</text>
      </view>
      <view class="service-item">
        <view class="service-badge">B</view>
        <text class="service-title">品质评价</text>
        <text class="service-desc">梳理现有品质问题与诉求</text>
      </view>
      <view class="service-item">
        <view class="service-badge">C</view>
        <text class="service-title">产品开发</text>
        <text class="service-desc">交流产品定位与开发方向</text>
      </view>
      <view class="service-item">
        <view class="service-badge">D</view>
        <text class="service-title">定制需求</text>
        <text class="service-desc">讨论规格、用途与交付需求</text>
      </view>
    </view>

    <view class="flow-card">
      <text class="flow-caption">沟通流程</text>
      <view class="flow">
        <view class="flow-step"><text class="flow-no">01</text><text class="flow-text">描述问题</text></view>
        <view class="flow-line" />
        <view class="flow-step"><text class="flow-no">02</text><text class="flow-text">沟通方向</text></view>
        <view class="flow-line" />
        <view class="flow-step"><text class="flow-no">03</text><text class="flow-text">确认方案</text></view>
      </view>
    </view>

    <view class="tips">
      <text class="tips-title">沟通更高效</text>
      <view class="chips">
        <text class="chip">产品 / 酒体信息</text>
        <text class="chip">目标用途</text>
        <text class="chip">检测资料</text>
      </view>
    </view>
    <text class="disclaimer">具体服务内容与执行条件以实际沟通确认为准</text>
    <button class="primary-button consult-button" @tap="startConsultation">发起技术咨询</button>
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
import { useContactBallDrag } from '../../../utils/contactBallDrag'

const { contactBallStyle, contactBallDragged, onContactBallTouchStart, onContactBallTouchMove, onContactBallTouchEnd } =
  useContactBallDrag()

function startConsultation() {
  uni.navigateTo({ url: `/pages/consult/index?type=${encodeURIComponent('技术服务')}` })
}
</script>

<style scoped lang="scss">
.page-shell { min-height: 100vh; padding-bottom: calc(148rpx + env(safe-area-inset-bottom)); background: $app-bg; }
.hero { position: relative; overflow: hidden; padding: 48rpx 38rpx 56rpx; color: #fff; background: linear-gradient(140deg, #5cc0f6, $brand-primary 55%, $brand-deep); }
.hero-glow { position: absolute; top: -120rpx; right: -80rpx; width: 340rpx; height: 340rpx; border-radius: 50%; background: rgba(255,255,255,.16); }
.hero-ring { position: absolute; bottom: -170rpx; left: -110rpx; width: 320rpx; height: 320rpx; border: 2rpx solid rgba(255,255,255,.22); border-radius: 50%; }
.eyebrow { position: relative; letter-spacing: 3rpx; color: rgba(255,255,255,.7); font-size: 22rpx; }
.title { position: relative; display: block; margin-top: 14rpx; letter-spacing: 2rpx; font-size: 52rpx; line-height: 1.2; font-weight: 800; }
.summary { position: relative; display: block; margin-top: 12rpx; letter-spacing: 1rpx; color: rgba(255,255,255,.9); font-size: 25rpx; }
.block-head { margin: 34rpx 34rpx 18rpx; display: flex; align-items: center; }
.head-bar { width: 7rpx; height: 28rpx; margin-right: 13rpx; border-radius: 4rpx; background: $brand-primary; }
.block-title { color: $text-title; font-size: 30rpx; font-weight: 700; }
.block-note { margin-left: auto; color: $text-muted; font-size: 22rpx; }
.service-grid { margin: 0 26rpx; display: grid; grid-template-columns: 1fr 1fr; gap: 14rpx; }
.service-item { padding: 26rpx 24rpx 28rpx; border-radius: 18rpx; background: #fff; display: flex; flex-direction: column; align-items: flex-start; box-shadow: 0 6rpx 18rpx rgba(31, 132, 196, .07); }
.service-badge { width: 56rpx; height: 56rpx; margin-bottom: 16rpx; border-radius: 16rpx; color: $brand-deep; background: #e2f2ff; display: flex; align-items: center; justify-content: center; font-size: 24rpx; font-weight: 800; }
.service-title { color: $text-title; font-size: 29rpx; font-weight: 700; }
.service-desc { margin-top: 8rpx; color: $text-muted; font-size: 23rpx; line-height: 1.45; }
.flow-card { margin: 22rpx 26rpx 0; padding: 26rpx 24rpx; border-radius: 18rpx; background: #fff; box-shadow: 0 6rpx 18rpx rgba(31, 132, 196, .07); }
.flow-caption { display: block; color: $text-title; font-size: 24rpx; font-weight: 700; }
.flow { margin-top: 20rpx; display: flex; align-items: center; }
.flow-step { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 8rpx; }
.flow-no { color: $brand-primary; font-size: 22rpx; font-weight: 800; }
.flow-text { color: $text-body; font-size: 24rpx; }
.flow-line { width: 40rpx; height: 2rpx; margin-bottom: 22rpx; background: #c9e6f8; }
.tips { margin: 22rpx 26rpx 0; padding: 24rpx 26rpx; border-radius: 18rpx; background: #e4f3ff; display: flex; flex-direction: column; gap: 14rpx; }
.tips-title { color: $brand-deep; font-size: 24rpx; font-weight: 700; }
.chips { display: flex; flex-wrap: wrap; gap: 12rpx; }
.chip { padding: 9rpx 20rpx; border-radius: 999rpx; color: $text-body; background: rgba(255,255,255,.92); font-size: 22rpx; }
.disclaimer { display: block; margin: 22rpx 30rpx 0; color: $text-muted; font-size: 22rpx; }
.consult-button { position: fixed; z-index: 10; left: 28rpx; right: 28rpx; bottom: calc(20rpx + env(safe-area-inset-bottom)); }
</style>