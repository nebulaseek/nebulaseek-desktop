# 当前交付摘要

- NebulaSeek 专版 `v0.1.6.4` 按急用要求交付原生四平台包，内置 `0.1.6-alpha.2`；RC 适配另行处理。旧 `v0.1.6.3` Release、资产及 Tag 已按用户要求撤下，历史验收记录保留，未重标或混用其安装包。
- 历史首发标签归档为 `v0.0.0`、`v0.0.1`、`v0.0.2`，仅 `v0.0.2` 保留原安装包的预发布 Release。
- 发行版本采用 Harness 对齐的四段数字：前三段等于锁定 Harness 的前三段版本号，第四段是 Desktop 修订号。当前锁定 Harness `0.1.6`，已发布 Desktop 修订号为 `4`；`v0.1.6.2` 只保留失败 Tag，没有 Release。
- Harness 默认来源为 `https://github.com/nebulaseek/nebulaseek-harness.git`，锁定专版 commit `0096f4a28fe7fb3a1cac44fc2b8761dbdd691b97`（名称规范与 WebKit 模型菜单修复已随 `v0.1.6.4` 交付）；其代码基线为社区版 `303d39dab4a88bcd957221d88b663e72e03bf7ee`（`0.1.6-alpha.2`），核心行为保持一致。
- 已同步社区 Desktop `850a88a6827d3758ddcadb7834263aa5a941ccec` 的 alpha/beta 候选过滤与清单校验；源码默认版本为 `0.1.6.4`，专版 Harness 来源和品牌不变。
- 插件配置、插件管理器和只读插件清单使用当前 Harness 机制；Desktop 不保留旧市场 UI 或强制装配逻辑。DSH Market 随首次使用的新 Harness commit 通过官方 `dsh plugin --profile desktop-web add dshmarket@latest` 同步，失败可重试；详见 ADR-028。
- 独立联网搜索扩展通过公开 Agent 上下文、模型目录、搜索 Provider 和设置插槽接入；官方搜索插件保持默认启用，三种模式互斥，Desktop 不补丁改写官方搜索界面或核心路由。
- Desktop 采用单窗口 Tauri Shell，Harness 工作台运行在隔离 WebView；原生生命周期、加密凭据、诊断、更新和菜单由 Rust 管理，工作台不获得通用 Tauri IPC、文件系统或 shell 权限。
- 发布只允许 GitHub 官方托管 Runner 原生构建 macOS ARM64/x64、Windows x64 和 Linux x64。未签名专版制品保持 prerelease；完整验证命令和失败恢复规则见 [发布手册](skills/release-workflow.md)。
- 后续判断必须以当前 HEAD、工具链 lock、生成锁和实际构建结果为准；历史成功发行不替代新四段版本的验证。
- 修复本地构建入口与验证顺序：`pnpm run build` 进入完整 Tauri/Harness 构建，`verify` 和 `test:e2e` 在消费桌面扩展前重新生成 Harness 闭包；Playwright 预览使用独立前端构建，避免旧生成目录造成依赖漏装或完整构建挤占启动超时。
- 新增 oMLX Qwen3.8 官方配置契约示例及暂存 Harness schema 回归；社区上游 `v0.1.6.2` 安装包已用真实模型完成对话和 Bash 工具调用。该结果没有冒充专版 `v0.1.6.3` 的外部 Provider 验收。
- 历史 `v0.1.6.3` Release 曾公开五个 `NebulaSeek_*` 安装包和 `SHA256SUMS`，正文使用专版文案及六条直达链接；六个文件已全部下载复算，正式 ARM64 包已安装并通过标题、Harness 启动、401 边界和退出清理验收。
- Release 正文不再硬编码一次性的版本变化，改为从 `CHANGELOG.md` 的非空“未发布”段生成；应用内统一显示 `NebulaSeek`，公开资产继续使用 `NebulaSeek_*` 前缀。
- 已合入社区 Desktop `5f40d53d4308d796649d90834011b723ea62e0a9` 的文档与发布正文格式；下游单独维护版本关系、下载渠道及 `v0.1.6.3` 原文归档，名称与文档改动已随 `v0.1.6.4` 交付。
