<template>
  <view class="page-shell safe-bottom">
    <view class="report-head"><text>酒体溯源报告</text><text>{{ traceCode }}</text><text v-if="report" class="verified">已验证</text></view>
    <view v-if="loading" class="state">加载中…</view>
    <view v-else-if="errorText" class="state">{{ errorText }}</view>
    <template v-else>
      <info-card title="溯源信息">
        <view class="row"><text>定制客户</text><text>{{ report.customer || '-' }}</text></view>
        <view class="row"><text>定制产品</text><text>{{ report.productName || '-' }}</text></view>
        <view class="row"><text>定制日期</text><text>{{ report.sealedDate || '-' }}</text></view>
        <view v-if="report.remark" class="row"><text>备注</text><text>{{ report.remark }}</text></view>
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
    </template>
    <button class="primary-button" @tap="goConsult">发起咨询</button>
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
import InfoCard from '../../components/InfoCard.vue'
import { getTraceReport } from '../../api/trace'
import { useContactBallDrag } from '../../utils/contactBallDrag'

const { contactBallStyle, contactBallDragged, onContactBallTouchStart, onContactBallTouchMove, onContactBallTouchEnd } =
  useContactBallDrag()

const traceCode = ref('')
const report = ref(null)
const loading = ref(true)
const errorText = ref('')
const chain = ref([])

onLoad(({ code }) => {
  traceCode.value = code ? decodeURIComponent(code) : ''
  loadReport()
})

async function loadReport() {
  if (!traceCode.value) {
    loading.value = false
    errorText.value = '缺少溯源码'
    return
  }
  loading.value = true
  errorText.value = ''
  try {
    const data = await getTraceReport(traceCode.value)
    report.value = data
    chain.value = [
      { label: '原料', value: data.rawMaterial || '-' },
      { label: '酿造', value: data.productionDate || '-' },
      { label: '存储', value: data.stockName || data.stockCode || '-' },
      { label: '质检', value: data.inspectionNo || '-' },
    ]
  } catch (error) {
    report.value = null
    chain.value = []
    errorText.value = error.message || '溯源记录加载失败'
  } finally {
    loading.value = false
  }
}

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

.state {
  margin: 40rpx 24rpx;
  padding: 40rpx;
  border-radius: 16rpx;
  color: $text-muted;
  background: #fff;
  text-align: center;
  font-size: 26rpx;
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