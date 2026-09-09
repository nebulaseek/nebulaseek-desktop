# 星云寻知社区版

这是内置固定版本本地内核的独立、非官方社区发行版。

<!-- release-downloads -->

## 主要变化

- 本仓库的首个公开发行版本：应用名称、图标、窗口标题和安装包全部使用「星云寻知」，内核在用户可见文案中统称「内核」
- 内置内核固定为 `0.1.3-alpha.2`（`33c41938eb`），包含出厂品牌文案；Node `24.20.0` / pnpm `11.24.0` 和 DSH Market `1.28.1` 保持锁定
- 启动后自动拉起本地内核并在同一窗口进入工作台，无需手动选择目录；退出时确认并清理内核子进程
- 窗口顶部提供统一的「文件 / 编辑 / 视图 / 窗口 / 帮助」菜单与同窗设置层，三语界面（简体中文 / 繁体中文 / English）
- 凭据存放在跨平台本地加密凭据库中，诊断导出对家目录路径和令牌做脱敏
- 联网搜索默认跟随当前会话实际使用的模型、接口地址和凭据；官方搜索插件保持上游原样，两者可同时启用而不会重复搜索
- 内核可独立更新：默认「发现后提醒」，候选只有在构建、闭包校验和真实启动检查通过后才切换，失败保留当前可用版本

应用标识符为 `xingyunxunzhi.desktop`。如果此前安装过改名之前的版本，本版本会作为全新应用安装：应用数据目录、钥匙串条目和更新识别都不会自动迁移，需要重新配置模型提供方和凭据。

## 下载选择

- **macOS Apple 芯片：** `*_aarch64.dmg`
- **macOS Intel：** `*_x64.dmg`
- **Windows x64：** `*_x64-setup.exe`
- **Linux x64：** `.AppImage` 便携包或 `.deb` 安装包
- **完整性校验：** 安装前使用 `SHA256SUMS` 校验安装包

当前社区版未使用 Apple Developer ID、Apple 公证或 Windows 可信发布者证书，Desktop 安装包自动更新保持关闭；内核独立更新不受此限制。本版本标记为社区预发布，不占据 Latest。安装说明和平台实测边界请查看仓库文档。

---

# 星云寻知 Community Edition

This is the first public release from this repository. The application name, icon, window title, and installers all use 星云寻知 (Xingyunxunzhi), and the bundled agent runtime is referred to as the Core throughout the user interface.

The bundled Core is pinned to 0.1.3-alpha.2 (`33c41938eb`), which carries the rebranded default strings. Node 24.20.0, pnpm 11.24.0, and DSH Market 1.28.1 remain pinned. The desktop shell starts the local Core automatically and loads the workbench in the same native window, confirms on close, and cleans up Core child processes on exit.

The window carries a unified File / Edit / View / Window / Help menu and an in-window Settings layer, in Simplified Chinese, Traditional Chinese, and English. Credentials live in a cross-platform encrypted local vault, and diagnostics exports redact home directories and tokens. Web search follows the model, endpoint, and credential of the active session by default; the upstream search plugin is left unmodified and both can stay enabled because a single configured provider owns routing. The Core updates independently, notifying on discovery, and only switches to a candidate after build, closure verification, and a real startup check succeed.

The application identifier is `xingyunxunzhi.desktop`. If you previously installed a build from before the rename, this version installs as a new application: the application data directory, keychain entries, and update identity are not migrated, so model providers and credentials must be configured again.

The macOS application has an ad-hoc integrity signature but is not signed or notarized with an Apple Developer ID. Windows and Linux community artifacts do not carry a trusted publisher signature. Desktop installer auto-updates remain disabled; independent Core updates remain available. This community prerelease is not promoted to Latest.
