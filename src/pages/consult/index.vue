<template>
  <view
    class="page-shell safe-bottom"
    :style="{ paddingBottom: `${keyboardHeight ? 24 : 48}rpx` }"
  >
    <view class="hero"
      ><text>发起咨询</text
      ><text>填写基本信息，企业顾问将在一个工作日内联系您</text></view
    >
    <view class="form-card">
      <view class="form-row"
        ><text class="label required">客户名称</text
        ><input
          v-model.trim="form.name"
          maxlength="30"
          placeholder="请输入您的名称"
      /></view>
      <view class="form-row"
        ><text class="label required">联系电话</text
        ><input
          v-model.trim="form.phone"
          type="number"
          maxlength="11"
          placeholder="请输入手机号码"
      /></view>
      <picker
        :range="demandTypes"
        range-key="name"
        :value="demandIndex"
        @change="changeDemand"
        ><view class="form-row"
          ><text class="label required">需求类型</text
          ><text :class="['value', { placeholder: demandIndex < 0 }]">{{
            demandIndex < 0 ? "请选择需求类型" : demandTypes[demandIndex]?.name
          }}</text
          ><text class="arrow">›</text></view
        ></picker
      >
      <view class="form-row"
        ><text class="label">所在地区</text
        ><input
          v-model.trim="form.region"
          maxlength="50"
          placeholder="请输入省市地区（选填）"
      /></view>
      <view class="form-row"
        ><text class="label">预算金额</text
        ><input
          v-model.trim="form.budget"
          maxlength="30"
          placeholder="如 10 万元（选填）"
      /></view>
      <view class="textarea-row"
        ><text class="label">需求说明</text
        ><textarea
          v-model.trim="form.remark"
          maxlength="300"
          auto-height
          placeholder="请简要描述产品、数量或交付周期"
        /><text class="counter">{{ form.remark.length }}/300</text></view
      >
    </view>
    <text class="privacy"
      >提交即表示您同意企业顾问仅将以上信息用于本次业务咨询。</text
    >
    <button
      class="primary-button"
      :loading="submitting"
      :disabled="submitting"
      @tap="submit"
    >
      提交咨询
    </button>
    <button class="contact-button" open-type="contact">直接联系在线客服</button>
  </view>
</template>

<script setup>
import { reactive, ref } from "vue";
import { onLoad, onUnload } from "@dcloudio/uni-app";
import { getCurrentMiniappUser } from "../../api/auth";
import { getNeedCategories, submitConsultation } from "../../api/consultations";
import { supportsBaseLibrary } from "../../utils/platform";

const demandTypes = ref([]);
const demandIndex = ref(-1);
const keyboardHeight = ref(0);
const submitting = ref(false);
const form = reactive({
  name: "",
  phone: "",
  region: "",
  budget: "",
  remark: "",
});
const keyboardHandler = ({ height }) => {
  keyboardHeight.value = height;
};

function fillLoggedInPhone() {
  const cachedProfile = uni.getStorageSync("user-profile") || {};
  const cachedPhone = cachedProfile.phoneNumber || "";
  if (cachedPhone) form.phone = cachedPhone;
  if (cachedProfile.nickname && cachedProfile.nickname !== "微信用户")
    form.name = cachedProfile.nickname;
  if (!uni.getStorageSync("auth-token")) return;
  getCurrentMiniappUser()
    .then((profile) => {
      if (profile?.phoneNumber && (!form.phone || form.phone === cachedPhone)) {
        form.phone = profile.phoneNumber;
      }
      if (profile?.nickname && profile.nickname !== "微信用户" && !form.name) {
        form.name = profile.nickname;
      }
    })
    .catch(() => {});
}

