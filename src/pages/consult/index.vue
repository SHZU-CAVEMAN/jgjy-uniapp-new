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
      <view class="customer-type-row">
        <text class="field-label required">客户类型</text>
        <t-radio-group
          :value="form.customerType"
          borderless
          custom-style="display:flex;flex:1;align-items:center;justify-content:space-between;gap:12rpx"
          @change="changeCustomerType"
        >
          <t-radio
            v-for="type in customerTypes"
            :key="type"
            :block="false"
            :label="type"
            :value="type"
          />
        </t-radio-group>
      </view>
      <view class="form-row">
        <t-input v-model:value="form.name" class="form-input" borderless maxlength="30" placeholder="请输入您的名称">
          <template #label><text class="field-label required">客户名称</text></template>
        </t-input>
      </view>
      <view class="form-row">
        <t-input v-model:value="form.phone" class="form-input" borderless type="number" maxlength="11" placeholder="请输入手机号码">
          <template #label><text class="field-label required">联系电话</text></template>
        </t-input>
      </view>
      <view class="form-row demand-row" @tap="demandPickerVisible = true">
        <text class="field-label required">需求类型</text>
        <text class="demand-value" :class="{ 'is-placeholder': !selectedDemandName }">{{ selectedDemandName || '请选择需求类型' }}</text>
        <t-icon name="chevron-right" size="32rpx" color="#9cb3c5" />
      </view>
      <t-picker
        v-model:visible="demandPickerVisible"
        :value="selectedDemandValue"
        :visible-item-count="4"
        title="选择需求类型"
        cancel-btn="取消"
        confirm-btn="确定"
        @confirm="changeDemand"
      >
        <t-picker-item :options="demandOptions" />
      </t-picker>
      <view class="form-row">
        <t-input v-model:value="form.region" class="form-input" borderless maxlength="50" placeholder="请输入省市地区（选填）">
          <template #label><text class="field-label">所在地区</text></template>
        </t-input>
      </view>
      <view class="form-row">
        <t-input v-model:value="form.budget" class="form-input" borderless maxlength="30" placeholder="如 10 万元（选填）">
          <template #label><text class="field-label">预算金额</text></template>
        </t-input>
      </view>
      <view class="remark-field">
        <text class="field-label">需求说明</text>
        <t-textarea
          v-model:value="form.remark"
          class="remark-input"
          t-class-textarea="consult-remark-textarea"
          maxlength="300"
          :autosize="{ minHeight: 96, maxHeight: 220 }"
          indicator
          placeholder="请简要描述产品、数量或交付周期"
        />
      </view>
    </view>
    <text class="privacy"
      >提交即表示您同意企业顾问仅将以上信息用于本次业务咨询。</text
    >
    <view class="action-buttons">
      <t-button
        class="submit-button"
        theme="primary"
        size="large"
        shape="round"
        block
        :loading="submitting"
        :disabled="submitting"
        @click="submit"
      >
        提交咨询
      </t-button>
    </view>
  </view>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { onLoad, onUnload } from "@dcloudio/uni-app";
import { getCurrentMiniappUser } from "../../api/auth";
import { getNeedCategories, submitConsultation } from "../../api/consultations";
import { supportsBaseLibrary } from "../../utils/platform";

