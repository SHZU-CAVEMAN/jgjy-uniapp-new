<template>
  <view class="page-shell safe-bottom">
    <view v-if="records.length && !loading" class="list-head"><text>我的溯源</text><text>共 {{ records.length }} 条</text></view>
    <view class="record-list">
      <template v-if="loading">
        <view v-for="index in 3" :key="index" class="record-skeleton">
          <t-skeleton theme="paragraph" :row-col="recordSkeletonRows" animation="gradient" loading />
        </view>
      </template>
      <view v-for="record in records" :key="record.id" class="record-card" @tap="openReport(record)">
        <view class="record-head"><text>{{ record.code || '待生成溯源码' }}</text><text class="status">查看报告 ›</text></view>
        <view class="record-row"><text>定制产品</text><text>{{ record.productName || '-' }}</text></view>
        <view class="record-row"><text>定制日期</text><text>{{ record.sealedDate || '-' }}</text></view>
        <view class="record-row"><text>原料</text><text>{{ record.rawMaterial || '-' }}</text></view>
        <view class="record-row"><text>存储</text><text>{{ record.stockName || record.stockCode || '-' }}</text></view>
        <view class="record-row"><text>出库量</text><text>{{ record.outboundTons ? `${record.outboundTons} 吨` : '-' }}</text></view>
        <view v-if="record.remark" class="remark"><text>备注</text><text>{{ record.remark }}</text></view>
      </view>
    </view>
    <view v-if="!loading && !records.length" class="empty">
      <view class="empty-mark">溯</view>
      <text class="empty-title">暂无溯源记录</text>
      <text class="empty-desc">定制完成后，专属溯源码与报告会显示在这里</text>
      <button @tap="goConsult">发起定制咨询</button>
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
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMyTraces } from '../../api/trace'
import { useContactBallDrag } from '../../utils/contactBallDrag'
import { usePageShare } from '../../utils/pageShare'

const { contactBallStyle, contactBallDragged, onContactBallTouchStart, onContactBallTouchMove, onContactBallTouchEnd } =
  useContactBallDrag()

usePageShare({ title: '我的溯源', path: '/pages/my-traces/index' })

const records = ref([])
const loading = ref(true)
const recordSkeletonRows = [
  { width: '64%', height: '30rpx' },
  { width: '100%', height: '24rpx' },
  { width: '82%', height: '24rpx' },
]

function openReport(record) {
  if (!record.code) {
    return uni.showToast({ title: '该记录还没有溯源码', icon: 'none' })
  }
  uni.navigateTo({
    url: `/pages/trace-report/index?code=${encodeURIComponent(record.code)}`,
  })
}
function goConsult() {
  uni.navigateTo({ url: '/pages/consult/index' })
}
onShow(async () => {
  if (!uni.getStorageSync('auth-token')) {
    records.value = []
    loading.value = false
    return
  }
  loading.value = true
  try {
    records.value = await getMyTraces()
  } catch (error) {
    records.value = []
    uni.showToast({ title: error.message || '溯源记录加载失败', icon: 'none' })
  } finally {
    loading.value = false
  }
})
</script>

<style scoped lang="scss">
.page-shell {
  min-height: 100vh;
  background: $app-bg;
}

.list-head {
  padding: 30rpx;
  background: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-head text:first-child {
  color: $text-title;
  font-size: 32rpx;
  font-weight: 800;
}

.list-head text:last-child {
  color: $text-muted;
  font-size: 23rpx;
}

.record-list {
  padding: 24rpx 24rpx 0;
}

.record-card {
  margin-bottom: 22rpx;
  padding: 30rpx;
  border-radius: 12rpx;
  background: #fff;
  box-shadow: $card-shadow;
}

.record-skeleton {
  margin-bottom: 22rpx;
  padding: 30rpx;
  border-radius: 12rpx;
  background: #fff;
  box-shadow: $card-shadow;
}

.record-head {
  padding-bottom: 22rpx;
  border-bottom: 1rpx solid $line-color;
  color: $text-title;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16rpx;
  font-size: 30rpx;
  font-weight: 800;
  letter-spacing: 1rpx;
}

.status {
  flex-shrink: 0;
  padding: 8rpx 15rpx;
  border-radius: 6rpx;
  color: #1f7a52;
  background: #e6f6ee;
  font-size: 21rpx;
  font-weight: 700;
  letter-spacing: 0;
}

.record-row {
  margin-top: 20rpx;
  display: flex;
  justify-content: space-between;
  gap: 28rpx;
  color: $text-muted;
  font-size: 25rpx;
}

.record-row text:last-child {
  color: $text-body;
  text-align: right;
}

.remark {
  margin-top: 22rpx;
  padding: 22rpx 24rpx;
  border-radius: 9rpx;
  background: #f3f7f8;
  display: flex;
  flex-direction: column;
  gap: 12rpx;
}

.remark text:first-child {
  color: $text-muted;
  font-size: 22rpx;
}

.remark text:last-child {
  color: $text-body;
  font-size: 25rpx;
  line-height: 1.65;
  word-break: break-all;
}

.empty {
  padding: 180rpx 30rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.empty-mark {
  width: 92rpx;
  height: 92rpx;
  border-radius: 50%;
  color: $brand-primary;
  background: #e5f3f7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 34rpx;
  font-weight: 800;
}

.empty-title {
  margin-top: 26rpx;
  color: $text-title;
  font-size: 28rpx;
  font-weight: 700;
}

.empty-desc {
  margin-top: 12rpx;
  color: $text-muted;
  font-size: 23rpx;
}

.empty button {
  width: 240rpx;
  height: 80rpx;
  margin-top: 32rpx;
  border: 1rpx solid $brand-primary;
  border-radius: 10rpx;
  color: $brand-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25rpx;
  font-weight: 700;
}
</style>
