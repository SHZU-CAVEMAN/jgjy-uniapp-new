<template>
  <view class="page-shell">
    <article class="article">
      <text class="category">{{ article.category }}</text>
      <text class="title">{{ article.title }}</text>
      <view class="meta"
        ><text>{{ article.author }}</text
        ><text>{{ article.date }}</text
        ><text>{{ article.reads }} 阅读</text></view
      >
      <view class="lead">{{ article.summary }}</view>
      <async-image
        class="cover"
        :src="article.image"
        mode="aspectFit"
      />
      <rich-text class="content" :nodes="article.content" />
      <text class="source">内容由酒谷酒业新闻中心发布</text>
    </article>

    <view class="engagement">
      <button :class="{ active: liked }" @tap="toggleLike">
        <text class="action-mark">赞</text><text>{{ likeCount }}</text>
      </button>
      <button :class="{ active: collected }" @tap="toggleCollect">
        <text class="action-mark">藏</text
        ><text>{{ collected ? "已收藏" : "收藏" }} {{ favoriteCount }}</text>
      </button>
      <button v-if="shareReady" open-type="share">
        <text class="action-mark">享</text><text>转发 {{ shareCount }}</text>
      </button>
      <button v-else @tap="requireShareLogin">
        <text class="action-mark">享</text><text>转发 {{ shareCount }}</text>
      </button>
    </view>

    <section class="comments">
      <view class="section-head"
        ><text>留言</text><text>{{ comments.length }} 条</text></view
      >
      <textarea
        v-model="commentText"
        maxlength="200"
        placeholder="说说你的看法…"
        :show-confirm-bar="false"
      />
      <view class="comment-submit"
        ><text>{{ commentText.length }}/200</text
        ><button :disabled="!commentText.trim()" @tap="submitComment">
          发表留言
        </button></view
      >
      <view v-if="commentsLoading" class="comment-skeleton-list">
        <t-skeleton v-for="index in 2" :key="index" theme="paragraph" :row-col="commentSkeletonRows"
          animation="gradient" loading />
      </view>
      <view v-else-if="comments.length" class="comment-list">
        <view
          v-for="comment in comments"
          :key="comment.id"
          class="comment-item"
        >
          <view class="avatar">{{ comment.name.slice(0, 1) }}</view>
          <view class="comment-body"
            ><view
              ><text class="comment-name">{{ comment.name }}</text
              ><text class="comment-date">{{ comment.date }}</text></view
            ><text class="comment-content">{{ comment.content }}</text></view
          >
        </view>
      </view>
      <view v-else-if="!commentsLoading" class="empty">还没有留言，来说两句吧</view>
    </section>
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
import { ref } from "vue";
import { onLoad, onShareAppMessage, onShareTimeline, onShow } from "@dcloudio/uni-app";
import AsyncImage from "../../components/AsyncImage.vue";
import { useContactBallDrag } from "../../utils/contactBallDrag";

const { contactBallStyle, contactBallDragged, onContactBallTouchStart, onContactBallTouchMove, onContactBallTouchEnd } =
  useContactBallDrag();
import { getCurrentMiniappUser } from "../../api/auth";
import { getNewsArticle } from "../../api/news";
import {
  createArticleComment,
  getArticleComments,
  getArticleInteractions,
  recordArticleShare,
  toggleArticleLike,
  toggleFavorite,
} from "../../api/engagement";

const article = ref({ id: "", title: "", category: "", author: "", summary: "", content: "" });
const liked = ref(false);
const collected = ref(false);
const likeCount = ref(0);
const favoriteCount = ref(0);
const shareCount = ref(0);
const shareReady = ref(false);
const commentText = ref("");
const comments = ref([]);
const commentsLoading = ref(true);
const commentSkeletonRows = [
  { width: "40%", height: "24rpx" },
  { width: "100%", height: "24rpx" },
];