const demandTypes = ref([]);
const demandIndex = ref(-1);
const demandPickerVisible = ref(false);
const demandOptions = computed(() => demandTypes.value.map((item) => ({ label: item.name, value: item.id })));
const selectedDemandValue = computed(() => demandIndex.value < 0 ? [] : [demandTypes.value[demandIndex.value]?.id]);
const selectedDemandName = computed(() => demandTypes.value[demandIndex.value]?.name || "");
const customerTypes = ["个人", "企业", "经销商"];
const keyboardHeight = ref(0);
const submitting = ref(false);
const form = reactive({
  customerType: "个人",
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
  const selectedId = event.value?.[0];
  demandIndex.value = demandTypes.value.findIndex(
    (item) => String(item.id) === String(selectedId)
  );
}
function changeCustomerType(event) {
  form.customerType = event.value;
}
async function submit() {
  const name = form.name.trim();
  const phone = form.phone.trim();
  if (!name)
    return uni.showToast({ title: "请输入客户名称", icon: "none" });
  if (!/^1\d{10}$/.test(phone))
    return uni.showToast({ title: "请输入正确的手机号", icon: "none" });
  if (demandIndex.value < 0)
    return uni.showToast({ title: "请选择需求类型", icon: "none" });
  if (!uni.getStorageSync("auth-token"))
    return uni.showToast({ title: "请先登录后提交", icon: "none" });
  submitting.value = true;
  try {
    await submitConsultation({
      name,
      phone,
      categoryId: demandTypes.value[demandIndex.value].id,
      customerType: form.customerType,
      region: form.region.trim(),
      budget: form.budget.trim(),
      remark: form.remark.trim(),
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
  padding: 8rpx 28rpx;
  border-radius: 16rpx;
  background: #fff;
  box-shadow: $card-shadow;
  --td-input-label-text-font: 500 30rpx/48rpx "PingFang SC", "Microsoft YaHei", sans-serif;
  --td-input-placeholder-text-font: 400 28rpx/48rpx "PingFang SC", "Microsoft YaHei", sans-serif;
  --td-input-default-text-color: #174b78;
  --td-input-vertical-padding: 32rpx;
  --td-radio-font: 500 30rpx/56rpx "PingFang SC", "Microsoft YaHei", sans-serif;
  --td-radio-icon-size: 44rpx;
  --td-radio-label-line-height: 56rpx;
  --td-picker-item-font-size: 30rpx;
  --td-picker-title-font: 32rpx;
  --td-picker-button-font: 28rpx;
  --td-cell-title-font: 500 30rpx/48rpx "PingFang SC", "Microsoft YaHei", sans-serif;
  --td-cell-note-font-size: 27rpx;
}
.customer-type-row {
  min-height: 112rpx;
  padding-left: 32rpx;
  border-bottom: 1rpx solid $line-color;
  display: flex;
  align-items: center;
  gap: 0;
}
.customer-type-row > .field-label {
  width: 160rpx;
  flex: 0 0 160rpx;
  margin-right: 32rpx;
}
.field-label {
  color: $text-title;
  font-size: 28rpx;
  line-height: 48rpx;
  font-weight: 600;
  white-space: nowrap;
}
.field-label.required::before {
  content: "*";
  margin-right: 5rpx;
  color: #b82d45;
}
.form-row {
  border-bottom: 1rpx solid $line-color;
}
.form-input :deep(.t-input__label) {
  width: 160rpx;
  min-width: 160rpx;
  max-width: 160rpx;
  flex: 0 0 160rpx;
}
.demand-row {
  min-height: 112rpx;
  padding-left: 32rpx;
  display: flex;
  align-items: center;
}
.demand-row > .field-label {
  width: 160rpx;
  flex: 0 0 160rpx;
  margin-right: 32rpx;
}
.demand-value {
  flex: 1;
  min-width: 0;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: $text-title;
  font-size: 32rpx;
  line-height: 48rpx;
}
.demand-value.is-placeholder {
  color: #9cb3c5;
  font-size: 28rpx;
}
.remark-field {
  padding: 32rpx 0 8rpx 32rpx;
  border-bottom: 1rpx solid $line-color;
}
.remark-input {
  margin-top: 12rpx;
  --td-textarea-padding: 16rpx 0;
  --td-textarea-placeholder-color: #9cb3c5;
  --td-textarea-indicator-text-color: #89a4b8;
}
.remark-input :deep(.consult-remark-textarea) {
  min-height: 150rpx;
  font-size: 28rpx;
  line-height: 1.65;
}
.privacy {
  display: block;
  margin: 20rpx 28rpx 0;
  color: $text-muted;
  font-size: 24rpx;
  line-height: 1.6;
}
.action-buttons {
  margin: 24rpx 24rpx 0;
}
</style>