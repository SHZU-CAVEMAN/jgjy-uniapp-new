<template>
  <view class="player-page">
    <video id="media-player" class="player" :src="videoUrl" :poster="poster" autoplay :muted="false" controls
      :direction="90" object-fit="contain" :show-center-play-btn="true" :show-play-btn="true"
      :show-fullscreen-btn="true" :enable-progress-gesture="true" :vslide-gesture="true"
      :vslide-gesture-in-fullscreen="true" @error="handleError" />
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
import { ref } from 'vue'
import { onLoad, onReady, onUnload } from '@dcloudio/uni-app'
import { useContactBallDrag } from '../../utils/contactBallDrag'

const { contactBallStyle, contactBallDragged, onContactBallTouchStart, onContactBallTouchMove, onContactBallTouchEnd } =
  useContactBallDrag()

const videoUrl = ref('')
const poster = ref('https://lzbjtjt.online/jgjy/resource/6fc364b4e8082cdaea511d1d0fec14e0.jpg')

onLoad((options) => {
  if (options.src) videoUrl.value = decodeURIComponent(options.src)
  if (options.poster) poster.value = decodeURIComponent(options.poster)
})
onReady(() => uni.createVideoContext('media-player').play())
onUnload(() => uni.createVideoContext('media-player').stop())

function handleError() {
  uni.showToast({ title: '视频加载失败，请稍后重试', icon: 'none' })
}
</script>

<style scoped lang="scss">
.player-page {
  width: 100vw;
  height: 100vh;
  background: #000;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.player {
  width: 100%;
  height: 100%;
  background: #000;
}
</style>