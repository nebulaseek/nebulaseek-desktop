# NebulaSeek 专版

这是由 DeepSeek Desktop 社区版维护团队推出的客户专版，内置固定的 NebulaSeek Harness。专版与社区版保持同一代码基线，只替换用户可见品牌和发行入口。

<!-- release-downloads -->

<!-- release-changes -->

Node `24.20.0` / pnpm `11.24.0` / npm `11.19.0` 保持锁定。此更新需要新版 Desktop 外壳；Harness 候选通过构建、闭包校验和真实启动检查后才会切换，失败保留当前版本。

## 下载选择

- **macOS Apple 芯片：** `*_aarch64.dmg`
- **macOS Intel：** `*_x64.dmg`
- **Windows x64：** `*_x64-setup.exe`
- **Linux x64：** `.AppImage` 便携包或 `.deb` 安装包
- **完整性校验：** 安装前使用 `SHA256SUMS` 校验安装包

当前专版未使用 Apple Developer ID、Apple 公证或 Windows 可信发布者证书，Desktop 安装包自动更新保持关闭；Harness 独立更新不受此限制。本版本标记为专版预发布，不占据 Latest。安装说明和平台实测边界请查看仓库文档。
