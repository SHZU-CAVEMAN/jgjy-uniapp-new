<template>
  <view class="page-shell safe-bottom" @touchstart="onTouchStart" @touchend="onTouchEnd" @touchcancel="onTouchCancel">
    <view class="segment">
      <view :class="{ active: segment === 'trace' }" @tap="changeSegment('trace')">酒体溯源</view>
      <view :class="{ active: segment === 'storage' }" @tap="changeSegment('storage')">储酒数据</view>
    </view>

    <template v-if="segment === 'trace'">
    <view class="hero"
      ><text class="hero-title">酒体溯源</text
      ><text class="hero-subtitle"
        >扫码或输入溯源码，查看每一滴原酒的完整旅程</text
      ></view
    >
    <view class="query-card">
      <input
        v-model.trim="traceCode"
        maxlength="40"
        placeholder="请输入溯源码 / 批次号"
        confirm-type="search"
        @confirm="queryTrace"
      />
      <button class="scan-button" aria-label="扫码" @tap="scan">扫码</button>
      <button class="query-button" @tap="queryTrace">查询</button>
    </view>
    <view class="preview" @tap="openReport('JGY-2026-0915-088')"
      ><text class="preview-title">示例报告预览</text
      ><text>原料产地 → 酿造批次 → 存储罐体 → 质检报告 → 定制信息</text
      ><text class="preview-link">查看完整报告 ›</text></view
    >
    <section-title title="溯源流程" />
    <view class="steps"
      ><view v-for="(step, index) in steps" :key="step"
        ><view class="step-number">{{ index + 1 }}</view
        ><text>{{ step }}</text
        ><text v-if="index < steps.length - 1" class="step-arrow">→</text></view
      ></view
    >
    <!-- <view class="feature"><view class="feature-icon">码</view><view><text class="feature-title">一罐一码 · 全程可查</text><text class="feature-copy">每笔定制订单生成独立溯源码，多笔订单自动关联。</text></view></view> -->
    <button class="primary-button" @tap="goConsult">
      立即发起咨询 <text>获取专属溯源码 ›</text>
    </button>
    </template>

    <template v-else>
      <view class="summary">
        <view><text>11,440</text><text>总库存(吨)</text></view>
        <view><text>76</text><text>酒体品种</text></view>
        <view><text>3</text><text>储存区域</text></view>
      </view>
      <section-title title="罐体列表" />
      <view class="tank-list">
        <template v-if="loadingProducts">
          <view v-for="index in 3" :key="index" class="tank tank-skeleton">
            <t-skeleton theme="avatar" animation="gradient" loading />
            <view class="tank-skeleton-copy">
              <t-skeleton theme="paragraph" :row-col="tankSkeletonRows" animation="gradient" loading />
            </view>
          </view>
        </template>
        <view v-else v-for="product in storageProducts" :key="product.id" class="tank" @tap="openStorage(product)">
          <view class="tank-mark">{{ product.zone.includes('钢') ? '钢' : '陶' }}</view>
          <view class="tank-content"><text class="tank-name">{{ product.tank }} · {{ product.name }}</text><text
              class="tank-meta">{{ product.zone }} · 实时监测中</text>
            <view class="progress">
              <view :style="{ width: `${product.fill}%` }" />
            </view>
          </view>
          <view class="tank-value"><text>{{ product.tons }}</text><text>吨</text></view>
        </view>
      </view>
    </template>
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
import { computed, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import SectionTitle from "../../components/SectionTitle.vue";
import { scanTraceCode } from "../../utils/platform";
import { getProducts } from "../../api/products";
import { createHorizontalSwipeHandlers } from "../../utils/horizontalSwipe";
import { useContactBallDrag } from "../../utils/contactBallDrag";

const { contactBallStyle, contactBallDragged, onContactBallTouchStart, onContactBallTouchMove, onContactBallTouchEnd } =
  useContactBallDrag();
const segment = ref("trace");
const products = ref([]);
const loadingProducts = ref(true);
const tankSkeletonRows = [
  { width: "70%", height: "28rpx" },
  { width: "48%", height: "22rpx" },
];
const storageProducts = computed(() => products.value.slice(0, 6));

async function loadProducts() {
  loadingProducts.value = true;
  try {
    const data = await getProducts({ page: 1, pageSize: 100 });
    products.value = data.items;
  } catch {
    products.value = [];
  } finally {
    loadingProducts.value = false;
  }
}

function changeSegment(value) {
  segment.value = value;
}
const { onTouchStart, onTouchEnd, onTouchCancel } = createHorizontalSwipeHandlers(
  () => {
    if (segment.value === "trace") changeSegment("storage");
  },
  () => {
    if (segment.value === "storage") changeSegment("trace");
  },
  () => contactBallDragged.value,
);
function openStorage(product) {
  uni.navigateTo({ url: `/pages/storage-detail/index?id=${product.id}` });
}

onShow(() => {
  const storedSegment = uni.getStorageSync("trace-segment");
  if (storedSegment) {
    segment.value = storedSegment;
    uni.removeStorageSync("trace-segment");
  }
  loadProducts();
});

const traceCode = ref("JGY-2026-0915-088");
const steps = ["原料溯源", "酿造批次", "储酒罐体", "质检报告"];

function scan() {
  scanTraceCode((result) => {
    traceCode.value = result;
    queryTrace();
  });
}
function queryTrace() {
  if (!traceCode.value)
    return uni.showToast({ title: "请输入溯源码", icon: "none" });
  openReport(traceCode.value);
}
function openReport(code) {
  uni.navigateTo({
    url: `/pages/trace-report/index?code=${encodeURIComponent(code)}`,
  });
}
function goConsult() {
  uni.navigateTo({ url: "/pages/consult/index?type=定制酒" });
}
</script>

<style scoped lang="scss">
.page-shell {
  min-height: 100vh;
  background: $app-bg;
}
.hero {
  padding: 40rpx 32rpx 62rpx;
  color: #fff;
  background: linear-gradient(155deg, $brand-deep, $brand-primary);
  display: flex;
  flex-direction: column;
}
.hero-title {
  font-size: 42rpx;
  font-weight: 800;
}
.hero-subtitle {
  margin-top: 10rpx;
  font-size: 25rpx;
  opacity: 0.9;
}
.query-card {
  margin: -36rpx 24rpx 0;
  padding: 24rpx;
  position: relative;
  display: flex;
  align-items: center;
  gap: 14rpx;
  border-radius: 16rpx;
  background: #fff;
  box-shadow: 0 12rpx 36rpx rgba(8, 126, 170, 0.16);
}
.query-card input {
  flex: 1;
  min-width: 0;
  font-size: 26rpx;
}
.scan-button,
.query-button {
  height: 76rpx;
  padding: 0 22rpx;
  border-radius: 10rpx;
  display: flex;
  align-items: center;
  font-size: 25rpx;
}
.scan-button {
  color: $brand-primary;
  background: #e6f5fa;
}
.query-button {
  color: #fff;
  background: $brand-primary;
}
.preview,
.feature {
  margin: 24rpx 24rpx 0;
  padding: 30rpx;
  border-radius: 16rpx;
  background: #fff;
  box-shadow: $card-shadow;
  display: flex;
  flex-direction: column;
  color: $text-body;
  font-size: 25rpx;
  line-height: 1.75;
}
.preview-title {
  margin-bottom: 12rpx;
  color: $text-title;
  font-size: 30rpx;
  font-weight: 700;
}
.preview-link {
  margin-top: 8rpx;
  color: $brand-primary;
  font-weight: 600;
}
.steps {
  margin: 0 24rpx;
  padding: 32rpx 10rpx;
  border-radius: 16rpx;
  background: #fff;
  display: flex;
  justify-content: space-around;
  box-shadow: $card-shadow;
}
.steps > view {
  width: 24%;
  position: relative;
  text-align: center;
  color: $text-body;
  font-size: 23rpx;
}
.step-number {
  width: 64rpx;
  height: 64rpx;
  margin: 0 auto 14rpx;
  border-radius: 50%;
  color: #fff;
  background: $brand-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 700;
}
.step-arrow {
  position: absolute;
  top: 14rpx;
  right: -14rpx;
  color: $brand-primary;
  font-size: 30rpx;
  font-weight: 700;
  line-height: 1;
}
.segment {
  margin: 20rpx 24rpx 0;
  padding: 8rpx;
  border-radius: 14rpx;
  background: #e6edf1;
  display: flex;
}
.segment view {
  flex: 1;
  padding: 17rpx 0;
  border-radius: 10rpx;
  color: #64748b;
  text-align: center;
  font-size: 27rpx;
  font-weight: 600;
}
.segment .active {
  color: #fff;
  background: $brand-primary;
}
.summary {
  margin: 24rpx 24rpx 0;
  display: flex;
  gap: 16rpx;
}
.summary view {
  flex: 1;
  padding: 26rpx 8rpx;
  border-radius: 16rpx;
  background: #fff;
  text-align: center;
  box-shadow: $card-shadow;
}
.summary text {
  display: block;
  color: $brand-primary;
  font-size: 34rpx;
  font-weight: 800;
}
.summary text:last-child {
  margin-top: 7rpx;
  color: $text-muted;
  font-size: 22rpx;
  font-weight: 400;
}
.tank-list {
  padding: 22rpx 24rpx 0;
}
.tank-skeleton {
  margin-bottom: 22rpx;
  padding: 26rpx;
  border: 1rpx solid $line-color;
  border-radius: 16rpx;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 24rpx;
  box-shadow: $card-shadow;
}
.tank-skeleton-copy {
  flex: 1;
  min-width: 0;
}
.tank {
  margin-bottom: 22rpx;
  padding: 26rpx;
  border-radius: 16rpx;
  background: #fff;
  display: flex;
  align-items: center;
  gap: 22rpx;
  box-shadow: $card-shadow;
}
.tank-mark {
  width: 88rpx;
  height: 88rpx;
  border-radius: 14rpx;
  color: #fff;
  background: #9a6a3c;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26rpx;
  font-weight: 700;
}
.tank-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.tank-name {
  color: $text-title;
  font-size: 27rpx;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.tank-meta {
  margin-top: 7rpx;
  color: $text-muted;
  font-size: 22rpx;
}
.progress {
  height: 8rpx;
  margin-top: 12rpx;
  border-radius: 4rpx;
  background: #e7eef2;
  overflow: hidden;
}
.progress view {
  height: 100%;
  border-radius: 4rpx;
  background: $brand-primary;
}
.tank-value {
  text-align: right;
}
.tank-value text {
  display: block;
  color: $text-title;
  font-size: 32rpx;
  font-weight: 800;
}
.tank-value text:last-child {
  color: $text-muted;
  font-size: 21rpx;
  font-weight: 400;
}
.feature {
  flex-direction: row;
  align-items: center;
  gap: 20rpx;
}
.feature-icon {
  width: 78rpx;
  height: 78rpx;
  flex-shrink: 0;
  border-radius: 14rpx;
  color: #fff;
  background: #24835f;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 27rpx;
  font-weight: 700;
}
.feature-title,
.feature-copy {
  display: block;
}
.feature-title {
  color: $text-title;
  font-size: 28rpx;
  font-weight: 700;
}
.feature-copy {
  margin-top: 7rpx;
  color: $text-muted;
  font-size: 23rpx;
}
.primary-button {
  margin: 26rpx 24rpx 0;
}
.primary-button text {
  margin-left: 10rpx;
  font-size: 23rpx;
  font-weight: 400;
}
</style>