async function refreshInteractions() {
  try {
    const summary = await getArticleInteractions(article.value.id);
    liked.value = summary.liked;
    collected.value = summary.collected;
    likeCount.value = summary.likeCount;
    favoriteCount.value = summary.favoriteCount;
    shareCount.value = summary.shareCount;
  } catch {
    liked.value = false;
    collected.value = false;
    likeCount.value = 0;
    favoriteCount.value = 0;
    shareCount.value = 0;
  }
}
async function toggleLike() {
  if (!uni.getStorageSync("auth-token")) {
    return uni.showToast({ title: "请先登录后点赞", icon: "none" });
  }
  try {
    const summary = await toggleArticleLike(article.value.id);
    liked.value = summary.liked;
    likeCount.value = summary.likeCount;
  } catch (error) {
    return uni.showToast({ title: error.message || "点赞失败，请稍后重试", icon: "none" });
  }
  uni.showToast({ title: liked.value ? "已点赞" : "已取消点赞", icon: "none" });
}
async function toggleCollect() {
  if (!uni.getStorageSync("auth-token")) {
    return uni.showToast({ title: "请先登录", icon: "none" });
  }
  try {
    const result = await toggleFavorite("推文", article.value.id);
    collected.value = result.collected;
    const summary = await getArticleInteractions(article.value.id);
    favoriteCount.value = summary.favoriteCount;
  } catch (error) {
    return uni.showToast({ title: error.message || "收藏操作失败", icon: "none" });
  }
  uni.showToast({
    title: collected.value ? "已收藏" : "已取消收藏",
    icon: "none",
  });
}
async function refreshComments() {
  commentsLoading.value = true;
  try {
    comments.value = await getArticleComments(article.value.id);
  } catch {
    comments.value = [];
  } finally {
    commentsLoading.value = false;
  }
}
async function submitComment() {
  if (!uni.getStorageSync("auth-token")) {
    return uni.showToast({ title: "请先登录后留言", icon: "none" });
  }
  const content = commentText.value.trim();
  if (!content) return;
  try {
    const comment = await createArticleComment(article.value.id, content);
    comments.value.unshift(comment);
    commentText.value = "";
    uni.showToast({ title: "留言成功", icon: "success" });
  } catch (error) {
    uni.showToast({ title: error.message || "留言失败，请稍后重试", icon: "none" });
  }
}
async function refreshShareAuthorization() {
  shareReady.value = false;
  if (!uni.getStorageSync("auth-token")) return;
  try {
    shareReady.value = Boolean(await getCurrentMiniappUser());
  } catch {
    shareReady.value = false;
  }
}

function requireShareLogin() {
  uni.showToast({ title: "请先登录后转发", icon: "none" });
  uni.switchTab({ url: "/pages/mine/index" });
}

onLoad(async ({ id }) => {
  try {
    article.value = await getNewsArticle(id);
    article.value.content = normalizeArticleContent(article.value.content);
    uni.setNavigationBarTitle({ title: article.value.category });
    await Promise.all([refreshInteractions(), refreshComments()]);
  } catch (error) {
    uni.showModal({
      title: "文章加载失败",
      content: error.message || "请稍后重试",
      showCancel: false,
      success: () => uni.navigateBack(),
    });
  }
  // #ifdef MP-WEIXIN
  uni.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
  // #endif
});

