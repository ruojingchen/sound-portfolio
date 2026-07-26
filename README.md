# 陈若菁 · 声音设计作品集

静态站点：影视 / 广告 / 全景声有声剧产线 / 交互装置 / 现场综艺。

## 本地预览

```bash
cd sound-portfolio
python3 serve.py 5173
```

打开 <http://127.0.0.1:5173>（`serve.py` 支持 HTTP Range，便于大视频拖动）。

## 部署到 Vercel

仓库已配置 `vercel.json`（静态站点 + 媒体 Range 头）。推荐用 GitHub 导入：

1. 打开 [vercel.com/new](https://vercel.com/new)
2. 选择仓库 `ruojingchen/sound-portfolio`
3. Framework Preset 选 **Other**，Root Directory 保持默认，直接 Deploy

之后每次 `git push` 到 `main` 会自动重新部署。

### 媒体体积注意

`.gitignore` 排除了 `mp4` / `wav` 等大文件（Vercel 单文件也约有 **100MB** 限制）。因此线上默认能打开页面与海报，**成片/广告视频需另挂**：

- 短预告压到 &lt;100MB 后可放进仓库再推送；或
- 放到对象存储 / CDN（R2、Bunny、阿里云 OSS 等），把 `js/commercial.js` / `js/projects-media.js` 里的路径改成完整 URL。

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
