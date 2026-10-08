<template>
  <view class="page-shell safe-bottom">
    <scroll-view class="categories" scroll-x :show-scrollbar="false"
      ><view class="category-row"
        ><text
          v-for="category in newsCategories"
          :key="category"
          :class="{ active: activeCategory === category }"
          @tap="activeCategory = category"
          >{{ category }}</text
        ></view
      ></scroll-view
    >
    <view class="news-list">
      <view
        v-for="item in filteredNews"
        :key="item.id"
        class="news-item"
        @tap="openNews(item)"
      >
        <view class="news-copy"
          ><text class="news-title">{{ item.title }}</text
          ><text class="news-summary">{{ item.summary }}</text
          ><view class="meta"
            ><text>{{ item.date }}</text
            ><text>{{ item.reads }} 阅读</text></view
          ></view
        >
        <image
          class="news-image"
          :src="item.image || '/static/logo.png'"
          mode="aspectFill"
          lazy-load
          @error="item.image = '/static/logo.png'"
        />
      </view>
      <text class="footer">内容由企业新闻中心统一发布</text>
    </view>
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onPullDownRefresh, onUnload } from "@dcloudio/uni-app";
import { news, newsCategories } from "../../data/catalog";
import { parseCompatibleDate } from "../../utils/platform";

const activeCategory = ref(newsCategories[0]);
let refreshTimer = null;
const filteredNews = computed(() =>
  news
    .filter((item) => item.category === activeCategory.value)
    .sort(
      (left, right) =>
        parseCompatibleDate(right.date) - parseCompatibleDate(left.date)
    )
);

function openNews(item) {
  uni.navigateTo({ url: `/pages/article-detail/index?id=${item.id}` });
}
onPullDownRefresh(() => {
  clearTimeout(refreshTimer);
  refreshTimer = setTimeout(() => uni.stopPullDownRefresh(), 350);
});
onUnload(() => clearTimeout(refreshTimer));
</script>

<style scoped lang="scss">
.page-shell {
  min-height: 100vh;
  background: $app-bg;
}
.categories {
  width: 100%;
  white-space: nowrap;
  background: #fff;
  border-bottom: 1rpx solid $line-color;
}
.category-row {
  display: inline-flex;
  padding: 0 16rpx;
}
.category-row text {
  padding: 28rpx 22rpx 24rpx;
  position: relative;
  color: #64748b;
  font-size: 27rpx;
}
.category-row .active {
  color: $brand-primary;
  font-weight: 700;
}
.category-row .active::after {
  content: "";
  height: 5rpx;
  position: absolute;
  left: 22rpx;
  right: 22rpx;
  bottom: 0;
  border-radius: 3rpx;
  background: $brand-primary;
}
.news-list {
  padding: 24rpx 24rpx 0;
}
.news-item {
  margin-bottom: 22rpx;
  padding: 28rpx;
  border-radius: 16rpx;
  background: #fff;
  display: flex;
  gap: 24rpx;
  box-shadow: $card-shadow;
}
.news-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}
.news-title {
  color: $text-title;
  font-size: 30rpx;
  line-height: 1.45;
  font-weight: 700;
}
.news-summary {
  margin-top: 13rpx;
  color: $text-muted;
  font-size: 24rpx;
  line-height: 1.6;
  display: -webkit-box;
  overflow: hidden;
  line-clamp: 2;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
}
.meta {
  margin-top: auto;
  padding-top: 16rpx;
  display: flex;
  gap: 16rpx;
  color: #94a3ad;
  font-size: 21rpx;
}
.meta text:last-child {
  color: $brand-primary;
}
.news-image {
  width: 190rpx;
  height: 168rpx;
  flex-shrink: 0;
  border-radius: 12rpx;
  background: #e8f2f5;
}
.footer {
  display: block;
  padding: 24rpx 0 36rpx;
  color: $text-muted;
  text-align: center;
  font-size: 22rpx;
}
</style>