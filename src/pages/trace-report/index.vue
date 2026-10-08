<template>
  <view class="page-shell safe-bottom">
    <view class="report-head"><text>酒体溯源报告</text><text>{{ traceCode }}</text><text class="verified">已验证</text></view>
    <info-card title="定制信息">
      <view class="row"><text>定制客户</text><text>张先生（尾号 6688）</text></view>
      <view class="row"><text>定制产品</text><text>八年窖藏浓香原酒</text></view>
      <view class="row"><text>封坛日期</text><text>2026-09-15</text></view>
      <view class="row"><text>封坛寄语</text><text>岁月沉淀 · 情谊长存</text></view>
    </info-card>
    <info-card title="溯源链路">
      <view class="chain">
        <view v-for="(item, index) in chain" :key="item.label" class="chain-item">
          <view class="chain-main">
            <view class="chain-marker">
              <view class="chain-icon">{{ index + 1 }}</view><text v-if="index < chain.length - 1"
                class="chain-arrow">↓</text>
            </view><text class="chain-label">{{ item.label }}</text>
          </view><text class="chain-value">{{ item.value }}</text>
        </view>
      </view>
    </info-card>

    <!-- <info-card title="储酒数据">
      <view class="metrics">
        <view><text>11,440</text><text>酒库总量(吨)</text></view>
        <view><text>3,280</text><text>陶坛区(吨)</text></view>
        <view><text>B-12</text><text>对应罐体</text></view>
      </view>
      <view class="chart">
        <view v-for="height in chart" :key="height" :style="{ height: `${height}%` }" />
      </view><text class="chart-caption">近七日库内温湿度稳定</text>
    </info-card> -->
    <button class="primary-button" @tap="goConsult">基于此产品发起定制</button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onLoad } from '@dcloudio/uni-app'
import InfoCard from '../../components/InfoCard.vue'

const traceCode = ref('JGY-2026-0915-088')
const chain = [{ label: '原料', value: '泸州糯高粱' }, { label: '酿造', value: '批次 2026-031' }, { label: '存储', value: '陶坛 B-12' }, { label: '质检', value: '合格 QZ-0921' }]
const chart = [38, 54, 46, 68, 61, 76, 70]
onLoad(({ code }) => { if (code) traceCode.value = decodeURIComponent(code) })
function goConsult() { uni.navigateTo({ url: '/pages/consult/index?type=定制酒' }) }
</script>

<style scoped lang="scss">
.page-shell {
  min-height: 100vh;
  background: $app-bg;
}

.report-head {
  padding: 40rpx 32rpx;
  color: #fff;
  background: linear-gradient(155deg, $brand-deep, $brand-primary);
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}

.report-head>text:first-child {
  font-size: 38rpx;
  font-weight: 800;
}

.report-head>text:nth-child(2) {
  margin-top: 14rpx;
  padding: 8rpx 18rpx;
  border-radius: 20rpx;
  background: rgba(255, 255, 255, .14);
  font-size: 24rpx;
  letter-spacing: 1rpx;
}

.verified {
  margin-top: 14rpx;
  color: #7ce6a6;
  font-size: 23rpx;
}

.row {
  padding: 17rpx 0;
  border-bottom: 1rpx dashed $line-color;
  display: flex;
  justify-content: space-between;
  gap: 22rpx;
  font-size: 25rpx;
}

.row text:last-child {
  color: $text-title;
  text-align: right;
  font-weight: 600;
}

.chain {
  display: flex;
  flex-direction: column;
}

.chain-item {
  min-height: 104rpx;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 24rpx;
}

.chain-item:last-child {
  min-height: 72rpx;
}

.chain-main {
  min-width: 190rpx;
  display: flex;
  align-items: center;
  gap: 18rpx;
}

.chain-marker {
  width: 72rpx;
  height: 104rpx;
  position: relative;
  flex-shrink: 0;
}

.chain-item:last-child .chain-marker {
  height: 72rpx;
}

.chain-icon {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  color: #fff;
  background: $brand-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 700;
}

.chain-arrow {
  position: absolute;
  top: 70rpx;
  left: 50%;
  transform: translateX(-50%);
  color: $brand-primary;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1;
}

.chain-label {
  color: $text-title;
  font-size: 27rpx;
  font-weight: 700;
}

.chain-value {
  padding-top: 18rpx;
  color: $text-body;
  text-align: right;
  font-size: 25rpx;
  line-height: 1.5;
  font-weight: 600;
}

.metrics {
  display: flex;
  gap: 12rpx;
}

.metrics view {
  flex: 1;
  padding: 22rpx 5rpx;
  border-radius: 10rpx;
  background: #edf8fb;
  text-align: center;
}

.metrics text {
  display: block;
  color: $brand-primary;
  font-size: 30rpx;
  font-weight: 800;
}

.metrics text:last-child {
  margin-top: 7rpx;
  color: $text-muted;
  font-size: 20rpx;
  font-weight: 400;
}

.chart {
  height: 120rpx;
  margin-top: 24rpx;
  padding: 12rpx 18rpx 0;
  border-radius: 10rpx;
  background: #edf8fb;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
}

.chart view {
  width: 9%;
  border-radius: 5rpx 5rpx 0 0;
  background: $brand-primary;
}

.chart-caption {
  display: block;
  margin-top: 10rpx;
  color: $text-muted;
  text-align: center;
  font-size: 21rpx;
}

.primary-button {
  margin: 26rpx 24rpx 0;
}
</style>