<template>
  <view class="page-shell safe-bottom">
    <view v-if="comments.length" class="summary"><text>{{ comments.length }}</text><text>条文章留言</text></view>
    <view class="comment-list">
      <view v-for="comment in comments" :key="comment.id" class="comment-card" @tap="openArticle(comment.articleId)">
        <view class="article-link"><text>{{ comment.articleTitle }}</text><text>›</text></view>
        <text class="comment-content">{{ comment.content }}</text>
        <view class="comment-meta"><text>{{ comment.name }}</text><text>{{ comment.date }}</text></view>
      </view>
    </view>
    <view v-if="!comments.length" class="empty">
      <view class="empty-mark">言</view>
      <text class="empty-title">还没有发表过留言</text>
      <text class="empty-desc">阅读文章时，可以在详情页留下你的看法</text>
      <button @tap="goNews">去看文章</button>
    </view>
  </view>
</template>

<script setup>
import { ref } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { getMyComments } from '../../api/engagement'

const comments = ref([])

async function refreshComments() {
  try {
    comments.value = await getMyComments()
  } catch (error) {
    comments.value = []
    if (uni.getStorageSync('auth-token')) {
      uni.showToast({ title: error.message || '留言加载失败', icon: 'none' })
    }
  }
}
function openArticle(articleId) { uni.navigateTo({ url: `/pages/article-detail/index?id=${articleId}` }) }
function goNews() { uni.navigateTo({ url: '/pages/news/index' }) }

onShow(refreshComments)
</script>

<style scoped lang="scss">
.page-shell {
  min-height: 100vh;
  background: $app-bg;
}

.summary {
  padding: 28rpx 30rpx;
  color: $text-muted;
  background: #fff;
  display: flex;
  align-items: baseline;
  gap: 9rpx;
  font-size: 24rpx;
}

.summary text:first-child {
  color: $brand-primary;
  font-size: 34rpx;
  font-weight: 800;
}

.comment-list {
  padding: 24rpx 24rpx 0;
}

.comment-card {
  margin-bottom: 22rpx;
  padding: 28rpx;
  border-radius: 12rpx;
  background: #fff;
  box-shadow: $card-shadow;
}

.article-link {
  padding-bottom: 20rpx;
  border-bottom: 1rpx solid $line-color;
  color: $brand-primary;
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  font-size: 25rpx;
  font-weight: 700;
}

.article-link text:first-child {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.article-link text:last-child {
  flex-shrink: 0;
  font-size: 30rpx;
  line-height: 24rpx;
}

.comment-content {
  display: block;
  padding: 26rpx 0;
  color: $text-title;
  font-size: 29rpx;
  line-height: 1.7;
  word-break: break-all;
}

.comment-meta {
  color: #899aa5;
  display: flex;
  justify-content: space-between;
  gap: 20rpx;
  font-size: 22rpx;
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