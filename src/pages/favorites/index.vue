<template>
  <view class="page-shell safe-bottom" @touchstart="onTouchStart" @touchend="onTouchEnd" @touchcancel="onTouchCancel">
    <view class="tabs">
      <button
        :class="{ active: activeTab === 'products' }"
        @tap="activeTab = 'products'"
      >
        产品 <text>{{ favoriteProducts.length }}</text>
      </button>
      <button
        :class="{ active: activeTab === 'articles' }"
        @tap="activeTab = 'articles'"
      >
        文章 <text>{{ favoriteArticles.length }}</text>
      </button>
    </view>

    <view class="favorites-swipe-area">
    <view v-if="activeTab === 'products'" class="content product-list">
      <product-card
        v-for="product in favoriteProducts"
        :key="product.id"
        :product="product"
        @select="openProduct"
      />
      <view v-if="!favoriteProducts.length" class="empty">
        <view class="empty-mark">藏</view>
        <text class="empty-title">暂无收藏的产品</text>
        <text class="empty-desc">浏览产品详情时，点击底部收藏即可添加</text>
        <button @tap="goProducts">去看产品</button>
      </view>
    </view>

    <view v-else class="content article-list">
      <view
        v-for="article in favoriteArticles"
        :key="article.id"
        class="article-item"
        @tap="openArticle(article)"
      >
        <view class="article-copy">
          <text class="article-category">{{ article.category }}</text>
          <text class="article-title">{{ article.title }}</text>
          <text class="article-summary">{{ article.summary }}</text>
          <view class="article-meta"
            ><text>{{ article.date }}</text
            ><text>{{ article.reads }} 阅读</text></view
          >
        </view>
        <image :src="article.image || '/static/logo.png'" mode="aspectFill" />
      </view>
      <view v-if="!favoriteArticles.length" class="empty">
        <view class="empty-mark">藏</view>
        <text class="empty-title">暂无收藏的文章</text>
        <text class="empty-desc">阅读文章时，点击收藏即可在这里查看</text>
        <button @tap="goNews">去看文章</button>
      </view>
    </view>
    </view>
  </view>
</template>

<script setup>
import { ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import ProductCard from "../../components/ProductCard.vue";
import { getMyFavorites } from "../../api/engagement";
import { createHorizontalSwipeHandlers } from "../../utils/horizontalSwipe";

const activeTab = ref("products");
const favoriteProducts = ref([]);
const favoriteArticles = ref([]);
const { onTouchStart, onTouchEnd, onTouchCancel } = createHorizontalSwipeHandlers(
  () => { activeTab.value = "articles" },
  () => { activeTab.value = "products" },
);

async function refreshFavorites() {
  if (!uni.getStorageSync("auth-token")) {
    favoriteProducts.value = [];
    favoriteArticles.value = [];
    return;
  }
  try {
    const favorites = await getMyFavorites();
    favoriteProducts.value = favorites
      .filter((favorite) => favorite.type === "产品" && favorite.item)
      .map((favorite) => favorite.item);
    favoriteArticles.value = favorites
      .filter((favorite) => favorite.type === "推文" && favorite.item)
      .map((favorite) => favorite.item);
  } catch {
    favoriteProducts.value = [];
    favoriteArticles.value = [];
  }
}
function openProduct(product) {
  uni.navigateTo({ url: `/pages/product-detail/index?id=${product.id}` });
}
function openArticle(article) {
  uni.navigateTo({ url: `/pages/article-detail/index?id=${article.id}` });
}
function goProducts() {
  uni.switchTab({ url: "/pages/products/index" });
}
function goNews() {
  uni.navigateTo({ url: "/pages/news/index" });
}

onShow(refreshFavorites);
</script>

<style scoped lang="scss">
.page-shell {
  min-height: 100vh;
  background: $app-bg;
}
.tabs {
  padding: 20rpx 24rpx;
  position: sticky;
  z-index: 5;
  top: 0;
  border-bottom: 1rpx solid $line-color;
  background: #fff;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12rpx;
}
.tabs button {
  height: 80rpx;
  border-radius: 10rpx;
  color: $text-muted;
  background: #eef2f4;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9rpx;
  font-size: 27rpx;
  font-weight: 600;
}
.tabs button.active {
  color: #fff;
  background: $brand-primary;
}
.tabs text {
  min-width: 34rpx;
  height: 34rpx;
  padding: 0 8rpx;
  border-radius: 17rpx;
  color: inherit;
  background: rgba(255, 255, 255, 0.22);
  font-size: 20rpx;
  line-height: 34rpx;
}
.tabs button:not(.active) text {
  background: #dde5e9;
}
.content {
  padding: 24rpx 24rpx 0;
}
.article-item {
  margin-bottom: 22rpx;
  padding: 28rpx;
  border-radius: 12rpx;
  background: #fff;
  display: flex;
  gap: 24rpx;
  box-shadow: $card-shadow;
}
.article-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.article-category {
  color: $brand-primary;
  font-size: 22rpx;
  font-weight: 700;
}
.article-title {
  margin-top: 9rpx;
  color: $text-title;
  font-size: 30rpx;
  line-height: 1.45;
  font-weight: 700;
}
.article-summary {
  margin-top: 12rpx;
  color: $text-muted;
  font-size: 24rpx;
  line-height: 1.55;
  display: -webkit-box;
  overflow: hidden;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.article-meta {
  margin-top: auto;
  padding-top: 16rpx;
  color: #8f9fa9;
  display: flex;
  gap: 16rpx;
  font-size: 21rpx;
}
.article-item image {
  width: 190rpx;
  height: 170rpx;
  flex-shrink: 0;
  border-radius: 10rpx;
  background: #e8f2f5;
}
.empty {
  padding: 150rpx 20rpx 40rpx;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}
.empty-mark {
  width: 104rpx;
  height: 104rpx;
  border-radius: 50%;
  color: $brand-primary;
  background: #e5f3f7;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 38rpx;
  font-weight: 800;
}
.empty-title {
  margin-top: 28rpx;
  color: $text-title;
  font-size: 30rpx;
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