import { onShareAppMessage, onShareTimeline, onShow } from "@dcloudio/uni-app";

const DEFAULT_SHARE_TITLE = "泸州白酒投 · 酒谷酒业";

function normalizeQuery(path = "") {
  const index = path.indexOf("?");
  return index >= 0 ? path.slice(index + 1) : "";
}

/**
 * 统一注册每个页面的分享能力：转发给朋友 + 分享到朋友圈。
 * @param {object|Function} options 分享配置，或返回分享配置的函数（用于详情页异步数据）
 *   title: 分享标题；path: 分享路径（可带 query）；query: 朋友圈参数（不传则从 path 中解析）；imageUrl: 分享图片
 */
export function usePageShare(options = {}) {
  function resolveShare() {
    const config = (typeof options === "function" ? options() : options) || {};
    const path = config.path || "/pages/index/index";
    return {
      title: config.title || DEFAULT_SHARE_TITLE,
      path,
      query: config.query || normalizeQuery(path),
      imageUrl: config.imageUrl || "",
    };
  }

  // 转发给朋友
  onShareAppMessage(() => {
    const { title, path, imageUrl } = resolveShare();
    return { title, path, ...(imageUrl ? { imageUrl } : {}) };
  });

  // 分享到朋友圈
  onShareTimeline(() => {
    const { title, query, imageUrl } = resolveShare();
    return { title, query, ...(imageUrl ? { imageUrl } : {}) };
  });

  onShow(() => {
    // #ifdef MP-WEIXIN
    // 开启右上角菜单中的“转发给朋友”和“分享到朋友圈”
    uni.showShareMenu({ menus: ["shareAppMessage", "shareTimeline"] });
    // #endif
  });
}
