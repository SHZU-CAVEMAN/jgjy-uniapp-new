<template>
  <view class="page-shell safe-bottom">
    <view class="hero">
      <view class="hero-glow" />
      <view class="hero-ring" />
      <text class="eyebrow">INDUSTRY FINANCE</text>
      <text class="title">白酒金融</text>
      <text class="summary">面向白酒产业链的业务咨询与需求对接</text>
    </view>

    <view class="block-head">
      <view class="head-bar" />
      <text class="block-title">可咨询的业务场景</text>
      <text class="block-note">01 — 03</text>
    </view>
    <view class="scope-list">
      <view class="scope-row">
        <text class="scope-no">01</text>
        <view class="scope-copy"><text class="scope-title">原酒相关业务</text><text class="scope-desc">采购、储存等业务需求沟通</text></view>
        <text class="scope-arrow">›</text>
      </view>
      <view class="scope-row">
        <text class="scope-no">02</text>
        <view class="scope-copy"><text class="scope-title">企业经营需求</text><text class="scope-desc">结合经营情况说明资金用途</text></view>
        <text class="scope-arrow">›</text>
      </view>
      <view class="scope-row">
        <text class="scope-no">03</text>
        <view class="scope-copy"><text class="scope-title">产业链协作</text><text class="scope-desc">上下游合作与业务对接需求</text></view>
        <text class="scope-arrow">›</text>
      </view>
    </view>

    <view class="process-card">
      <text class="process-heading">对接步骤</text>
      <view class="process-line">
        <view class="process-step"><view class="process-dot active" /><text>提交需求</text></view>
        <view class="connector" />
        <view class="process-step"><view class="process-dot" /><text>资料沟通</text></view>
        <view class="connector" />
        <view class="process-step"><view class="process-dot" /><text>方案确认</text></view>
      </view>
    </view>

    <view class="compliance-note">
      <text class="note-title">重要说明</text>
      <text>可办理业务、准入条件及方案以实际审核和协议为准；本页面不构成授信、收益或审批承诺。</text>
    </view>

    <button class="primary-button consult-button" @tap="startConsultation">咨询业务方案</button>
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
  uni.navigateTo({ url: `/pages/consult/index?type=${encodeURIComponent('白酒金融')}` })
}
</script>

<style scoped lang="scss">
.page-shell { min-height: 100vh; padding-bottom: calc(148rpx + env(safe-area-inset-bottom)); background: $app-bg; }
.hero { position: relative; overflow: hidden; padding: 48rpx 38rpx 58rpx; color: #fff; background: linear-gradient(140deg, #1c7fc8, $brand-primary 58%, $brand-deep); }
.hero-glow { position: absolute; top: -120rpx; right: -80rpx; width: 340rpx; height: 340rpx; border-radius: 50%; background: rgba(255,255,255,.14); }
.hero-ring { position: absolute; bottom: -170rpx; left: -110rpx; width: 320rpx; height: 320rpx; border: 2rpx solid rgba(255,255,255,.2); border-radius: 50%; }
.eyebrow { position: relative; letter-spacing: 3rpx; color: rgba(255,255,255,.7); font-size: 22rpx; }
.title { position: relative; display: block; margin-top: 14rpx; letter-spacing: 2rpx; font-size: 52rpx; line-height: 1.2; font-weight: 800; }
.summary { position: relative; display: block; margin-top: 12rpx; letter-spacing: 1rpx; color: rgba(255,255,255,.9); font-size: 25rpx; }
.block-head { margin: 34rpx 34rpx 18rpx; display: flex; align-items: center; }
.head-bar { width: 7rpx; height: 28rpx; margin-right: 13rpx; border-radius: 4rpx; background: $brand-primary; }
.block-title { color: $text-title; font-size: 30rpx; font-weight: 700; }
.block-note { margin-left: auto; color: $text-muted; font-size: 22rpx; }
.scope-list { margin: 0 26rpx; display: flex; flex-direction: column; gap: 14rpx; }
.scope-row { padding: 26rpx 24rpx; border-radius: 18rpx; background: #fff; display: flex; align-items: center; gap: 18rpx; box-shadow: 0 6rpx 18rpx rgba(31, 132, 196, .07); }
.scope-no { width: 62rpx; height: 62rpx; flex-shrink: 0; border-radius: 18rpx; color: $brand-deep; background: #e2f2ff; display: flex; align-items: center; justify-content: center; font-size: 23rpx; font-weight: 800; }
.scope-copy { flex: 1; display: flex; flex-direction: column; gap: 6rpx; }
.scope-title { color: $text-title; font-size: 28rpx; font-weight: 700; }
.scope-desc { color: $text-muted; font-size: 23rpx; }
.scope-arrow { color: #9dc9e7; font-size: 32rpx; }
.process-card { margin: 22rpx 26rpx 0; padding: 26rpx 24rpx 22rpx; border-radius: 18rpx; background: #fff; box-shadow: 0 6rpx 18rpx rgba(31, 132, 196, .07); }
.process-heading { display: block; color: $text-title; font-size: 24rpx; font-weight: 700; }
.process-line { margin-top: 24rpx; display: flex; align-items: flex-start; }
.process-step { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 9rpx; }
.process-step text { color: $text-body; font-size: 23rpx; }
.process-dot { width: 16rpx; height: 16rpx; border: 4rpx solid #a9d8f7; border-radius: 50%; background: #fff; }
.process-dot.active { border-color: $brand-primary; background: $brand-primary; }
.connector { height: 2rpx; flex: 1; margin: 11rpx 8rpx 0; background: #c9e6f8; }
.compliance-note { margin: 22rpx 26rpx 0; padding: 24rpx 26rpx; border-radius: 18rpx; background: #e4f3ff; display: flex; flex-direction: column; gap: 10rpx; }
.note-title { color: $brand-deep; font-size: 24rpx; font-weight: 700; }
.compliance-note text:last-child { color: $text-body; font-size: 23rpx; line-height: 1.6; }
.consult-button { position: fixed; z-index: 10; left: 28rpx; right: 28rpx; bottom: calc(20rpx + env(safe-area-inset-bottom)); }
</style>