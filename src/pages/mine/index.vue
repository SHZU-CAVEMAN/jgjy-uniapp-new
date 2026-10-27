<template>
  <view class="page-shell safe-bottom">
    <view class="profile">
      <view v-if="user.avatarUrl" class="avatar avatar-image" @tap="openProfileDialog">
        <async-image :src="user.avatarUrl" mode="aspectFill" lazy-load @error="handleUserAvatarError" />
      </view>
      <view v-else class="avatar fallback" @tap="openProfileDialog">{{
        user.loggedIn ? (user.nickname || "微").slice(0, 1) : "访"
      }}</view>
      <view class="profile-copy" @tap="openProfileDialog"><text class="profile-name">{{
        user.loggedIn ? user.nickname || "微信用户" : "未登录"
          }}</text><text class="profile-subtitle">{{
            user.loggedIn
              ? `已绑定 ${maskedPhone} · 点击编辑资料`
              : "授权手机号后查看咨询与溯源记录"
          }}</text></view>
      <button v-if="user.loggedIn" class="login-button" @tap="logout">
        退出
      </button>
      <!-- #ifdef MP-WEIXIN -->
      <button v-if="!user.loggedIn" class="login-button" open-type="getPhoneNumber" :loading="loginLoading"
        :disabled="loginLoading" @getphonenumber="handlePhoneNumber">
        手机号登录
      </button>
      <!-- #endif -->
      <!-- #ifndef MP-WEIXIN -->
      <button v-if="!user.loggedIn" class="login-button" @tap="showWechatOnly">
        手机号登录
      </button>
      <!-- #endif -->
    </view>

    <view class="quick-grid">
      <view v-for="item in quickEntries" :key="item.label" class="quick-item" @tap="openEntry(item)">
        <view class="quick-icon">{{ item.short }}</view><text>{{ item.label }}</text><text v-if="item.count > 0"
          class="badge">{{ item.count }}</text>
      </view>
    </view>

    <view class="menu-card">
      <view class="menu-row" @tap="goConsult">
        <view class="menu-icon">咨</view><text>发起咨询</text><text class="arrow">›</text>
      </view>
      <view class="menu-row" @tap="goAbout">
        <view class="menu-icon">企</view><text>关于我们</text><text class="arrow">›</text>
      </view>
      <button class="menu-row contact" open-type="contact">
        <view class="menu-icon">客</view><text>在线客服</text><text class="arrow">›</text>
      </button>
    </view>
    <view class="contact-card">
      <text>联系电话：0830-6660008</text>
      <text>公司地址：泸州市龙马潭区安宁大道三段 20 号</text>
    </view>

    <view v-if="profileDialogVisible" class="profile-dialog-mask" @tap="closeProfileDialog">
      <view class="profile-dialog" @tap.stop>
        <text class="profile-dialog-title">完善个人资料</text>
        <text class="profile-dialog-tip">头像和昵称由你主动选择，可随时修改</text>
        <button class="avatar-picker" open-type="chooseAvatar" @chooseavatar="handleChooseAvatar">
          <async-image v-if="profileDraft.avatarUrl" class="profile-avatar-image" :src="profileDraft.avatarUrl"
            mode="aspectFill" lazy-load />
          <view v-else class="avatar-picker-placeholder">选择头像</view>
        </button>
        <input class="nickname-input" type="nickname" :value="profileDraft.nickname" maxlength="64"
          placeholder="填写微信昵称" @input="profileDraft.nickname = $event.detail.value" />
        <view class="profile-dialog-actions">
          <button class="profile-dialog-button secondary" :disabled="profileSaving" @tap="closeProfileDialog">稍后</button>
          <button class="profile-dialog-button primary" :loading="profileSaving" :disabled="profileSaving"
            @tap="saveProfile">保存</button>
        </view>
      </view>
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
import { computed, reactive, ref } from "vue";
import { onShow } from "@dcloudio/uni-app";
import AsyncImage from "../../components/AsyncImage.vue";
import { supportsBaseLibrary } from "../../utils/platform";
import { useContactBallDrag } from "../../utils/contactBallDrag";

