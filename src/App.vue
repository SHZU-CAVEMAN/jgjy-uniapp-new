<script setup>
import { onLaunch } from '@dcloudio/uni-app'

onLaunch(() => {})
</script>

<style lang="scss">
page { min-height: 100%; --td-brand-color: #218fe5; color: $text-body; background: $app-bg; font-family: "PingFang SC", "Microsoft YaHei", sans-serif; font-size: $font-body; line-height: 1.55; }
view, text, image, button, input, textarea, picker { box-sizing: border-box; }
button { margin: 0; padding: 0; border: 0; line-height: 1.4; background: transparent; }
button::after { border: 0; }
.primary-button { height: 96rpx; border-radius: 48rpx; color: #fff; background: linear-gradient(90deg, #55baf4, $brand-primary); display: flex; align-items: center; justify-content: center; font-size: 30rpx; font-weight: 700; box-shadow: 0 10rpx 24rpx rgba(33,143,229,.22); }
.contact-ball { position: fixed !important; z-index: 99999 !important; width: 112rpx !important; height: 112rpx !important; border: 3rpx solid #fff; border-radius: 50%; color: #fff; background: linear-gradient(145deg, #70c8f7, #218fe5); box-shadow: 0 8rpx 24rpx rgba(33,143,229,.4); display: flex !important; flex-direction: column; align-items: center; justify-content: center; }
.contact-ball text { margin-top: 2rpx; color: #fff; font-size: 20rpx; line-height: 1.2; }
.contact-ball-trigger { position: absolute !important; z-index: 2; inset: 0; top: 0 !important; left: 0 !important; width: 100% !important; height: 100% !important; margin: 0 !important; padding: 0 !important; border: 0 !important; border-radius: 50% !important; background: transparent !important; color: transparent !important; }
.contact-ball-trigger::after { border: 0; }
.safe-bottom { padding-bottom: calc(24rpx + env(safe-area-inset-bottom)); }
</style>
