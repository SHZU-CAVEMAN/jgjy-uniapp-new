<script setup>
import { onLaunch } from '@dcloudio/uni-app'

onLaunch(() => {})
</script>

<style lang="scss">
page { min-height: 100%; color: $text-body; background: $app-bg; font-family: "PingFang SC", "Microsoft YaHei", sans-serif; font-size: $font-body; line-height: 1.55; }
view, text, image, button, input, textarea, picker { box-sizing: border-box; }
button { margin: 0; padding: 0; border: 0; line-height: 1.4; background: transparent; }
button::after { border: 0; }
.primary-button { height: 96rpx; border-radius: 14rpx; color: #fff; background: linear-gradient(90deg, $brand-primary, #10a1c8); display: flex; align-items: center; justify-content: center; font-size: 30rpx; font-weight: 700; box-shadow: 0 10rpx 24rpx rgba(8,126,170,.24); }
.safe-bottom { padding-bottom: calc(24rpx + env(safe-area-inset-bottom)); }
</style>