const { contactBallStyle, contactBallDragged, onContactBallTouchStart, onContactBallTouchMove, onContactBallTouchEnd } =
  useContactBallDrag();
import {
  clearAvatarCache,
  getCurrentMiniappUser,
  loginWithPhoneCode,
  updateMiniappProfile,
  uploadMiniappAvatar,
} from "../../api/auth";
import { getMyConsultations } from "../../api/consultations";
import { getMyComments, getMyFavorites } from "../../api/engagement";

const cachedProfile = uni.getStorageSync("user-profile") || {};
const hasAuthToken = Boolean(uni.getStorageSync("auth-token"));
const user = reactive({
  loggedIn: false,
  nickname: "",
  avatarUrl: "",
  phoneNumber: "",
  ...cachedProfile,
  loggedIn: hasAuthToken && Boolean(cachedProfile.phoneNumber),
});
const loginLoading = ref(false);
const avatarRepairing = ref(false);
const profileDialogVisible = ref(false);
const profileSaving = ref(false);
const profileDraft = reactive({
  nickname: "",
  avatarUrl: "",
  avatarTempPath: "",
});
const maskedPhone = computed(() => {
  const phone = user.phoneNumber || "";
  return phone.length === 11
    ? `${phone.slice(0, 3)}****${phone.slice(-4)}`
    : phone;
});
const quickEntries = reactive([
  { label: "我的收藏", short: "藏", count: 0, route: "/pages/favorites/index" },
  { label: "我的咨询", short: "询", count: 0, route: "/pages/my-consults/index" },
  { label: "我的留言", short: "言", count: 0, route: "/pages/my-comments/index" },
  { label: "我的溯源", short: "溯", trace: true },
]);
function persistUser() {
  uni.setStorageSync("user-profile", { ...user });
}
function logout() {
  profileDialogVisible.value = false;
  Object.assign(user, {
    loggedIn: false,
    nickname: "",
    avatarUrl: "",
    phoneNumber: "",
  });
  uni.removeStorageSync("auth-token");
  clearAvatarCache();
  quickEntries.forEach((item) => { item.count = 0; });
  persistUser();
}
async function handlePhoneNumber(event) {
  if (!supportsBaseLibrary("2.21.2"))
    return uni.showModal({
      title: "微信版本过低",
      content: "请升级微信后再授权手机号。",
      showCancel: false,
    });
  const { code, errMsg = "" } = event.detail || {};
  if (!code) {
    if (!errMsg.includes("cancel") && !errMsg.includes("deny"))
      uni.showToast({ title: "手机号授权失败，请重试", icon: "none" });
    return;
  }
  loginLoading.value = true;
  try {
    const account = await loginWithPhoneCode(code);
    Object.assign(user, {
      loggedIn: true,
      nickname: account.nickname || account.nickName || "微信用户",
      avatarUrl: account.avatarUrl || "",
      phoneNumber: account.phoneNumber,
    });
    if (account.token) uni.setStorageSync("auth-token", account.token);
    persistUser();
    await refreshRemoteCounts();
    uni.showToast({ title: "登录成功", icon: "success" });
    if (isProfileIncomplete(account)) openProfileDialog();
  } catch (error) {
    uni.showToast({
      title: error.message || "登录失败，请稍后重试",
      icon: "none",
      duration: 2500,
    });
  } finally {
    loginLoading.value = false;
  }
}
function isProfileIncomplete(profile) {
  const hasNickname = Boolean(profile.nickname && profile.nickname !== "微信用户");
  const hasAvatar = Boolean(profile.avatarRemoteUrl || profile.avatarUrl);
  return !hasNickname || !hasAvatar;
}
function openProfileDialog() {
  if (!user.loggedIn) return;
  profileDraft.nickname = user.nickname === "微信用户" ? "" : user.nickname;
  profileDraft.avatarUrl = user.avatarUrl;
  profileDraft.avatarTempPath = "";
  profileDialogVisible.value = true;
}
function closeProfileDialog() {
  if (!profileSaving.value) profileDialogVisible.value = false;
}
function handleChooseAvatar(event) {
  const avatarUrl = event.detail?.avatarUrl || "";
  if (!avatarUrl) return;
  profileDraft.avatarTempPath = avatarUrl;
  profileDraft.avatarUrl = avatarUrl;
}
async function handleUserAvatarError() {
  if (avatarRepairing.value || !user.loggedIn) return;
  avatarRepairing.value = true;
  clearAvatarCache();
  try {
    const account = await getCurrentMiniappUser();
    if (account) {
      Object.assign(user, account, { loggedIn: true });
      persistUser();
    }
  } finally {
    avatarRepairing.value = false;
  }
}
async function saveProfile() {
  if (profileSaving.value) return;
  const nickname = profileDraft.nickname.trim();
  if (!nickname) {
    return uni.showToast({ title: "请填写昵称", icon: "none" });
  }
  profileSaving.value = true;
  try {
    if (profileDraft.avatarTempPath) {
      const avatarProfile = await uploadMiniappAvatar(profileDraft.avatarTempPath);
      Object.assign(user, avatarProfile, { loggedIn: true });
    }
    const profile = await updateMiniappProfile(nickname);
    Object.assign(user, profile, { loggedIn: true });
    persistUser();
    profileDialogVisible.value = false;
    uni.showToast({ title: "资料保存成功", icon: "success" });
  } catch (error) {
    uni.showToast({
      title: error.message || "资料保存失败",
      icon: "none",
      duration: 2500,
    });
  } finally {
    profileSaving.value = false;
  }
}
function showWechatOnly() {
  uni.showToast({ title: "请在微信小程序中授权登录", icon: "none" });
}
function requireLogin() {
  if (user.loggedIn) return true;
  uni.showToast({ title: "请先登录", icon: "none" });
  return false;
}
// 打开入口
function openEntry(item) {
  if (!requireLogin()) return;
  if (item.route) return uni.navigateTo({ url: item.route });
  if (item.trace) return uni.switchTab({ url: "/pages/trace/index" });
}
function goConsult() {
  uni.navigateTo({ url: "/pages/consult/index" });
}
function goAbout() {
  uni.navigateTo({ url: "/pages/about/index" });
}
async function refreshRemoteCounts() {
  if (!uni.getStorageSync("auth-token")) {
    quickEntries.forEach((item) => { item.count = 0; });
    return;
  }
  const results = await Promise.all([
    getMyFavorites().then((value) => value, () => null),
    getMyConsultations().then((value) => value, () => null),
    getMyComments().then((value) => value, () => null),
  ]);
  if (results[0] !== null) quickEntries[0].count = results[0].length;
  if (results[1] !== null) quickEntries[1].count = results[1].length;
  if (results[2] !== null) quickEntries[2].count = results[2].length;
}
async function restoreLogin() {
  if (!uni.getStorageSync("auth-token")) return;
  try {
    const account = await getCurrentMiniappUser();
    if (!account) return;
    Object.assign(user, account, { loggedIn: true });
    persistUser();
  } catch {
    logout();
  }
}
onShow(async () => {
  await restoreLogin();
  await refreshRemoteCounts();
});
</script>

