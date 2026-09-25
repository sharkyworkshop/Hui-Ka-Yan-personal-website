/* ==========================================================================
   boot.js —— 启动：恢复播放器状态、初始化音画模式
   依赖：core.js、media.js、viz.js（须最后加载）
   ========================================================================== */
(function (X) {
  "use strict";

  if (X.restore) X.restore();
  if (X.setMode) X.setMode("embed");

  setTimeout(function () {
    X.toast("提示：本页音画来自 B 站的网络嵌入播放器，点播放器里的 ▶ 即可播放");
  }, 1800);
})(window.XJY);
