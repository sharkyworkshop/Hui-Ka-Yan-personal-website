/* ==========================================================================
   core.js —— 全局命名空间、工具函数与视觉特效
   依赖：无（必须最先加载）
   ========================================================================== */
window.XJY = window.XJY || {};

(function (X) {
  "use strict";

  var RM = !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
  var isTouch = !!(window.matchMedia && window.matchMedia("(hover: none)").matches);
  var $ = function (s) { return document.querySelector(s); };
  var $$ = function (s) { return Array.prototype.slice.call(document.querySelectorAll(s)); };

  X.RM = RM;
  X.isTouch = isTouch;
  X.$ = $;
  X.$$ = $$;

  /* ---------- 提示条 ---------- */
  var toastEl = $("#toast"), toastTimer = null;
  X.toast = function (msg) {
    if (!toastEl) return;
    toastEl.textContent = msg; toastEl.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { toastEl.classList.remove("show"); }, 2600);
  };
  var toast = X.toast;

  /* ---------- 进度条 / 指针光晕 ---------- */
  var pbar = $("#pbar");
  X.mx = 0.5; X.my = 0.3;

  function onScroll() {
    var h = document.documentElement.scrollHeight - window.innerHeight;
    var p = h > 0 ? (window.scrollY / h) * 100 : 0;
    if (pbar) pbar.style.width = p + "%";
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  window.addEventListener("pointermove", function (e) {
    X.mx = e.clientX / window.innerWidth; X.my = e.clientY / window.innerHeight;
    document.documentElement.style.setProperty("--mx", (X.mx * 100).toFixed(2) + "%");
    document.documentElement.style.setProperty("--my", (X.my * 100).toFixed(2) + "%");
  }, { passive: true });

  /* ---------- 自定义光标 ---------- */
  var cur = $("#cursor");
  if (cur && !isTouch && !RM) {
    document.body.classList.add("no-cursor");
    var cx = window.innerWidth / 2, cy = window.innerHeight / 2, tx = cx, ty = cy;
    window.addEventListener("pointermove", function (e) { tx = e.clientX; ty = e.clientY; }, { passive: true });
    window.addEventListener("pointerdown", function () { cur.classList.add("dot"); });
    window.addEventListener("pointerup", function () { cur.classList.remove("dot"); });
    document.addEventListener("mouseleave", function () { cur.classList.add("hide"); });
    document.addEventListener("mouseenter", function () { cur.classList.remove("hide"); });
    $$("a,button,summary,.card,.charge,input,label").forEach(function (el) {
      el.addEventListener("pointerenter", function () { cur.classList.add("hot"); });
      el.addEventListener("pointerleave", function () { cur.classList.remove("hot"); });
    });
    (function loopCursor() {
      cx += (tx - cx) * 0.18; cy += (ty - cy) * 0.18;
      cur.style.transform = "translate(" + cx + "px," + cy + "px)";
      requestAnimationFrame(loopCursor);
    })();
  }

  /* ---------- 涟漪 / 触感 ---------- */
  function ripple(e) {
    var b = e.currentTarget, r = b.getBoundingClientRect();
    var s = document.createElement("span");
    s.className = "rip";
    var rad = Math.max(r.width, r.height) * 2.2;
    s.style.width = s.style.height = rad + "px";
    s.style.left = (e.clientX - r.left) + "px";
    s.style.top = (e.clientY - r.top) + "px";
    b.appendChild(s); setTimeout(function () { s.remove(); }, 680);
    if (navigator.vibrate) { try { navigator.vibrate(12); } catch (err) {} }
  }
  $$(".btn").forEach(function (b) { b.addEventListener("click", ripple); });

  /* ---------- 磁吸主按钮 ---------- */
  if (!isTouch && !RM) {
    var sb = $("#startBtn");
    if (sb) {
      sb.addEventListener("pointermove", function (e) {
        var r = sb.getBoundingClientRect();
        var dx = (e.clientX - (r.left + r.width / 2)) / r.width;
        var dy = (e.clientY - (r.top + r.height / 2)) / r.height;
        sb.style.transform = "translate(" + (dx * 14).toFixed(1) + "px," + (dy * 10).toFixed(1) + "px)";
      });
      sb.addEventListener("pointerleave", function () { sb.style.transform = ""; });
    }
  }

  /* ---------- 3D 倾斜 ---------- */
  if (!isTouch && !RM) {
    $$(".tilt").forEach(function (card) {
      card.addEventListener("pointermove", function (e) {
        var r = card.getBoundingClientRect();
        var px = (e.clientX - r.left) / r.width - .5, py = (e.clientY - r.top) / r.height - .5;
        card.style.transform = "perspective(900px) rotateY(" + (px * 6).toFixed(2) + "deg) rotateX(" + (-py * 6).toFixed(2) + "deg) translateY(-5px)";
      });
      card.addEventListener("pointerleave", function () { card.style.transform = ""; });
    });
  }

  /* ---------- 数字滚动 ---------- */
  function countUp(scope) {
    var nodes = Array.prototype.slice.call(scope.querySelectorAll ? scope.querySelectorAll(".num") : []);
    if (!nodes.length && scope.classList && scope.classList.contains("num")) nodes = [scope];
    nodes.forEach(function (n) {
      if (n.dataset.done) return; n.dataset.done = "1";
      var target = parseFloat(n.dataset.count || "0"), dec = parseInt(n.dataset.dec || "0", 10);
      var unit = n.querySelector(".u"), ut = unit ? unit.outerHTML : "";
      var t0 = null, dur = RM ? 0 : 1500;
      function step(ts) {
        if (t0 === null) t0 = ts;
        var k = dur ? Math.min((ts - t0) / dur, 1) : 1;
        var e = 1 - Math.pow(1 - k, 3);
        var v = target * e;
        var s = dec ? v.toFixed(dec) : Math.round(v).toString();
        if (dec && target >= 1000) s = v.toFixed(dec).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        n.innerHTML = s + ut;
        if (k < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }
  X.countUp = countUp;

  /* ---------- 进场动画 ---------- */
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (en) {
      if (en.isIntersecting) {
        var el = en.target;
        if (RM) { el.classList.add("in"); } else { setTimeout(function () { el.classList.add("in"); }, 60); }
        io.unobserve(el);
        if (el.querySelector(".num")) countUp(el);
      }
    });
  }, { threshold: .12, rootMargin: "0px 0px -8% 0px" }) : null;

  $$(".rv").forEach(function (el) {
    if (io) { io.observe(el); } else { el.classList.add("in"); if (el.querySelector(".num")) countUp(el); }
  });

  /* ---------- 极光背景 ---------- */
  (function aurora() {
    var c = $("#aurora");
    if (!c || !c.getContext) return;
    var ctx = c.getContext("2d");
    var W = 0, H = 0, DPR = Math.min(window.devicePixelRatio || 1, 2);
    var blobs = [], parts = [];
    var COUNT = isTouch ? 26 : 54;
    function resize() {
      W = c.width = Math.floor(window.innerWidth * DPR);
      H = c.height = Math.floor(window.innerHeight * DPR);
      c.style.width = window.innerWidth + "px"; c.style.height = window.innerHeight + "px";
      blobs = [
        { x: .18, y: .22, r: .46, c: [232, 195, 122], sx: .00021, sy: .00017 },
        { x: .82, y: .30, r: .42, c: [79, 216, 232], sx: -.00017, sy: .00023 },
        { x: .55, y: .86, r: .50, c: [139, 123, 255], sx: .00013, sy: -.00019 },
        { x: .30, y: .70, r: .34, c: [255, 77, 94], sx: -.00023, sy: -.00013, o: .5 }
      ];
      parts = [];
      for (var i = 0; i < COUNT; i++) {
        parts.push({
          x: Math.random(), y: Math.random(), z: .3 + Math.random() * .7,
          vx: (Math.random() - .5) * .00006, vy: -(.00002 + Math.random() * .00007),
          r: .6 + Math.random() * 1.7, a: .14 + Math.random() * .5
        });
      }
    }
    resize(); window.addEventListener("resize", resize, { passive: true });

    function frame(t) {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";
      var px = (X.mx - .5), py = (X.my - .5);
      for (var i = 0; i < blobs.length; i++) {
        var b = blobs[i];
        var bx = (b.x + Math.sin(t * b.sx) * 0.06 - px * 0.03) * W;
        var by = (b.y + Math.cos(t * b.sy) * 0.06 - py * 0.03) * H;
        var rad = b.r * Math.max(W, H) * (1 + Math.sin(t * 0.0004 + i) * 0.05);
        var g = ctx.createRadialGradient(bx, by, 0, bx, by, rad);
        var al = (b.o || .55) * (RM ? .5 : .75);
        g.addColorStop(0, "rgba(" + b.c[0] + "," + b.c[1] + "," + b.c[2] + "," + al.toFixed(3) + ")");
        g.addColorStop(.45, "rgba(" + b.c[0] + "," + b.c[1] + "," + b.c[2] + "," + (al * .22).toFixed(3) + ")");
        g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bx, by, rad, 0, 6.2832); ctx.fill();
      }
      if (!RM) {
        for (var j = 0; j < parts.length; j++) {
          var p = parts[j];
          p.x += p.vx * (1 + (X.mx - .5) * .6); p.y += p.vy;
          if (p.y < -.02) { p.y = 1.02; p.x = Math.random(); }
          if (p.x < -.02) p.x = 1.02;
          if (p.x > 1.02) p.x = -.02;
          var gx = p.x * W, gy = p.y * H;
          ctx.fillStyle = "rgba(255,236,200," + (p.a * 0.55).toFixed(3) + ")";
          ctx.beginPath(); ctx.arc(gx, gy, p.r * DPR * p.z, 0, 6.2832); ctx.fill();
        }
      }
      ctx.globalCompositeOperation = "source-over";
    }
    var hidden = false;
    document.addEventListener("visibilitychange", function () { hidden = document.hidden; });
    if (RM) { frame(1200); }
    else { (function loop(t) { if (!hidden) frame(t); requestAnimationFrame(loop); })(0); }
  })();
})(window.XJY);