function normalizeArticleContent(content) {
  return String(content || "").replace(/<img\b[^>]*>/gi, (image) => {
    const source = image.match(/\sdata-src=(['"])(.*?)\1/i)?.[2];
    const normalized = image
      .replace(/<img\b/i, '<img class="article-content-image"')
      .replace(/\sdata-src=(['"])(.*?)\1/i, "")
      .replace(/\ssrc=(['"])(.*?)\1/i, ` src="${source}"`);
    return source ? normalized : image.replace(/<img\b/i, '<img class="article-content-image"');
  });
}

function logShare() {
  if (uni.getStorageSync("auth-token")) {
    recordArticleShare(article.value.id).then((summary) => {
      shareCount.value = summary.shareCount;
    }).catch(() => {});
  }
}
onShareAppMessage(() => {
  logShare();
  return {
    title: article.value.title,
    path: `/pages/article-detail/index?id=${article.value.id}`,
    ...(article.value.image ? { imageUrl: article.value.image } : {}),
  };
});
onShareTimeline(() => {
  logShare();
  return {
    title: article.value.title,
    query: `id=${article.value.id}`,
    ...(article.value.image ? { imageUrl: article.value.image } : {}),
  };
});
onShow(refreshShareAuthorization);
</script>

<style scoped lang="scss">
.page-shell {
  min-height: 100vh;
  padding-bottom: calc(42rpx + env(safe-area-inset-bottom));
  background: $app-bg;
}
.article {
  padding: 38rpx 34rpx 42rpx;
  background: #fff;
}
.category {
  display: inline-block;
  padding: 8rpx 15rpx;
  border-left: 5rpx solid $brand-primary;
  color: $brand-primary;
  background: #edf8fb;
  font-size: 22rpx;
  font-weight: 700;
}
.title {
  display: block;
  margin-top: 24rpx;
  color: $text-title;
  font-size: 44rpx;
  line-height: 1.42;
  font-weight: 800;
}
.meta {
  margin-top: 20rpx;
  display: flex;
  flex-wrap: wrap;
  gap: 18rpx;
  color: #8697a4;
  font-size: 22rpx;
}
.lead {
  margin-top: 32rpx;
  padding: 26rpx 28rpx;
  border-left: 5rpx solid #b9d9e4;
  color: #526574;
  background: #f4f8fa;
  font-size: 26rpx;
  line-height: 1.75;
}
.cover {
  width: 100%;
  height: 360rpx;
  margin-top: 30rpx;
  border-radius: 8rpx;
  background: #e9f2f5;
}
:deep(.content) {
  display: block;
  margin-top: 30rpx;
  color: $text-body;
  font-size: 29rpx;
  line-height: 1.95;
  text-align: justify;
}
:deep(.content .article-content-image) {
  max-width: 100%;
  height: auto;
}
.content {
  display: block;
  display: block;
  margin-top: 30rpx;
  color: $text-body;
  font-size: 29rpx;
  line-height: 1.95;
  text-align: justify;
}
.source {
  display: block;
  margin-top: 44rpx;
  color: #91a1ad;
  font-size: 22rpx;
}
.engagement {
  margin-top: 20rpx;
  padding: 26rpx 30rpx;
  background: #fff;
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16rpx;
}
.engagement button {
  height: 94rpx;
  border: 1rpx solid $line-color;
  border-radius: 10rpx;
  color: #536573;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 11rpx;
  font-size: 26rpx;
}
.engagement button.active {
  border-color: $brand-primary;
  color: $brand-primary;
  background: #edf8fb;
}
.action-mark {
  width: 48rpx;
  height: 48rpx;
  border-radius: 50%;
  color: #fff;
  background: #6d8290;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22rpx;
  font-weight: 700;
}
.engagement button.active .action-mark {
  background: $brand-primary;
}
.comments {
  margin-top: 18rpx;
  padding: 30rpx 34rpx;
  background: #fff;
}
.section-head {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  color: $text-title;
  font-size: 31rpx;
  font-weight: 800;
}
.section-head text:last-child {
  color: $text-muted;
  font-size: 22rpx;
  font-weight: 400;
}
.comments textarea {
  width: 100%;
  height: 190rpx;
  margin-top: 26rpx;
  padding: 24rpx;
  border: 1rpx solid $line-color;
  border-radius: 10rpx;
  color: $text-body;
  background: #f7f9fa;
  font-size: 26rpx;
  line-height: 1.6;
}
.comment-submit {
  margin-top: 14rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.comment-submit > text {
  color: #95a3ad;
  font-size: 21rpx;
}
.comment-submit button {
  width: 176rpx;
  height: 72rpx;
  border-radius: 8rpx;
  color: #fff;
  background: $brand-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25rpx;
  font-weight: 700;
}
.comment-submit button[disabled] {
  color: #94a3b8;
  background: #e6ebee;
}
.comment-list {
  margin-top: 30rpx;
  border-top: 1rpx solid $line-color;
}
.comment-item {
  padding: 26rpx 0;
  border-bottom: 1rpx solid $line-color;
  display: flex;
  gap: 18rpx;
}
.avatar {
  width: 72rpx;
  height: 72rpx;
  flex-shrink: 0;
  border-radius: 50%;
  color: #fff;
  background: $brand-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 27rpx;
  font-weight: 700;
}
.comment-body {
  flex: 1;
  min-width: 0;
}
.comment-body > view {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.comment-name {
  color: $text-title;
  font-size: 25rpx;
  font-weight: 700;
}
.comment-date {
  color: #95a3ad;
  font-size: 21rpx;
}
.comment-content {
  display: block;
  margin-top: 12rpx;
  color: $text-body;
  font-size: 26rpx;
  line-height: 1.7;
  word-break: break-all;
}
.empty {
  padding: 54rpx 0 26rpx;
  color: $text-muted;
  text-align: center;
  font-size: 24rpx;
}
</style>