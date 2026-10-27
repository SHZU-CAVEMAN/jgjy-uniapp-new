<template>
  <view class="page-shell safe-bottom">
    <view class="hero">
      <view class="hero-glow" />
      <view class="hero-ring" />
      <text class="eyebrow">RAW SPIRIT STORAGE</text>
      <text class="title">原酒收储</text>
      <text class="summary">集中入库 · 分级管理 · 陈化储存</text>
    </view>

    <view class="stat-card">
      <view class="stat-item"><text class="stat-value">01</text><text class="stat-label">入库评估</text></view>
      <view class="stat-item"><text class="stat-value">02</text><text class="stat-label">分级建档</text></view>
      <view class="stat-item"><text class="stat-value">03</text><text class="stat-label">储存管理</text></view>
    </view>

    <view class="block-head">
      <view class="head-bar" />
      <text class="block-title">服务流程</text>
      <text class="block-note">按实际情况沟通</text>
    </view>
    <view class="steps">
      <view class="step">
        <text class="step-no">01</text>
        <view class="step-copy"><text class="step-title">提交基本信息</text><text class="step-desc">酒体类型 · 批次 · 预计数量</text></view>
      </view>
      <view class="step">
        <text class="step-no">02</text>
        <view class="step-copy"><text class="step-title">沟通收储条件</text><text class="step-desc">入库要求 · 储存周期 · 管理方式</text></view>
      </view>
      <view class="step">
        <text class="step-no">03</text>
        <view class="step-copy"><text class="step-title">确认服务方案</text><text class="step-desc">双方确认后安排后续流程</text></view>
      </view>
    </view>

    <view class="tips">
      <text class="tips-title">咨询可准备</text>
      <view class="chips">
        <text class="chip">酒体名称</text>
        <text class="chip">批次信息</text>
        <text class="chip">预计数量</text>
        <text class="chip">储存周期</text>
      </view>
    </view>

    <button class="primary-button consult-button" @tap="startConsultation">发起收储咨询</button>
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
  uni.navigateTo({ url: `/pages/consult/index?type=${encodeURIComponent('储酒服务')}` })
}
</script>

<style scoped lang="scss">
.page-shell { min-height: 100vh; padding-bottom: calc(150rpx + env(safe-area-inset-bottom)); background: $app-bg; }
.hero { position: relative; overflow: hidden; padding: 48rpx 38rpx 84rpx; color: #fff; background: linear-gradient(140deg, #5cc0f6, $brand-primary 55%, $brand-deep); }
.hero-glow { position: absolute; top: -130rpx; right: -90rpx; width: 360rpx; height: 360rpx; border-radius: 50%; background: rgba(255,255,255,.16); }
.hero-ring { position: absolute; bottom: -160rpx; left: -110rpx; width: 320rpx; height: 320rpx; border: 2rpx solid rgba(255,255,255,.22); border-radius: 50%; }
.eyebrow { position: relative; letter-spacing: 3rpx; color: rgba(255,255,255,.7); font-size: 22rpx; }
.title { position: relative; display: block; margin-top: 14rpx; letter-spacing: 2rpx; font-size: 52rpx; line-height: 1.2; font-weight: 800; }
.summary { position: relative; display: block; margin-top: 12rpx; letter-spacing: 1rpx; color: rgba(255,255,255,.9); font-size: 25rpx; }
.stat-card { position: relative; z-index: 2; margin: -54rpx 26rpx 0; padding: 26rpx 10rpx; border-radius: 20rpx; background: #fff; display: flex; box-shadow: 0 12rpx 32rpx rgba(20, 90, 140, .14); }
.stat-item { flex: 1; display: flex; flex-direction: column; align-items: center; gap: 6rpx; }
.stat-item + .stat-item { border-left: 1rpx solid $line-color; }
.stat-value { letter-spacing: 1rpx; color: $brand-primary; font-size: 30rpx; font-weight: 800; }
.stat-label { color: $text-body; font-size: 23rpx; }
.block-head { margin: 44rpx 34rpx 18rpx; display: flex; align-items: center; }
.head-bar { width: 7rpx; height: 28rpx; margin-right: 13rpx; border-radius: 4rpx; background: $brand-primary; }
.block-title { color: $text-title; font-size: 30rpx; font-weight: 700; }
.block-note { margin-left: auto; color: $text-muted; font-size: 22rpx; }
.steps { margin: 0 26rpx; display: flex; flex-direction: column; gap: 14rpx; }
.step { padding: 24rpx 26rpx; border-radius: 18rpx; background: #fff; display: flex; align-items: center; gap: 20rpx; box-shadow: 0 6rpx 18rpx rgba(31, 132, 196, .07); }
.step-no { width: 62rpx; height: 62rpx; flex-shrink: 0; border-radius: 18rpx; color: #fff; background: linear-gradient(140deg, #6cc7f8, $brand-primary); display: flex; align-items: center; justify-content: center; font-size: 24rpx; font-weight: 800; }
.step-copy { display: flex; flex-direction: column; gap: 6rpx; }
.step-title { color: $text-title; font-size: 28rpx; font-weight: 700; }
.step-desc { color: $text-muted; font-size: 23rpx; }
.tips { margin: 26rpx 26rpx 0; padding: 24rpx 26rpx; border-radius: 18rpx; background: #e4f3ff; display: flex; flex-direction: column; gap: 14rpx; }
.tips-title { color: $brand-deep; font-size: 24rpx; font-weight: 700; }
.chips { display: flex; flex-wrap: wrap; gap: 12rpx; }
.chip { padding: 9rpx 20rpx; border-radius: 999rpx; color: $text-body; background: rgba(255,255,255,.92); font-size: 22rpx; }
.consult-button { position: fixed; z-index: 10; left: 28rpx; right: 28rpx; bottom: calc(20rpx + env(safe-area-inset-bottom)); }
</style>