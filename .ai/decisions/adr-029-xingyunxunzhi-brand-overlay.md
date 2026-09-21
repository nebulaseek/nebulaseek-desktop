# ADR-029：星云寻知只维护用户可见品牌覆盖层

## 状态

已接受，2026-09-22。

## 决策

星云寻知 Desktop 持续同步 `deepseek-desktop/deepseek-desktop` 社区上游，并只在用户可见层维护下游品牌：应用和窗口名称、三语菜单文案、图标、浏览器元数据、安装与发布文案、公开仓库链接，以及默认锁定的 XingYunXunZhi Harness 来源。

内部兼容标识保持上游值，包括 npm 包名、Rust crate/bin 名、`deepseek.desktop` Bundle Identifier、`deepseek-desktop` slug、`DEEPSEEK_DESKTOP_*` 环境变量、IPC、应用数据目录、服务名、加密和更新协议。DeepSeek 模型名、社区上游名称和历史技术证据也保留真实名称。

XingYunXunZhi Harness 同样只维护用户可见品牌覆盖。Desktop 的 `harness/toolchain-lock.json` 必须锁定该仓库的不可变品牌提交，不能只改显示地址或跟随可移动分支。

## 上游同步流程

1. 拉取社区上游，将下游 `master` 重置或变基到选定的最新上游提交。
2. 重放一个聚焦的星云寻知品牌提交；冲突只在本 ADR 定义的用户可见表面解决。
3. 检查差异，移除包名、环境变量、IPC、数据目录和协议标识的意外重命名。
4. Harness 品牌提交先发布，再把其不可变 commit 写入 Desktop 工具链 lock。

## 原因

- 用户能在所有实际界面识别星云寻知品牌。
- 插件、脚本、已有数据和 Desktop/Harness 集成继续使用社区版兼容契约。
- 后续上游同步通常只需重放一个品牌提交，减少冲突和维护成本。

## 影响

安装目录、可执行文件、应用数据目录和开发环境变量中仍可能出现 `deepseek-desktop` 或 `DEEPSEEK_DESKTOP_*`。这些属于兼容标识，不是漏改的用户文案。上游新增用户可见界面时，应把对应名称、文案或图片加入品牌覆盖层；不得借品牌修改顺带重构运行时。