<style scoped lang="scss">
.page-shell {
  min-height: 100vh;
  background: $app-bg;
}

.profile {
  padding: 50rpx 34rpx;
  color: #fff;
  background: linear-gradient(155deg, $brand-deep, $brand-primary);
  display: flex;
  align-items: center;
  gap: 24rpx;
}

.avatar {
  width: 112rpx;
  height: 112rpx;
  flex-shrink: 0;
  border: 4rpx solid rgba(255, 255, 255, 0.7);
  border-radius: 50%;
}

.avatar-image {
  overflow: hidden;
}

.avatar.fallback {
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: 700;
}

.profile-copy {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
}

.profile-name {
  font-size: 36rpx;
  font-weight: 800;
}

.profile-subtitle {
  margin-top: 9rpx;
  font-size: 23rpx;
  opacity: 0.86;
}

.login-button {
  padding: 14rpx 24rpx;
  border-radius: 30rpx;
  color: $brand-deep;
  background: #fff;
  font-size: 24rpx;
  font-weight: 700;
}

.quick-grid {
  padding: 26rpx 24rpx 0;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16rpx;
}

.quick-item {
  min-width: 0;
  padding: 28rpx 4rpx;
  position: relative;
  border-radius: 16rpx;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: $card-shadow;
  font-size: 23rpx;
}

