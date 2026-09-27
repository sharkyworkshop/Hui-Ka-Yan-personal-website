# 许家印 · 公开信息档案

> **从首富到无期** —— 一个纯静态的中文档案网站

Public-information archive on **Xu Jiayin (Hui Ka Yan)**, founder and former chairman of **Evergrande Group** — from China's richest man to a life sentence. A purely static site, no build step, no CDN.

---

## 中文说明

### 这是什么

把关于许家印的**公开信息**整理成一条可读的时间线：从 1958 年出生，到 2026 年 8 月 20 日深圳市中级人民法院的一审宣判。

页面上每一条都标注了**日期与来源**，结尾附完整来源清单与免责声明。内容全部来自公开报道、公司公告与司法机关通报。

### 页面包含

| 板块 | 内容 |
|---|---|
| 档案卡 | 基本身份信息 |
| 商业轨迹 | 从金碧花园到恒大集团 |
| 现状（截至 2026 年 9 月） | 司法进程与当前状态 |
| 四个数字 | 用四个关键数字概括这个案子 |
| 时间线 | 从金碧花园到一审宣判 |
| 罪名与量刑 | 八项罪名，以及对许家印本人、对被告单位与同案人员分别的量刑 |
| 词条 | 「看懂这案子需要的六个词」 |
| 来源清单 | 公开报道与公告清单 |

### 音画

页面顶部有一个「▶ 开启音画档案」按钮，点击后接入 B 站嵌入播放器播放《空城计の小曲》，并带实时波形可视化。

- 音画来自 **B 站的网络嵌入播放器**，需要联网；这是页面自身**唯一的网络请求**。
- 断网或想用自己的文件时，点「**改用本地文件**」临时指定磁盘上的视频/音频，播放/暂停、进度拖动、音量、单曲循环、波形可视化都会切到页内播放器。
- **首次进入不会自动出声**，必须先点一次——这是浏览器的自动播放安全策略，不是故障。

### 视觉与交互

- **光效**：极光动态背景、鼠标光晕、卡片流光描边、滚动入场、数字滚动、顶部进度光带
- **触感**：按钮按压回弹、点击涟漪、磁吸主按钮、卡片 3D 倾斜、移动端震动反馈
- **键盘**：空格 = 播放/暂停（本地文件模式）、`←` / `→` = 上/下一个时间线节点、`Esc` = 关闭错误提示

### 怎么打开

双击 `index.html` 即可（Edge / Chrome / Firefox 均可）。

### 技术构成

纯静态：不需要构建、没有 CDN 依赖。

```
├─ index.html            页面结构（样式与脚本已外链）
├─ assets/
│  ├─ css/style.css      全部样式
│  └─ js/
│     ├─ core.js         工具函数与视觉特效（极光、光标、涟漪、数字滚动、进场动画…）
│     ├─ media.js        音画模块：B 站网络嵌入为主，本地文件为兜底
│     ├─ viz.js          波形可视化
│     └─ boot.js         启动与播放设置恢复
└─ 使用说明.txt           详细使用说明
```

### 免责声明

本页为**个人学习用途的公开信息整理**，非官方立场，**不构成法律或投资建议**；一切以官方发布的文书与公告为准。

### 版权

《朋友的酒》（原唱：李晓杰）词曲及录音版权归原作者与版权方所有。本站只做 B 站嵌入播放，**不提供下载、不转载歌词全文、不用于任何商业目的**。嵌入视频为网友二次创作内容，与事实无关，仅作氛围用途。

---

## English

### What this is

A readable **timeline of public information** about **Xu Jiayin (Hui Ka Yan)**, founder and former chairman of **Evergrande Group** — from his birth in 1958 to the first-instance verdict handed down by the Shenzhen Intermediate People's Court on **20 August 2026**.

Every entry is stamped with a **date and source**; a full source list and disclaimer close the page. All content is compiled from public reporting, company filings and judicial notices.

### Sections

| Section | Content |
|---|---|
| Profile card | Basic identity |
| Business trajectory | From Golden Bihai Garden to the Evergrande Group |
| Current status (as of Sep 2026) | Judicial process and present situation |
| Four numbers | The case summarised in four key figures |
| Timeline | From the first property project to the first-instance verdict |
| Charges & sentencing | Eight charges, with sentencing for Xu Jiayin himself, the defendant entities and co-defendants |
| Glossary | "Six terms you need to understand this case" |
| Sources | List of public reports and announcements |

### Audio & video

A "▶ Open the audio archive" button at the top loads an **embedded Bilibili player** playing *《空城计の小曲》*, with a live waveform visualiser.

- Playback comes from an **embedded Bilibili player** and needs a network connection — it is the page's **only** network request.
- Offline, or to use your own file, click "**Use a local file**" and pick a video/audio file from disk. Play/pause, seeking, volume, single-track repeat and the waveform all switch to an in-page player.
- **Nothing plays on first load** — one click is required. That is the browser's autoplay policy, not a bug.

### Visuals & interaction

- **Light**: animated aurora background, cursor glow, flowing card borders, scroll reveals, counting numbers, top progress bar
- **Touch**: button press-and-bounce, click ripples, magnetic primary button, 3D card tilt, haptic feedback on mobile
- **Keyboard**: `Space` = play/pause (local-file mode), `←` / `→` = previous/next timeline node, `Esc` = dismiss error

### How to open

Double-click `index.html` (Edge / Chrome / Firefox all work).

### Tech

Purely static — no build step, no CDN dependencies.

```
├─ index.html            page structure (styles and scripts are external)
├─ assets/
│  ├─ css/style.css      all styling
│  └─ js/
│     ├─ core.js         helpers and visual effects (aurora, cursor, ripples, number roll, reveals)
│     ├─ media.js        media module: Bilibili embed first, local file as fallback
│     ├─ viz.js          waveform visualiser
│     └─ boot.js         startup and playback-settings restore
└─ 使用说明.txt           detailed usage notes (Chinese)
```

### Disclaimer

This page is a **personal, educational compilation of public information**. It is **not an official position** and **does not constitute legal or investment advice**; official documents and announcements always take precedence.

### Copyright

Lyrics, music and recording copyright of *《朋友的酒》* (original singer: Li Xiaojie) belong to the original author and rights holders. This site only **embeds** the Bilibili player: it provides **no downloads**, reproduces **no full lyrics**, and serves **no commercial purpose**. The embedded video is a fan-made work, unrelated to the facts, used for atmosphere only.
