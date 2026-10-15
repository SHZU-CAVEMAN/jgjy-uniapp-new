<template>
  <view class="page-shell safe-bottom" @touchstart="onTouchStart" @touchend="onTouchEnd" @touchcancel="onTouchCancel">
    <scroll-view class="categories" scroll-x :scroll-into-view="activeCategoryAnchor" :show-scrollbar="false"
      ><view class="category-row"
        ><text
          v-for="category in newsCategories"
          :key="category"
          :id="`news-category-${newsCategories.indexOf(category)}`"
          :class="{ active: activeCategory === category }"
          @tap="activeCategory = category"
          >{{ category }}</text
        ></view
      ></scroll-view
    >
    <view class="news-swipe-area">
    <view v-if="loading" class="empty">正在加载文章…</view>
    <view v-else-if="!filteredNews.length" class="empty">暂无已发布文章</view>
    <view v-else class="news-list">
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
  </view>
</template>

<script setup>
import { computed, ref } from "vue";
import { onLoad, onPullDownRefresh } from "@dcloudio/uni-app";
import { getNews } from "../../api/news";
import { parseCompatibleDate } from "../../utils/platform";
import { createHorizontalSwipeHandlers } from "../../utils/horizontalSwipe";

const newsItems = ref([]);
const activeCategory = ref("");
const loading = ref(false);
const newsCategories = computed(() => [...new Set(newsItems.value.map((item) => item.category))]);
const activeCategoryIndex = computed(() => newsCategories.value.indexOf(activeCategory.value));
const activeCategoryAnchor = computed(() =>
  activeCategoryIndex.value >= 0 ? `news-category-${activeCategoryIndex.value}` : "",
);
const filteredNews = computed(() =>
  newsItems.value
    .filter((item) => item.category === activeCategory.value)
    .sort(
      (left, right) =>
        parseCompatibleDate(right.date) - parseCompatibleDate(left.date)
    )
);
function moveCategory(direction) {
  const nextIndex = activeCategoryIndex.value + direction;
  if (nextIndex < 0 || nextIndex >= newsCategories.value.length) return;
  activeCategory.value = newsCategories.value[nextIndex];
}
const { onTouchStart, onTouchEnd, onTouchCancel } = createHorizontalSwipeHandlers(
  () => moveCategory(1),
  () => moveCategory(-1),
);

async function loadNews() {
  loading.value = true;
  try {
    const data = await getNews({ page: 1, pageSize: 100 });
    newsItems.value = data.items;
    if (!newsCategories.value.includes(activeCategory.value)) {
      activeCategory.value = newsCategories.value[0] || "";
    }
  } catch (error) {
    uni.showToast({ title: error.message || "文章加载失败", icon: "none" });
  } finally {
    loading.value = false;
  }
}

function openNews(item) {
  uni.navigateTo({ url: `/pages/article-detail/index?id=${item.id}` });
}
onLoad(loadNews);
onPullDownRefresh(async () => {
  await loadNews();
  uni.stopPullDownRefresh();
});
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