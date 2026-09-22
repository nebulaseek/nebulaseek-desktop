# ADR-029：NebulaSeek 只维护用户可见品牌覆盖层

## 状态

已接受，2026-09-22。

## 决策

NebulaSeek Desktop 由 DeepSeek Desktop 社区版维护团队推出，持续同步 `deepseek-desktop/deepseek-desktop` 社区版，并只在用户可见层维护专版品牌：应用和窗口名称、三语菜单文案、图标、浏览器元数据、安装与发布文案、公开仓库链接，以及默认锁定的 NebulaSeek Harness 来源。

侧栏字标按界面语言显示：简体中文为“星云寻知”，繁体中文为“星雲尋知”，英文为 `NebulaSeek`。窗口标题、安装包、应用文件名、安装路径及内部技术标识继续使用 `NebulaSeek` 或原有兼容值；项目组件称为 `NebulaSeek Harness` 与 `NebulaSeek Desktop`。品牌组件复用 Harness 语言插槽，不改模型或会话行为。

内部兼容标识保持上游值，包括 npm 包名、Rust crate/bin 名、`deepseek.desktop` Bundle Identifier、`deepseek-desktop` slug、`DEEPSEEK_DESKTOP_*` 环境变量、IPC、应用数据目录、服务名、加密和更新协议。DeepSeek 模型名、社区上游名称和历史技术证据也保留真实名称。

NebulaSeek Harness 同样只维护用户可见品牌覆盖。Desktop 的 `harness/toolchain-lock.json` 必须锁定该仓库的不可变品牌提交，不能只改显示地址或跟随可移动分支。

## 上游同步流程

1. 拉取并合并选定的社区上游提交，保留下游发布历史与不可变 Tag。
2. 复核已有 NebulaSeek 品牌覆盖；冲突只在本 ADR 定义的用户可见表面解决，社区历史发布正文与验收记录不得冒充专版事实。
3. 检查差异，移除包名、环境变量、IPC、数据目录和协议标识的意外重命名。
4. Harness 品牌提交先推送，再把其不可变 commit 写入 Desktop 工具链 lock。源码同步不要求创建新 Tag；是否发行安装包遵循用户的发布指令。

## 原因

- 用户能在所有实际界面识别 NebulaSeek 品牌。
- 插件、脚本、已有数据和 Desktop/Harness 集成继续使用社区版兼容契约。
- 后续上游同步通常只需重放一个品牌提交，减少冲突和维护成本。

## 影响

安装目录、可执行文件、应用数据目录和开发环境变量中仍可能出现 `deepseek-desktop` 或 `DEEPSEEK_DESKTOP_*`。这些属于兼容标识，不是漏改的用户文案。上游新增用户可见界面时，应把对应名称、文案或图片加入品牌覆盖层；不得借品牌修改顺带重构运行时。