async function loadNeedCategories(type) {
  try {
    demandTypes.value = await getNeedCategories();
    if (!type) return;
    const decodedType = decodeURIComponent(type);
    const index = demandTypes.value.findIndex(
      (item) =>
        decodedType.includes(item.name) ||
        decodedType.includes(item.name.slice(0, 2))
    );
    if (index >= 0) demandIndex.value = index;
  } catch (error) {
    uni.showToast({ title: error.message || "需求分类加载失败", icon: "none" });
  }
}

onLoad(({ type }) => {
  fillLoggedInPhone();
  loadNeedCategories(type);
  if (supportsBaseLibrary("2.7.0") && uni.onKeyboardHeightChange)
    uni.onKeyboardHeightChange(keyboardHandler);
});

onUnload(() => {
  if (uni.offKeyboardHeightChange) uni.offKeyboardHeightChange(keyboardHandler);
});

function changeDemand(event) {
  demandIndex.value = Number(event.detail.value);
}
async function submit() {
  if (!form.name)
    return uni.showToast({ title: "请输入客户名称", icon: "none" });
  if (!/^1\d{10}$/.test(form.phone))
    return uni.showToast({ title: "请输入正确的手机号", icon: "none" });
  if (demandIndex.value < 0)
    return uni.showToast({ title: "请选择需求类型", icon: "none" });
  if (!uni.getStorageSync("auth-token"))
    return uni.showToast({ title: "请先登录后提交", icon: "none" });
  submitting.value = true;
  try {
    await submitConsultation({
      name: form.name,
      phone: form.phone,
      categoryId: demandTypes.value[demandIndex.value].id,
      region: form.region,
      budget: form.budget,
      remark: form.remark,
    });
    uni.showModal({
      title: "提交成功",
      content: "企业顾问将在一个工作日内与您联系。",
      showCancel: false,
      success: () => uni.navigateBack(),
    });
  } catch (error) {
    uni.showToast({
      title: error.message || "提交失败，请稍后重试",
      icon: "none",
      duration: 2500,
    });
  } finally {
    submitting.value = false;
  }
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
  font-size: 38rpx;
  font-weight: 800;
}
.hero text:last-child {
  margin-top: 10rpx;
  font-size: 24rpx;
  opacity: 0.88;
}
.form-card {
  margin: 24rpx 24rpx 0;
  padding: 0 30rpx;
  border-radius: 16rpx;
  background: #fff;
  box-shadow: $card-shadow;
}
.form-row {
  min-height: 104rpx;
  border-bottom: 1rpx solid $line-color;
  display: flex;
  align-items: center;
  gap: 18rpx;
}
.label {
  width: 160rpx;
  flex-shrink: 0;
  color: $text-title;
  font-size: 26rpx;
  font-weight: 600;
}
.label.required::before {
  content: "*";
  margin-right: 5rpx;
  color: #b82d45;
}
.form-row input {
  flex: 1;
  min-width: 0;
  text-align: right;
  font-size: 26rpx;
}
.value {
  flex: 1;
  color: $text-body;
  text-align: right;
  font-size: 26rpx;
}
.placeholder {
  color: #a8b1b8;
}
.arrow {
  color: #a8b1b8;
  font-size: 32rpx;
}
.textarea-row {
  padding: 28rpx 0;
  position: relative;
  display: flex;
  align-items: flex-start;
}
.textarea-row textarea {
  flex: 1;
  min-height: 150rpx;
  font-size: 25rpx;
  line-height: 1.65;
}
.counter {
  position: absolute;
  right: 0;
  bottom: 12rpx;
  color: $text-muted;
  font-size: 21rpx;
}
.privacy {
  display: block;
  margin: 20rpx 28rpx 0;
  color: $text-muted;
  font-size: 22rpx;
  line-height: 1.6;
}
.primary-button {
  margin: 24rpx 24rpx 0;
}
.contact-button {
  margin: 18rpx 24rpx 0;
  height: 92rpx;
  border: 2rpx solid $brand-primary;
  border-radius: 14rpx;
  color: $brand-primary;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 27rpx;
}
</style>