.quick-icon {
  width: 68rpx;
  height: 68rpx;
  margin-bottom: 13rpx;
  border-radius: 50%;
  color: #fff;
  background: $brand-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 25rpx;
  font-weight: 700;
}

.badge {
  min-width: 32rpx;
  height: 32rpx;
  padding: 0 7rpx;
  position: absolute;
  top: 12rpx;
  right: 12rpx;
  border-radius: 16rpx;
  color: #fff;
  background: #ba3047;
  text-align: center;
  font-size: 19rpx;
  line-height: 32rpx;
}

.menu-card,
.contact-card {
  margin: 26rpx 24rpx 0;
  padding: 0 28rpx;
  border-radius: 16rpx;
  background: #fff;
  box-shadow: $card-shadow;
}

.menu-row {
  width: 100%;
  height: 100rpx;
  border-bottom: 1rpx solid $line-color;
  display: flex;
  align-items: center;
  gap: 20rpx;
  color: $text-body;
  font-size: 27rpx;
  text-align: left;
}

.menu-row:last-child {
  border: 0;
}

.menu-icon {
  width: 60rpx;
  height: 60rpx;
  border-radius: 10rpx;
  color: $brand-primary;
  background: #e6f5fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24rpx;
  font-weight: 700;
}

.arrow {
  margin-left: auto;
  color: #b2bec7;
  font-size: 34rpx;
}

.contact-card {
  padding: 28rpx;
  display: flex;
  flex-direction: column;
  gap: 14rpx;
  color: $text-body;
  font-size: 24rpx;
  line-height: 1.65;
}

.profile-dialog-mask {
  position: fixed;
  z-index: 20;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  padding: calc(var(--status-bar-height) + 80rpx) 44rpx 80rpx;
  background: rgba(18, 31, 37, 0.55);
  display: flex;
  align-items: flex-start;
  justify-content: center;
}

.profile-dialog {
  width: 100%;
  padding: 42rpx 36rpx 34rpx;
  border-radius: 16rpx;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.profile-dialog-title {
  color: $text-title;
  font-size: 34rpx;
  font-weight: 800;
}

.profile-dialog-tip {
  margin-top: 12rpx;
  color: $text-muted;
  font-size: 23rpx;
}

.avatar-picker {
  width: 152rpx;
  height: 152rpx;
  padding: 0;
  margin: 34rpx 0 30rpx;
  border: 2rpx solid $line-color;
  border-radius: 50%;
  background: #f1f7f5;
  overflow: hidden;
}

.avatar-picker .profile-avatar-image,
.avatar-picker-placeholder {
  width: 100%;
  height: 100%;
}

.avatar-picker-placeholder {
  color: $brand-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 23rpx;
}

.nickname-input {
  width: 100%;
  height: 88rpx;
  padding: 0 24rpx;
  border: 1rpx solid $line-color;
  border-radius: 8rpx;
  color: $text-title;
  background: #fff;
  font-size: 27rpx;
}

.profile-dialog-actions {
  width: 100%;
  margin-top: 32rpx;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 18rpx;
}

.profile-dialog-button {
  height: 82rpx;
  border-radius: 8rpx;
  font-size: 27rpx;
  line-height: 82rpx;
}

.profile-dialog-button.secondary {
  color: $text-body;
  background: #edf2f0;
}

.profile-dialog-button.primary {
  color: #fff;
  background: $brand-primary;
}
</style>
