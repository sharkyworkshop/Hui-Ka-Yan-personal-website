/* ==========================================================================
   viz.js —— 波形可视化：本地文件优先用 WebAudio，其余走合成动画
   依赖：core.js、media.js（须在其后加载）
   ========================================================================== */
(function (X) {
  "use strict";

  var $ = X.$, RM = X.RM, video = X.video;
  var c = $("#viz");
  if (!c || !c.getContext) return;

  var ctx = c.getContext("2d");
  var ac = null, an = null, data = null, ok = false;

  function init() {
    if (ac) return;
    /* 用 file:// 双击打开时，部分浏览器会把本地媒体判为跨源，WebAudio 接线后可能只剩静音。
       为了确保本地音轨一定能听到，本地文件协议下不接管音频输出，只用合成波形做可视化。 */
    if (location.protocol === "file:") { ok = false; return; }
    try {
      var AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ac = new AC();
      var node = ac.createMediaElementSource(video);
      an = ac.createAnalyser(); an.fftSize = 256; an.smoothingTimeConstant = .8;
      node.connect(an); an.connect(ac.destination);
      data = new Uint8Array(an.frequencyBinCount);
      ok = true;
    } catch (err) { ok = false; }
  }

  var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2), phase = 0;
  function resize() {
    W = c.width = Math.floor((c.clientWidth || 400) * DPR);
    H = c.height = Math.floor((c.clientHeight || 60) * DPR);
  }
  resize(); window.addEventListener("resize", resize, { passive: true });

  var startBtn = $("#startBtn");
  if (startBtn) {
    startBtn.addEventListener("click", function () {
      try { init(); if (ac && ac.state === "suspended") ac.resume(); } catch (err) {}
    });
  }
  video.addEventListener("play", function () {
    try { init(); if (ac && ac.state === "suspended") ac.resume(); } catch (err) {}
  });

  function draw() {
    phase += 0.045;
    ctx.clearRect(0, 0, W, H);
    /* 嵌入模式下画布被 CSS 隐藏，也没有音频数据可读，直接跳过绘制 */
    if (!X.isLocal()) { requestAnimationFrame(draw); return; }
    var playing = X.isPlaying();
    var bars = 56, bw = W / bars;
    if (ok && playing) { an.getByteFrequencyData(data); }
    for (var i = 0; i < bars; i++) {
      var v;
      if (ok && playing && data) { v = data[Math.floor(i * data.length / bars)] / 255; }
      else {
        var base = playing ? 0.42 : 0.10;
        v = base + Math.sin(phase + i * 0.42) * (playing ? 0.30 : 0.06) + Math.sin(phase * 0.5 + i * 0.13) * 0.16;
        v = Math.max(0.04, Math.min(1, v));
      }
      var h = Math.max(2, v * H * 0.92);
      var g = ctx.createLinearGradient(0, H, 0, H - h);
      g.addColorStop(0, "rgba(79,216,232,.15)");
      g.addColorStop(.55, "rgba(232,195,122,.55)");
      g.addColorStop(1, "rgba(255,223,168,.95)");
      ctx.fillStyle = g;
      var x = i * bw + bw * 0.18, w = Math.max(1.4, bw * 0.64);
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, H - h, w, h, Math.min(w / 2, 3));
      else ctx.rect(x, H - h, w, h);
      ctx.fill();
    }
    requestAnimationFrame(draw);
  }
  draw();
})(window.XJY);
