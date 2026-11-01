# 灵魂画像 / Soul Profile — 产品与技术规格 / Product and technical specification

## 产品目标 / Product goal

在 DeepSeek Harness 安装插件后，首次进入引导流程时显示一个可点击的窗口。用户可先阅读说明并同意，再答题、查看摘要、修改结果，最后选择是否保存并启用。Agent 从下一次提示词组装起参考已保存摘要。

After installing the DeepSeek Harness plugin, the onboarding flow presents a clickable dialog. The user can read the notice, opt in, answer questions, review and edit the summary, then choose whether to save and enable it. The agent uses the saved summary in subsequent prompt assemblies.

Harness 当前实现基于 `settings.onboarding` 列表插槽，安装后首次启动并挂载设置外壳时呈现；“稍后”不保存状态并允许以后再提示。“不启用”会记录拒绝。桌面端与 Web 端共用同一渲染层，兼容范围见 README 的兼容性表。 Runtime behavior relies on the `settings.onboarding` list slot and appears when the installed Harness settings shell mounts. “Later” stores no choice and allows another prompt; “Do not enable” records the decline. Desktop and web share the same renderer; the supported version range is in the README compatibility table.

## 研究与安全边界 / Research and safety

- 24 道题覆盖 8 个实用协作偏好维度。题目借鉴一般人格研究中的连续偏好思路，但不是经过验证的心理测量工具，结果不代表人格事实。 The 24 items cover eight practical collaboration preference dimensions. They borrow the idea of continuous preferences from general personality research but are not a validated measure and do not establish personality facts.
- 不诊断心理疾病、不推断临床特征或敏感身份，不向用户贴固定类型标签。 No mental-health diagnosis, clinical-trait or sensitive-identity inference, or fixed personality labels.
- 明确自愿与保存用途；可以跳题、退出、修改摘要、拒绝或删除。原始答题仅保留在当前浏览器运行内存，不写入 Host；Host 仅保存用户确认后的摘要和引导状态。 Explain opt-in and use. Users may skip, exit, edit the summary, decline or delete. Raw answers stay in browser memory and are not written to Host; Host stores only the user-approved summary and onboarding state.
- 计分是粗略方向：每维 3 题，少于 2 题为 `unknown`；答 2 题时一正一反为 `mixed`；3 题出现 2:1 时呈现多数方向。不输出 0–100 分数。 Scoring is coarse: fewer than two answers yields `unknown`; a 1:1 split across two answers is `mixed`; a 2:1 majority across three answers is directional. No 0–100 scores.
- 用户可在预览中覆盖系统计分。覆盖项会标记为用户调整，并保留答题覆盖数。用户当前明确指令始终优先于画像。 Users can override a computed result in preview. Overrides are marked and retain the actual answer count. Current explicit instructions always outrank the profile.

## 实现与持久化 / Implementation and persistence

- 仓库根目录即插件包（`dsh-soul-profile`）：客户端注册首次引导 UI 和设置管理页，写入本 profile 的配置表单；Host 插件通过 `ctx.systemPrompt.section()` 动态读取档案。 The repository root is the plugin package (`dsh-soul-profile`): the client registers onboarding UI and a settings management page; the Host reads the saved profile dynamically through `ctx.systemPrompt.section()`.
- 持久化档案仅包含确认后的 Markdown 偏好摘要；不存原始答案、身份信息或隐式推断。 The persisted profile contains only the approved Markdown summary, with no raw answers, identity data or inferred traits.
- 插件版本即项目发布版本；构建基线为 Harness 运行时 `0.2.1-rc.2`，支持范围 `>=0.2.1-rc.2 <0.3.0`。Harness UI API 会变化，升级 Harness 后需重新执行类型检查与冒烟验证。 The plugin version is the project release version; it is built against Harness runtime `0.2.1-rc.2` and supports `>=0.2.1-rc.2 <0.3.0`. Harness UI APIs may change, so re-run type checks and smoke tests after upgrading.
- `skill/tools/profile.py`、`skill/schema/profile.schema.json` 和 `skill/SKILL.md` 是可移植离线核心；它们不会让其他 Agent 自动弹出窗口。 `skill/tools/profile.py`, `skill/schema/profile.schema.json` and `skill/SKILL.md` form the portable offline core; they do not make other agents display a dialog automatically.

## 验收条件 / Acceptance criteria

- Harness 首次引导窗口可显示；未明确同意不能开始；稍后、拒绝、完成保存各自行为不同。 Harness onboarding appears; no start without opt-in; Later, decline and save have distinct outcomes.
- 题目中英双语、可跳过、有进度与返回；摘要可手动覆盖并明确显示答题数。 Questions are bilingual, skippable, show progress and allow going back; summaries can be edited and show coverage.
- 画像仅在确认保存后注入系统提示；清空/删除后不再注入。 The prompt receives a profile only after explicit save; clearing or deleting it removes the prompt section.
- 计分测试覆盖反向键、2:1、双题平衡、单题不足和空答卷；运行时接入需另在 Harness profile 验证。 Scoring tests cover reverse keys, 2:1 direction, a two-answer split, insufficient single answers and blanks; runtime integration still needs a live Harness profile test.
