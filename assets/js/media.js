/* ==========================================================================
   media.js —— 音画模块：B 站网络嵌入为主，本地文件为兜底
   依赖：core.js（须在其后加载）
   ========================================================================== */
(function (X) {
  "use strict";

  var $ = X.$, toast = X.toast;

  var stage = $("#stage");
  var video = $("#video"), audio = $("#audio");
  var player = $("#player"), pToggle = $("#pToggle"), pMute = $("#pMute"), pLoop = $("#pLoop");
  var pSeek = $("#pSeek"), pFill = $("#pFill"), pKnob = $("#pKnob");
  var pT1 = $("#pT1"), pT2 = $("#pT2"), pVol = $("#pVol"), pErr = $("#pErr");
  var pName = $("#pName"), pState = $("#pState"), heroEq = $("#heroEq"), veil = $("#veil");

  var BASE = "https://player.bilibili.com/player.html?bvid=BV1sTgo6cE9t&page=1&danmaku=0&high_quality=1";
  var PAGE = "https://www.bilibili.com/video/BV1sTgo6cE9t";

  var mode = "embed";   /* embed | local */
  var media = video;    /* 仅本地模式下指向真正在播放的元素 */

  X.video = video;
  X.link = PAGE;
  X.isLocal = function () { return mode === "local"; };
  X.isPlaying = function () { return mode === "local" && !media.paused && !media.ended; };

  function fmt(s) {
    if (!isFinite(s) || s < 0) s = 0;
    var m = Math.floor(s / 60), q = Math.floor(s % 60);
    return (m < 10 ? "0" : "") + m + ":" + (q < 10 ? "0" : "") + q;
  }
  function setState(txt) { pState.textContent = txt; }
  function showErr(msg) { pErr.textContent = msg; pErr.classList.add("show"); player.classList.remove("hidden"); }
  function hideErr() { pErr.classList.remove("show"); }

  function embedHint() {
    player.classList.remove("hidden");
    toast("网络嵌入模式：请在页面里的 B 站播放器窗口内点播放、调音量与进度");
  }

  /* 嵌入模式：自定义控件交给 B 站播放器；本地模式：控件接管本地媒体元素 */
  function setMode(next) {
    mode = next;
    var embed = mode === "embed";
    if (stage) { stage.classList.toggle("is-embed", embed); stage.classList.toggle("is-local", !embed); }
    player.classList.toggle("locked", embed);
    if (embed) {
      try { video.pause(); audio.pause(); } catch (err) {}
      if (veil) veil.classList.add("off");
      if (heroEq) heroEq.classList.add("off");
      pName.textContent = "《空城计の小曲》· B 站网络嵌入";
      setState("网络嵌入 · 请在播放器内操作");
      hideErr();
    }
    paint();
  }

  function useMedia(el, name) {
    media = el;
    pName.textContent = name;
    setMode("local");
  }

  function play() {
    if (mode === "embed") { embedHint(); return; }
    var pr = media.play();
    if (pr && pr.catch) {
      pr.catch(function (err) {
        showErr("播放被拦截或文件不可用（" + ((err && err.name) || "错误") + "）。请再点一次播放按钮。");
      });
    }
  }
  function toggle() {
    if (mode === "embed") { embedHint(); return; }
    if (media.paused) play(); else media.pause();
  }

  function paint() {
    if (mode === "embed") {
      pToggle.textContent = "▶";
      pT1.textContent = fmt(0); pT2.textContent = fmt(0);
      pFill.style.width = "0%"; pKnob.style.left = "0%";
      pSeek.setAttribute("aria-valuenow", "0");
      return;
    }
    var paused = media.paused;
    pToggle.textContent = paused ? "▶" : "❙❙";
    setState(paused ? "已暂停 · 本地文件" : "正在播放 · 本地文件");
    if (heroEq) heroEq.classList.toggle("off", paused);
    if (veil) veil.classList.toggle("off", !(media === video && paused));
    var d = media.duration, c = media.currentTime;
    pT1.textContent = fmt(c); pT2.textContent = fmt(d);
    var p = (isFinite(d) && d > 0) ? (c / d) : 0;
    pFill.style.width = (p * 100).toFixed(2) + "%";
    pKnob.style.left = (p * 100).toFixed(2) + "%";
    pSeek.setAttribute("aria-valuenow", String(Math.round(p * 100)));
  }

  /* ---------- 本地文件兜底 ---------- */
  function bindFile(input, el, name) {
    if (!input) return;
    input.addEventListener("change", function () {
      var f = input.files && input.files[0]; if (!f) return;
      try {
        el.src = URL.createObjectURL(f);
        el.classList.add("on");
        el.load(); hideErr();
        toast("已载入本地文件：" + f.name);
        useMedia(el, name);
        play();
      } catch (err) { showErr("无法读取该文件：" + err.message); }
    });
  }
  bindFile($("#pickVideo"), video, "《空城计の小曲》· 本地视频");
  bindFile($("#pickAudio"), audio, "《朋友的酒》· 本地音轨");

  video.addEventListener("error", function () {
    showErr("视频加载失败：可能文件被移动或浏览器拦截。用「改用本地视频文件」指定磁盘里的 mp4 即可。");
  });
  audio.addEventListener("error", function () {
    showErr("音频加载失败：请用「改用本地音乐文件」指定 mp3 文件。");
  });

  /* ---------- 控件 ---------- */
  pToggle.addEventListener("click", toggle);
  $("#mPlay").addEventListener("click", toggle);
  $("#mFull").addEventListener("click", function () {
    if (stage && stage.requestFullscreen) stage.requestFullscreen();
    else if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
    else toast("当前浏览器不支持全屏 API");
  });
  pMute.addEventListener("click", function () {
    if (mode === "embed") { embedHint(); return; }
    media.muted = !media.muted;
    pMute.textContent = media.muted ? "🔇" : "🔊";
    save();
  });
  pLoop.addEventListener("click", function () {
    if (mode === "embed") { embedHint(); return; }
    media.loop = !media.loop;
    pLoop.classList.toggle("on", media.loop);
    save();
  });
  pVol.addEventListener("input", function () {
    if (mode === "embed") { embedHint(); return; }
    media.volume = parseFloat(pVol.value);
    if (media.volume > 0 && media.muted) { media.muted = false; pMute.textContent = "🔊"; }
    save();
  });
  function seekTo(ratio) {
    var d = media.duration; if (!isFinite(d) || d <= 0) return;
    media.currentTime = Math.max(0, Math.min(1, ratio)) * d; paint();
  }
  pSeek.addEventListener("click", function (e) {
    if (mode === "embed") { embedHint(); return; }
    var r = pSeek.getBoundingClientRect();
    seekTo((e.clientX - r.left) / r.width);
  });
  pSeek.addEventListener("keydown", function (e) {
    if (mode === "embed") {
      if (e.key === " " || e.key === "Enter") { e.preventDefault(); embedHint(); }
      return;
    }
    var d = media.duration || 1;
    if (e.key === "ArrowRight") { seekTo((media.currentTime + 10) / d); e.preventDefault(); }
    if (e.key === "ArrowLeft") { seekTo((media.currentTime - 10) / d); e.preventDefault(); }
    if (e.key === " " || e.key === "Enter") { toggle(); e.preventDefault(); }
  });

  ["play", "pause", "ended", "loadedmetadata", "timeupdate", "volumechange", "progress", "ratechange"].forEach(function (ev) {
    video.addEventListener(ev, paint); audio.addEventListener(ev, paint);
  });
  video.addEventListener("timeupdate", function () { if (Math.floor(video.currentTime) % 5 === 0) save(); });

  /* ---------- 开启音画档案 ---------- */
  var startBtn = $("#startBtn");
  if (startBtn) {
    startBtn.addEventListener("click", function () {
      player.classList.remove("hidden");
      if (mode === "embed") {
        toast("已开启音画档案 —— 请点 B 站播放器里的 ▶ 播放");
      } else {
        play();
        toast("已开启音画档案 —— 空格可暂停/继续");
      }
      setTimeout(function () {
        var go = document.getElementById(mode === "embed" ? "media" : "timeline");
        if (go && window.scrollY < 80) go.scrollIntoView({ behavior: X.RM ? "auto" : "smooth" });
      }, 1200);
    });
  }

  /* ---------- 键盘 ---------- */
  document.addEventListener("keydown", function (e) {
    var tag = ((e.target && e.target.tagName) || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    if (e.code === "Space") { e.preventDefault(); player.classList.remove("hidden"); toggle(); }
    if (e.key === "Escape") { pErr.classList.remove("show"); }
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      if (e.altKey) return;
      e.preventDefault();
      var nodes = X.$$(".node"); if (!nodes.length) return;
      var idx = -1;
      for (var i = 0; i < nodes.length; i++) {
        if (nodes[i].getBoundingClientRect().top > window.innerHeight * 0.34) { idx = i; break; }
      }
      if (idx < 0) idx = nodes.length - 1;
      var target = (e.key === "ArrowRight") ? nodes[Math.min(nodes.length - 1, idx)] : nodes[Math.max(0, idx - 1)];
      if (target) {
        target.scrollIntoView({ behavior: X.RM ? "auto" : "smooth", block: "center" });
        if (navigator.vibrate) { try { navigator.vibrate(8); } catch (err) {} }
      }
    }
  });

  /* ---------- 状态持久化 ---------- */
  function save() {
    if (mode !== "local") return;
    try {
      localStorage.setItem("xjy.player", JSON.stringify({ v: media.volume, m: media.muted, l: media.loop }));
    } catch (err) {}
  }
  X.save = save;
  X.restore = function () {
    try {
      var s = JSON.parse(localStorage.getItem("xjy.player") || "null");
      if (s) {
        if (typeof s.v === "number") { pVol.value = s.v; video.volume = s.v; audio.volume = s.v; }
        if (s.m) { video.muted = true; audio.muted = true; pMute.textContent = "🔇"; }
        if (s.l === false) { video.loop = false; audio.loop = false; pLoop.classList.remove("on"); }
      } else { video.volume = audio.volume = 0.85; }
    } catch (err) {}
  };

  X.setMode = setMode;
  X.embedHint = embedHint;
})(window.XJY);
