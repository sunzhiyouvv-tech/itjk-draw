# ITJK Draw

`draw.itjk.com` 在线画图、流程图、架构图与白板工具。

本项目基于 Excalidraw（MIT License）构建，部署时固定下载上游源码并应用 ITJK 品牌修改。

## Vercel

- Build Command: `sh scripts/build.sh`
- Output Directory: `dist`
- Node.js: 20+

## 当前定制

- 默认简体中文
- ITJK Draw / itjk.com 品牌
- SEO 与 canonical 指向 `https://draw.itjk.com`
- 关闭 Sentry 与行为统计
- 禁止跳转至上游 Excalidraw+ 应用
- 保留本地绘图、流程图、架构图、白板与导出能力
- 第一版不启用多人实时协作服务

## 上游版本

固定 commit：`4e758db17e10715aafcdfb98e6741b292631c300`

## License

Excalidraw is licensed under the MIT License. This repository preserves the upstream license and attribution requirements.
