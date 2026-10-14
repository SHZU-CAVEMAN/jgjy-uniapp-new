<template>
  <view class="page-shell">
    <view class="visual"
      ><image
        :src="imageSource"
        mode="aspectFill"
        lazy-load
        @error="imageSource = '/static/logo.png'"
      /><view class="visual-label">泸州产区 · 年份原酒</view></view
    >
    <view class="headline"
      ><text class="name">{{ product.name }}</text
      ><view class="tags"
        ><text>{{ typeLabel }}</text
        ><text>{{ product.year }}陈藏</text><text>泸州产区</text></view
      ><view class="price"
        >¥{{ product.price }}<text> / 吨（支持少量定制）</text></view
      ></view
    >
    <info-card title="产品规格"
      ><view class="spec"
        ><text>原料</text><text>高粱、小麦、大米、糯米、玉米</text></view
      ><view class="spec"><text>酒精度</text><text>53%vol</text></view
      ><view class="spec"
        ><text>容量规格</text><text>500ml / 2.5L / 坛装定制</text></view
      ><view class="spec"
        ><text>品质特征</text><text>{{ product.description }}</text></view
      ></info-card
    >
    <info-card title="储酒数据 · 可溯源" @tap="openStorage"
      ><view class="spec"
        ><text>存储区域</text><text>{{ product.zone }} ›</text></view
      ><view class="spec"
        ><text>对应罐体</text><text>{{ product.tank }} ›</text></view
      ><view class="storage-link"
        >查看酒库实时数据与罐体详情 <text>›</text></view
      ></info-card
    >
    <info-card title="资质与荣誉"
      ><view class="certificates"
        ><view>质检报告</view><view>荣誉证书</view><view>溯源凭证</view></view
      ></info-card
    >
    <view class="actions">
      <button
        class="collect-button"
        :class="{ active: collected }"
        @tap="toggleCollect"
      >
        <text class="collect-icon">{{ collected ? "★" : "☆" }}</text
        ><text>{{ collected ? "已收藏" : "收藏" }}</text>
      </button>
      <button class="outline-button" @tap="openTrace">查看溯源</button>
      <button class="primary-button" @tap="openConsult">发起咨询</button>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad } from "@dcloudio/uni-app";
import InfoCard from "../../components/InfoCard.vue";
import { downloadProductImage, getProduct } from "../../api/products";
import { getMyFavorites, toggleFavorite } from "../../api/engagement";

const product = ref({
  id: "",
  type: "",
  name: "",
  year: "",
  price: "",
  description: "",
  tank: "",
  tankCode: "",
  tons: 0,
  fill: 0,
  zone: "",
});
const imageSource = ref("/static/logo.png");
const collected = ref(false);
const typeLabel = computed(
  () =>
    ({ nong: "浓香型", jiang: "酱香型", qing: "清香型" }[product.value.type])
);
onLoad(async ({ id }) => {
  try {
    product.value = await getProduct(id);
    imageSource.value = await downloadProductImage(
      product.value.detailImageUrl || product.value.thumbnailUrl
    );
    await refreshCollected();
  } catch (error) {
    uni.showModal({
      title: "产品加载失败",
      content: error.message || "请稍后重试",
      showCancel: false,
      success: () => uni.navigateBack(),
    });
  }
});
async function refreshCollected() {
  if (!uni.getStorageSync("auth-token")) return;
  try {
    const favorites = await getMyFavorites();
    collected.value = favorites.some(
      (item) => item.type === "产品" && String(item.targetId) === String(product.value.id),
    );
  } catch {
    collected.value = false;
  }
}
async function toggleCollect() {
  if (!uni.getStorageSync("auth-token")) {
    return uni.showToast({ title: "请先登录", icon: "none" });
  }
  try {
    const result = await toggleFavorite("产品", product.value.id);
    collected.value = result.collected;
  } catch (error) {
    return uni.showToast({ title: error.message || "收藏操作失败", icon: "none" });
  }
  uni.showToast({
    title: collected.value ? "已收藏" : "已取消收藏",
    icon: "none",
  });
}
function openStorage() {
  uni.navigateTo({ url: `/pages/storage-detail/index?id=${product.value.id}` });
}
function openTrace() {
  uni.navigateTo({
    url: `/pages/trace-report/index?code=${encodeURIComponent(
      product.value.tankCode
    )}`,
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
  padding-bottom: calc(144rpx + env(safe-area-inset-bottom));
  background: $app-bg;
}
.visual {
  width: 100%;
  height: 420rpx;
  position: relative;
  overflow: hidden;
  background: #d7e6ea;
}
.visual image {
  width: 100%;
  height: 100%;
  display: block;
}
.visual-label {
  position: absolute;
  bottom: 24rpx;
  right: 28rpx;
  padding: 10rpx 16rpx;
  border-radius: 7rpx;
  color: #fff;
  background: rgba(7, 59, 82, 0.78);
  font-size: 22rpx;
}
.headline {
  padding: 32rpx;
  border-radius: 16rpx 16rpx 0 0;
  background: #fff;
}
.name {
  color: $text-title;
  font-size: 38rpx;
  line-height: 1.4;
  font-weight: 800;
}
.tags {
  margin-top: 12rpx;
  display: flex;
  gap: 10rpx;
}
.tags text {
  padding: 6rpx 12rpx;
  border-radius: 6rpx;
  color: $brand-primary;
  background: #e6f5fa;
  font-size: 22rpx;
}
.price {
  margin-top: 18rpx;
  color: #b82d45;
  font-size: 38rpx;
  font-weight: 800;
}
.price text {
  color: $text-muted;
  font-size: 23rpx;
  font-weight: 400;
}
.spec {
  padding: 17rpx 0;
  border-bottom: 1rpx dashed $line-color;
  display: flex;
  justify-content: space-between;
  gap: 24rpx;
  color: $text-body;
  font-size: 26rpx;
}
.spec:last-child {
  border: 0;
}
.spec text:last-child {
  color: $text-title;
  text-align: right;
  font-weight: 600;
}
.storage-link {
  margin-top: 20rpx;
  padding: 20rpx 22rpx;
  border-radius: 10rpx;
  color: $brand-primary;
  background: #edf8fb;
  font-size: 24rpx;
  display: flex;
  justify-content: space-between;
}
.certificates {
  display: flex;
  gap: 12rpx;
}
.certificates view {
  flex: 1;
  height: 96rpx;
  border-radius: 10rpx;
  color: $brand-primary;
  background: #edf8fb;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23rpx;
}
.actions {
  height: calc(116rpx + env(safe-area-inset-bottom));
  padding: 14rpx 24rpx calc(14rpx + env(safe-area-inset-bottom));
  position: fixed;
  z-index: 10;
  left: 0;
  right: 0;
  bottom: 0;
  border-top: 1rpx solid $line-color;
  background: #fff;
  display: flex;
  gap: 14rpx;
  box-shadow: 0 -8rpx 24rpx rgba(15, 46, 60, 0.08);
}
.actions .outline-button,
.actions .primary-button {
  flex: 1;
  height: 88rpx;
}
.collect-button {
  width: 96rpx;
  height: 88rpx;
  flex-shrink: 0;
  color: $text-muted;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 20rpx;
}
.collect-button.active {
  color: #b7791f;
}
.collect-icon {
  height: 42rpx;
  font-size: 40rpx;
  line-height: 40rpx;
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