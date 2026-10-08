<template>
  <view class="page-shell safe-bottom">
    <view class="hero"
      ><text>{{ product.tank }} · {{ product.name }}</text
      ><text>{{ product.zone }} · 实时监测中</text></view
    >
    <info-card title="罐体储酒信息"
      ><view v-for="row in details" :key="row.label" class="row"
        ><text>{{ row.label }}</text
        ><text>{{ row.value }}</text></view
      ></info-card
    >
    <info-card title="酒库实时数据"
      ><view class="metrics"
        ><view v-for="item in metrics" :key="item.label"
          ><text>{{ item.value }}</text
          ><text>{{ item.label }}</text></view
        ></view
      ></info-card
    >
    <info-card title="酒缸数据模型">
      <view class="jar-stage"
        ><text class="model-status">DATA MODEL · LIVE</text
        ><view class="jar"
          ><view class="jar-neck" /><view class="jar-body"
            ><view
              class="liquid"
              :style="{ height: `${product.fill}%` }"
            /><text>酒谷</text></view
          ></view
        ><text class="level"
          >液位 {{ product.fill }}% · {{ product.tons }} 吨</text
        ></view
      >
    </info-card>
    <view class="actions"
      ><button class="outline-button" @tap="openReport">查看溯源</button
      ><button class="primary-button" @tap="openConsult">发起定制</button></view
    >
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import InfoCard from "../../components/InfoCard.vue";
import { getProduct } from "../../api/products";

const product = ref({
  id: "",
  name: "",
  tank: "",
  tankCode: "",
  tons: 0,
  fill: 0,
  zone: "",
});
const details = computed(() => [
  { label: "罐体编号", value: product.value.tankCode },
  { label: "储酒量", value: `${product.value.tons} 吨` },
  { label: "装载率", value: `${product.value.fill}%` },
  { label: "存储区域", value: product.value.zone },
  { label: "关联产品", value: product.value.name },
]);
const metrics = [
  { label: "库内温度", value: "22.5°C" },
  { label: "库内湿度", value: "68%RH" },
  { label: "通风状态", value: "正常" },
  { label: "气压", value: "101.3kPa" },
];
onLoad(async ({ id }) => {
  try {
    product.value = await getProduct(id);
  } catch (error) {
    uni.showModal({
      title: "储酒数据加载失败",
      content: error.message || "请稍后重试",
      showCancel: false,
      success: () => uni.navigateBack(),
    });
  }
});
function openReport() {
  uni.navigateTo({
    url: `/pages/trace-report/index?code=${product.value.tankCode}`,
  });
}
function openConsult() {
  uni.navigateTo({
    url: `/pages/consult/index?type=${encodeURIComponent(product.value.name)}`,
  });
}
</script>

<style scoped lang="scss">
.page-shell {
  min-height: 100vh;
  background: $app-bg;
}
.hero {
  padding: 40rpx 32rpx;
  color: #fff;
  background: linear-gradient(155deg, $brand-deep, $brand-primary);
  display: flex;
  flex-direction: column;
}
.hero text:first-child {
  font-size: 36rpx;
  line-height: 1.4;
  font-weight: 800;
}
.hero text:last-child {
  margin-top: 11rpx;
  font-size: 24rpx;
  opacity: 0.86;
}
.row {
  padding: 17rpx 0;
  border-bottom: 1rpx dashed $line-color;
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  font-size: 26rpx;
}
.row text:last-child {
  color: $text-title;
  text-align: right;
  font-weight: 600;
}
.metrics {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14rpx;
}
.metrics view {
  padding: 23rpx 8rpx;
  border-radius: 10rpx;
  background: #edf8fb;
  text-align: center;
}
.metrics text {
  display: block;
  color: $brand-primary;
  font-size: 31rpx;
  font-weight: 800;
}
.metrics text:last-child {
  margin-top: 7rpx;
  color: $text-muted;
  font-size: 22rpx;
  font-weight: 400;
}
.jar-stage {
  height: 330rpx;
  position: relative;
  border-radius: 12rpx;
  background: #092f43;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.model-status {
  position: absolute;
  top: 20rpx;
  left: 22rpx;
  color: #52db8d;
  font-size: 21rpx;
}
.jar {
  width: 190rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.jar-neck {
  width: 84rpx;
  height: 35rpx;
  border-radius: 50% 50% 12rpx 12rpx;
  background: #b98550;
}
.jar-body {
  width: 180rpx;
  height: 190rpx;
  position: relative;
  border: 5rpx solid #9b6939;
  border-radius: 22rpx 22rpx 72rpx 72rpx;
  background: #d2a570;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.jar-body text {
  position: relative;
  z-index: 2;
  color: #603b1c;
  font-size: 30rpx;
  font-weight: 800;
}
.liquid {
  width: 100%;
  position: absolute;
  left: 0;
  bottom: 0;
  background: rgba(116, 67, 31, 0.38);
}
.level {
  position: absolute;
  right: 22rpx;
  bottom: 20rpx;
  color: #8bdcf4;
  font-size: 22rpx;
}
.actions {
  margin: 26rpx 24rpx 0;
  display: flex;
  gap: 16rpx;
}
.actions button {
  flex: 1;
}
.outline-button {
  height: 88rpx;
  border: 2rpx solid $brand-primary;
  border-radius: 12rpx;
  color: $brand-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 27rpx;
  font-weight: 700;
}
</style>