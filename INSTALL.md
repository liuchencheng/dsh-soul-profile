# 安装与使用 / Install and use

## DeepSeek Harness 插件 / DeepSeek Harness plugin

此版本以 Harness Web 插件为主要入口。它使用 Harness 的 `settings.onboarding` 界面插槽显示首次引导，用户完成同意后才会看到点击式问卷。插件安装本身不会绕过 Harness：首次启动 Harness Web 并载入设置界面时显示引导；“稍后”会在下一次引导机会再次出现。插件版本为 `2.0.1`，Harness 目标版本为 `0.2.1-rc.2` 系列。

This version targets the Harness Web plugin interface. It registers a first-run step in Harness's `settings.onboarding` slot. Installation does not silently accept anything: the dialog appears when the Web UI loads its settings shell. Choosing “Later” leaves it eligible for the next onboarding opportunity. Plugin version is `2.0.1`; the target DSH release is the `0.2.1-rc.2` line.

### 从本地目录安装 / Install from a local directory

**桌面端（推荐）/ Desktop app (recommended)**

1. 打开 DeepSeek Harness → 设置 → 插件 → 安装，粘贴**本仓库根目录**的绝对路径（该目录的 `package.json` 就是 `dsh-soul-profile`）。Open DeepSeek Harness → Settings → Plugins → Install, then paste the absolute path of **this repository root** — the folder whose `package.json` is `dsh-soul-profile`.
2. 安装完成后重启 Harness。首次进入设置界面时会出现引导弹窗，可选择“稍后”或勾选同意再开始。Restart Harness after installing. The onboarding dialog appears the first time the settings shell loads; choose “Later” or opt in and start.
3. 完成 24 道点击题后检查摘要，必要时修改；只有点击“保存并启用”后档案才进入当前 profile 的 Host 配置与后续 Agent 系统提示词。Answer the 24 click-choice questions, review and adjust the summary, then select “Save and enable” to store it in this profile and include it in later agent system prompts.
4. 后续在 Harness 设置中的 **灵魂画像 / Soul Profile** 页面重新填写、查看或删除档案；该档案只属于当前 profile。Use **Soul Profile** in Harness Settings to retake, review or delete the profile. It belongs only to the current profile.

> **CLI 限制 / CLI limitation**：`dsh` 命令行明确拒绝操作 `desktop` profile（`profile "desktop" is managed exclusively by the Electron application`），因此桌面端只能用上面的界面安装。CLI 的 `dsh plugin --profile <name> add <path>` 仅适用于非桌面 profile。The `dsh` CLI refuses the `desktop` profile (`profile "desktop" is managed exclusively by the Electron application`), so desktop installs must go through the UI above. `dsh plugin --profile <name> add <path>` applies to non-desktop profiles only.

> 插件对 `engines.dsh` 声明 `>=0.2.1-rc.2 <0.3.0`。Harness 在安装时会比对这一范围，版本不符将直接拒绝安装（`incompatible-version`）。The plugin declares `engines.dsh` as `>=0.2.1-rc.2 <0.3.0`. Harness checks this range during installation and refuses mismatched versions with `incompatible-version`.

### 本地构建与验证 / Build and verify

需要 Node.js、pnpm、匹配版本的 Harness 包和依赖。Install dependencies, build and run the adapter tests from this directory:

```sh
pnpm install
pnpm build
pnpm test
```

验证清单：空档案显示首次引导；未勾选同意时不能开始；稍后不保存答案；1/3 覆盖显示未知；2:1 结果保留方向性；保存后重启不再弹问卷；删除后档案不再注入提示词。Verification checklist: first-run dialog for an empty profile; no start without opt-in; Later stores no answers; 1/3 coverage stays unknown; a 2:1 result remains directional; saved profile suppresses repeat onboarding and appears in prompts after restart; deleting the profile removes that prompt section.

## 通用 Skill 与 CLI / Portable Skill and CLI

`skill/SKILL.md`、`skill/questions.json`、`skill/schema/` 和 `skill/tools/profile.py` 保留为可移植核心及离线备选方案。其他 Agent 不会自动显示 Harness 窗口；必须由宿主提供交互式 UI 并把生成档案注入 Agent 上下文。详见 `skill/adapters/agent-instructions.md`。The Skill, questionnaire, schema and Python CLI remain as a portable core and offline fallback under `skill/`. Other agents do not automatically get a Harness window: a host must provide its own UI and inject the resulting profile into agent context. See `skill/adapters/agent-instructions.md`.
