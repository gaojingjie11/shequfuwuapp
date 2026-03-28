# 社区小程序 Android 版（uni-app）

此目录为从微信小程序自动迁移出的 uni-app 工程，可用于打包 Android。

## 目录说明
- pages/: 页面（由原 pages/*.wxml|wxss|js 转换）
- api/ utils/: 原业务代码迁移并将 wx API 替换为 uni API
- common/page-compat.js: Page 兼容层，保留 this.data 和 this.setData 写法

## 构建 Android
1. 使用 HBuilderX 导入本目录 `shequ-android-uniapp`。
2. 运行到 Android 模拟器/真机。
3. 或使用云打包生成 APK。

## 注意
- 本次是自动迁移版，少量页面细节（复杂模板表达式、个别组件行为）可能需要微调。
- 如果你要我继续，我可以下一步逐页做真机适配和发布配置（签名、包名、权限最小化）。
