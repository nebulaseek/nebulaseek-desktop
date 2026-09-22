# 活跃待办

## 验收范围

当前发布及已解决门禁见 [验证基线](memory/verification.md#nebulaseek-v0152-发布验收)；本文件只列未验证范围与外部条件，不再保留旧失败版本为待发布候选。F01–F24 各自的实测、Mock 和平台边界以 [审计修复验收](memory/audit-remediation.md) 为准，不能用发行成功统一标记全平台全功能通过。

Harness 默认来源使用 `nebulaseek/nebulaseek-harness` 的不可变品牌提交；其代码基线跟随 `deepseek-desktop/deepseek-harness`。RC 基线适配已完成：品牌层重建在 `dsh-v0.1.5-rc.2` 之上，专版版本随之为 `0.1.5.<修订号>`。版本前三段继续取实际锁定 Harness 的基础版本。

历史 `v0.0.0`、`v0.0.1`、`v0.0.2` 标签及 `v0.0.2` 预发布 Release 只作归档；失败 Tag `v0.1.6.2` 保持不可变且没有 Release。`v0.1.6.4` 的 Release 与资产仍在线，但内置 alpha 内核，不作为后续发行基线。

## 更高版本在线会阻塞 Windows 安装验收

- `v0.1.5.1` 的 Windows x64 安装验收失败：新装应用启动后检查 Desktop 更新，发现仍在线且四段版本更高的 `v0.1.6.4`，弹出「发现 Desktop 0.1.6.4」窗口盖住工作台；`scripts/verify-windows-install.ps1` 只识别首次运行引导弹窗，等不到工作台就绪而超时（证据：Run 35716024147 的 UIA 快照与 `[surface] show settings view=update`）。
- 已按用户决定撤下 `v0.1.6.4` 的 Release、资产与 Tag，移除该候选，`v0.1.5.2` 据此重发。
- 该加固已同步社区 `3f2e9cb`：`verify-windows-install.ps1` 按三语把 `update.later` 加入可关闭控件，只隐藏本次提示，仍禁止 `update.download` 与 `update.ignoreVersion`；回归在 `scripts/tests/release-safety.test.mjs` 按 `src/i18n/messages.ts` 实际文案比对。专版三条文案与社区一致；若将来改动这三条文案，该回归会失败，那是提醒同步改 ps1 名单，不是误报。Windows 实机路径要等下一次 Tag 矩阵才会真正跑到。

## 品牌 Harness 仓库的未决项

- 品牌覆盖层重建到 RC 时，`apps/desktop` 的安装器资源与图标、`apps/cli` 的 help 快照、`ui-plugin-manager` 与 office 预览的 locales 在 RC 中没有对应文件，因此未携带品牌。社区基线若日后重新引入这些文件，需要重新核对是否遗漏品牌面。
- `ui-brand-official` 在 RC 下必须显式声明 `ui-conversation` 项目引用，否则 `tsc -b` 会把被引用包源码拉进本项目。升级基线时不要按上游 0.1.6 的引用列表回退该声明。

## 独立搜索扩展的外部验收

- 不同端点、不同凭据的并发隔离仍需真实供应商 GUI 验收；既有 Alibaba MaaS Max / Flash 实测属于同端点同凭据。DeepSeek 并发 HTTP 402 是外部额度失败，不改写为通过、不隐式更换服务。
- Windows x64 发布安装验收不包含真实模型凭据、全部搜索模式及候选升级切换；这些场景仍需独立实测。凭据只经已授权安全入口使用，不进入项目记忆或原始 CI 日志。

## 登录 shell 环境恢复的未验证范围

- `v0.1.6.2` 已通过本机 oMLX 真实对话和 Bash 工具调用；该结果不等同于联网搜索端到端验收。当前仍未在正式发布包内要求模型实际调用 `web_search` 并核对本机 `/v1/web/search` 返回来源。
- 登录 shell 探测与 `PATH` 合并只在 macOS arm64 实测。Linux 走同一条 `cfg(unix)` 路径但未在真机验证；Windows 不执行探测也不提供 Node 兜底，只有 CI 的构建与单元测试覆盖。

## 发布外部条件

- macOS Apple Developer ID 签名与公证尚未接入；具备证书后再启用 stable 发布门禁。
- Windows Authenticode 可信发布者签名尚未接入。
- 桌面安装包自动更新保持关闭，直到安装包签名、Updater 签名材料和真实升级回滚验证全部闭环。
- Harness 仓库切换与可选签名制品协议已实现；仍需在受信任 macOS x64、Windows x64 和 Linux x64 真机分别完成仓库拉取、依赖准备、构建、中断、切换和回滚演练。预构建签名制品通道启用时，另需复测制品生成、下载与验签。

## 平台验证

- Windows 安装长路径回归：用户提供的双语名称安装器在深层 OpenTelemetry 文件写入处失败，截图路径约 260 个字符；短安装目录是当前排查/绕过方法，尚未在用户机器复验。现有 Runner 默认安装成功不覆盖更长用户目录或关闭长路径支持的机器；仍需验证此组合，不能仅凭源码缩短产品名宣称已全面修复。

以下是四平台原生 Runner 的现有 `package:community` 自动门禁，后续发行仍须实际运行成功；当前成功证据见验证基线：

- `verify` 全链（含 Rust 单元测试）在 macOS ARM64/x64、Windows x64、Linux x64 各跑一次；诊断脱敏的 `USERPROFILE` 与 `HOMEDRIVE` + `HOMEPATH` 解析由注入环境的用例覆盖，四个平台都会执行。
- `test:e2e` 与 `harness:smoke`（真实 Harness 启动 + 父进程消亡清理）在四个平台各跑一次。
- 交付闭包扫描拒绝 `.env`、密钥、本机绝对路径和符号链接逃逸，四个平台各扫一次。
- Windows x64 还会安装实际 NSIS 包，验证 x64 PE、工作台和设置菜单、关闭确认、Harness 子进程退出及静默卸载；任一步失败都会阻止汇总发布。

仍然只能由目标平台人工完成、当前尚未做的：

- Linux x64 的窗口内菜单与同窗设置层人工验收：顶部左侧唯一显示“文件 / 编辑 / 视图 / 窗口 / 帮助”，原生弹出项、最大化/最小化、长表单滚动和关闭后会话保持均可用。Windows x64 的发布必需路径由原生安装交互门禁覆盖，非发布路径的完整五组菜单与高 DPI 仍可继续扩展。
- Linux x64 的**正式安装包**人工启动验收：安装、原生窗口标题、Harness sidecar 自动拉起、工作台同窗口加载、退出无残留。Windows x64 正式安装包在每次 Tag 矩阵中执行对应自动验收。
- Linux x64 的凭据库、官方插件列表/配置和对话链路验收。
- 未签名制品在 Gatekeeper 与 SmartScreen 下的实际拦截表现。

Desktop 专版版本提醒已具备安全检查协议；Windows x64 原生硬件与 Linux 环境仍需确认系统浏览器打开官方 Release 页面及网络失败提示。新发现的问题应先用源码和可复现证据确认，再加入本文件。
