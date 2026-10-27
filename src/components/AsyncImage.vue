<template>
  <view class="async-image">
    <image
      v-if="src"
      class="media-image"
      :class="{ visible: loaded }"
      :src="src"
      :mode="mode"
      :lazy-load="lazyLoad"
      @load="handleLoad"
      @error="handleError"
    />
    <view v-if="!loaded" class="placeholder">
      <image class="placeholder-art" src="/static/placeholder.png" mode="aspectFill" />
      <view v-if="(src || pending) && !failed" class="loading-indicator">
        <t-loading theme="spinner" size="48rpx" />
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  src: { type: String, default: "" },
  mode: { type: String, default: "aspectFill" },
  lazyLoad: { type: Boolean, default: false },
  pending: { type: Boolean, default: false },
});
const emit = defineEmits(["load", "error"]);
const loaded = ref(false);
const failed = ref(false);

watch(() => props.src, () => {
  loaded.value = false;
  failed.value = false;
}, { immediate: true });

function handleLoad(event) {
  loaded.value = true;
  emit("load", event);
}

function handleError(event) {
  failed.value = true;
  emit("error", event);
}
</script>

<style scoped lang="scss">
.async-image {
  width: 100%;
  height: 100%;
  position: relative;
  display: block;
  overflow: hidden;
  background: #eaf6ff;
}

.media-image,
.placeholder,
.placeholder-art {
  width: 100%;
  height: 100%;
  position: absolute;
  inset: 0;
}

.media-image {
  opacity: 0;
  transition: opacity .2s ease;
}

.media-image.visible {
  opacity: 1;
}

.placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
}

.placeholder-art {
  opacity: .8;
}

.loading-indicator {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, .86);
}
</style>