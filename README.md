# 陈若菁 · 声音设计作品集

静态站点：影视 / 广告 / 全景声有声剧产线 / 交互装置 / 现场综艺。

## 本地预览

```bash
cd sound-portfolio
python3 serve.py 5173
```

打开 <http://127.0.0.1:5173>（`serve.py` 支持 HTTP Range，便于大视频拖动）。

## 素材说明

大体积成片、混音与试玩包通常以本机路径软链接接入（见 `assets/`），**不会**推入 GitHub，以免仓库过大。克隆后请在本机重新挂载媒体，或按 `js/projects-media.js` / `js/commercial.js` 中的路径放入文件。

小体积海报、图标、片场照片等可随仓库一起提交。

## 结构

| 路径 | 说明 |
|------|------|
| `index.html` | 页面结构 |
| `css/styles.css` | 样式 |
| `js/main.js` | 交互 / 浮层 |
| `js/i18n.js` | 中英双语与项目文案 |
| `js/commercial.js` | 广告扇区 |
| `js/projects-media.js` | 各项目媒体清单 |
| `serve.py` | 本地带 Range 的静态服务 |
