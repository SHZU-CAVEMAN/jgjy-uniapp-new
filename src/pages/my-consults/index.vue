<template>
  <view class="page-shell safe-bottom">
    <view v-if="records.length" class="list-head"><text>咨询记录</text><text>共 {{ records.length }} 条</text></view>
    <view class="record-list">
      <view v-for="record in records" :key="record.id" class="record-card">
        <view class="record-head"><text>{{ record.type }}</text><text class="status">{{ record.status }}</text></view>
        <view class="record-row"><text>提交时间</text><text>{{ record.date }}</text></view>
        <view class="record-row"><text>联系人</text><text>{{ record.name }} · {{ maskPhone(record.phone) }}</text></view>
        <view v-if="record.region" class="record-row"><text>所在地区</text><text>{{ record.region }}</text></view>
        <view v-if="record.budget" class="record-row"><text>预算金额</text><text>{{ record.budget }}</text></view>
        <view v-if="record.remark" class="remark"><text>需求说明</text><text>{{ record.remark }}</text></view>
      </view>
    </view>
    <view v-if="!records.length" class="empty">
      <view class="empty-mark">询</view>
      <text class="empty-title">暂无咨询记录</text>
      <text class="empty-desc">提交需求后，可在这里查看咨询内容与状态</text>
      <button @tap="goConsult">发起咨询</button>
    </view>
    <button v-else class="primary-button create-button" @tap="goConsult">再次发起咨询</button>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMyConsultations } from '../../api/consultations'

const records = ref([])

function maskPhone(phone = '') {
  if (phone.length !== 11) return phone
  return `${phone.slice(0, 3)}****${phone.slice(-4)}`
}
function goConsult() { uni.navigateTo({ url: '/pages/consult/index' }) }
onShow(async () => {
  try {
    records.value = await getMyConsultations()
  } catch (error) {
    records.value = []
    uni.showToast({ title: error.message || '咨询记录加载失败', icon: 'none' })
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

.record-head {
  padding-bottom: 22rpx;
  border-bottom: 1rpx solid $line-color;
  color: $text-title;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30rpx;
  font-weight: 800;
}

.status {
  padding: 8rpx 15rpx;
  border-radius: 6rpx;
  color: #a36514;
  background: #fff4dc;
  font-size: 21rpx;
  font-weight: 700;
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

.create-button {
  margin: 26rpx 28rpx 0;
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
  width: 200rpx;
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