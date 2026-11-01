# 更新记录 / Changelog

## 2.1.4

- 重写 README 开头：从「这个插件做什么」改成「为什么要有它」——每开一个新会话，AI 都要重新认识你一遍；让它自己从聊天里总结又是个看不见的黑箱。 Rewrote the README opening: instead of describing what the plugin does, it now explains why it exists — every new session starts from zero, and letting the model summarise you from past chats is a black box.
- 开头改成第一人称口语短句，去掉营销腔与功能罗列；「不是人格测试」降级为一句括号补充，完整边界仍在文末。 The opening is now first-person and conversational, with the "not a personality test" note demoted to a parenthetical while the full limits stay at the end.

## 2.1.3

- 修复关闭弹窗可能不消失的问题：`finish()` 之前只清模块级草稿，没有清组件内的 `screen`；如果宿主调 `complete()` 时并不卸载这个组件，弹窗会留在屏幕上。现在两处一起清。 Fixed a case where the dialog could stay open: `finish()` cleared the module-level draft but not the component's `screen` state, so a host that marks the step done without unmounting would leave the modal on screen.
- README 补充删除档案后的行为：引导弹窗不会再自动出现，重填要走设置。 Documented what happens after deleting: the onboarding dialog will not reappear, so retaking goes through Settings.

## 2.1.2

- 便携 CLI（`skill/tools/profile.py`）的默认建议改为与插件一致的祈使句：此前只有插件改成了可执行指令，CLI 仍输出「计划保留弹性，允许过程中调整」这类描述句，同一条档案走两条路径得到两种质量。 The portable CLI now emits the same imperative instructions as the plugin; previously only the plugin had been upgraded, so the same profile produced different quality depending on the path taken.
- CLI 输出的建议小节改名为「协作方式（请照此执行）」，与插件注入的「请照此协作」对齐。 Renamed the CLI's defaults section to “How to work with me (follow these)”.
- 两处文案互加交叉引用注释，避免 TS 与 Python 两侧各自漂移。 Added cross-reference comments on both sides so the TypeScript and Python copies cannot drift silently.
- 修掉 `decision_basis` 高极文案的一处漂移（「按什么标准」vs「用什么标准」），并新增 `scripts/check-instruction-parity.py` 做逐条比对，纳入 README 的开发流程。 Fixed a wording drift in `decision_basis`/high and added `scripts/check-instruction-parity.py` to compare both copies item by item; documented in the README dev section.
- 覆盖率测试不再断言具体文案，改为断言「7 条建议、每条含分隔符、含预期维度」，改文案时不会误报。 The coverage test now asserts structure (seven defaults, separator present, expected dimension included) instead of exact copy.

## 2.1.1

- 说明文档重写为「直接照做」的结构：README 首屏就是装 3 步 + 用 4 行表格，兼容性与边界压到后面；INSTALL 变成编号步骤 + 排错表。 Rewrote the docs around "just do this": the README opens with a three-step install and a four-row usage table, pushing compatibility and design limits down; INSTALL is now numbered steps plus a troubleshooting table.
- 去掉逐句中英对照，改为中文正文 + 每节一行英文摘要：行数相近（71 → 82），但安装步骤从第 40 行提到第 9 行，扫读成本大幅下降。 Dropped sentence-by-sentence bilingual duplication in favour of Chinese body text with one-line English summaries: about the same length (71 → 82 lines), but the install steps moved from line 40 to line 9.
- 新增「装不上？按这个顺序查」表格，把 `incompatible-version`、路径选错、没重启、插件停用等常见情况一次性列清。 Added a troubleshooting table covering `incompatible-version`, wrong path, missing restart, and a disabled plugin.

## 2.1.0

- **目录结构按 DSH 包命名规范重排**：仓库根目录即插件包（`package.json` 的 `name` 为 `dsh-soul-profile`），不再有 `deepseek-harness/` 这层非标准目录。 The layout now follows DSH package naming: the repository root **is** the plugin package (`dsh-soul-profile`); the non-standard `deepseek-harness/` level is gone.
- 顶层目录由 `soul-profile/` 改为 `dsh-soul-profile/`，与包名一致。 The top-level folder is now `dsh-soul-profile/`, matching the package name.
- 便携 Skill 相关文件（`SKILL.md`、`questions.json`、`scoring.md`、`schema/`、`tools/`、`tests/`、`adapters/`、`examples/`）统一收进 `skill/`。 Portable Skill files moved under `skill/`.
- 构建与测试命令改在仓库根执行：`npm run build` / `npm test` / `python -m unittest discover -s skill/tests`。 Build and test commands now run from the repository root.
- 安装路径随之变化：在 Harness 里粘贴的是**仓库根目录**，不再是子目录。 The install path is now the repository root rather than a subfolder.

## 2.0.6

- 管理页把「关闭并删除档案」拆成两个独立动作：**关闭档案**（暂停注入，内容保留，可随时重新启用）与**删除档案**（清空内容，不可恢复）。 The manage dialog now separates **Disable profile** (pauses injection, keeps the text, reversible) from **Delete profile** (clears the text, irreversible).
- 新增 `enabled` 配置项，Host 半身在 `enabled === false` 时贡献空段落，因此关闭后系统提示里不会留下任何内容。 Added an `enabled` config field: the host half contributes an empty section when it is false, so nothing remains in the system prompt while disabled.
- 设置页按三种状态显示：尚未填写 / 已启用（正在注入）/ 已关闭（不注入）。 The settings page now distinguishes three states: no profile, enabled and injected, or off and not injected.
- `enabled` 缺失时按启用处理，已有档案无需迁移。 A missing `enabled` counts as enabled, so existing profiles need no migration.

## 2.0.5

- 注入系统提示的档案由「描述句」改为「祈使句」：不再写「表达方式：多讲背景」，而是写「结论之后补足背景——说明原因和必要上下文，不要只丢一个结论」。系统提示里命令句的遵守率明显高于形容词。 The injected profile now uses imperative instructions instead of descriptive labels, because commands are followed far more reliably than adjectives in a system prompt.
- 每条指令都带「做什么 + 不要做什么」两面，减少模型自行发挥。 Each instruction states both what to do and what to avoid.
- 档案正文不再附带「（3/3 题）」这类覆盖度注记——那是给人看的，对模型是噪声；覆盖度仍在答题摘要页展示。 Coverage annotations are no longer embedded in the injected text; they remain visible on the summary screen.
- 中英文各 8 组指令（16 极 × 2 语言），与维度两极一一对应。 Eight instruction pairs per language, one per dimension pole.

## 2.0.4

- 重写全部 24 道题的选项：改为具体动作和日常说法，去掉「整体规律」「逻辑一致性」「可核实的细节」这类抽象名词。 Rewrote all 24 item options as concrete, everyday actions instead of abstractions.
- 每题新增场景前缀（如「接手一件没做过的事」「我把事情搞砸了」），答题时不再需要自己脑补情境。 Added a scenario line to every item, so the choice no longer depends on an invented context.
- 题干提示从「以下哪项更符合你在「X」上的偏好」改为「哪一项更像平时的你」，维度名只在摘要页出现。 The prompt is now “Which one is more like you?” instead of naming the dimension mid-question; dimension names appear only on the summary.
- 摘要页的下拉选项从长句改为短标签（如「灵活安排 / 按计划走」「先听我说 / 先给方案」）。 Summary dropdown labels are now short phrases rather than full sentences.
- 计分键（`a_value`，含反向题）与维度归属完全未变，历史档案与既有答案的计分结果不受影响。 Scoring keys, including reverse-keyed items, are unchanged, so existing answers and profiles score exactly as before.

## 2.0.3

- 统一产品命名：界面、文档与适配说明一律使用「灵魂画像 / Soul Profile」，包名保持 `dsh-soul-profile` 不变。 Unified the product name: the UI, docs, and adapter notes now all say “灵魂画像 / Soul Profile”; the package name stays `dsh-soul-profile`.
- 设置导航与页面标题改为「灵魂画像 / Soul Profile」，管理页标题改为「管理灵魂画像」，引导弹窗标题带上前缀便于识别。 Settings navigation and page title are now “灵魂画像 / Soul Profile”, the manage dialog is “管理灵魂画像”, and the onboarding dialog carries the product name.
- 设置页说明改为更准确的一句话：可编辑的协作偏好摘要，不是人格测试或诊断。

## 2.0.2

- 修复答题中途切到其他窗口后回到开头的问题：草稿状态提升到模块作用域，宿主重挂载或配置刷新不再清空题目进度与已选答案。 Fixed the questionnaire jumping back to the intro after switching windows: draft state now lives at module scope, so a host re-mount or config refresh no longer discards progress or answers.
- 修复引导弹窗右上角关闭按钮无响应：改为与“稍后”一致地结束引导；答题页、摘要页与管理页的关闭按钮也统一走同一条退出路径，不再留下空白界面。 Fixed the unresponsive close button: it now ends onboarding like “Later”, and the questions, review, and manage screens share that exit path instead of leaving a blank surface.
- 只有首次就绪时才决定初始界面，配置短暂回到 loading 不再把已打开的问卷顶掉。 The initial screen is decided once; a transient config `loading` state no longer replaces an open questionnaire.

## 2.0.1

- 插件目标版本改为已发布的 DeepSeek Harness `0.2.1-rc.2`：`engines.dsh`、`peerDependencies` 与 `devDependencies` 全部对齐。 Retargeted the plugin to the released DeepSeek Harness `0.2.1-rc.2`: `engines.dsh`, `peerDependencies`, and `devDependencies` now match it.
- 在 `0.2.1-rc.2` 上完成类型检查、单测与构建验证，客户端仅依赖运行时确实提供的 `react`、`@deepseek-ai/dsh-client-store`、`@deepseek-ai/dsh-client-ui-primitives`。 Type-checked, tested, and built against `0.2.1-rc.2`; the client bundle depends only on `react`, `@deepseek-ai/dsh-client-store`, and `@deepseek-ai/dsh-client-ui-primitives`, all of which the runtime provides.
- 安装说明改为 Harness 桌面端「设置 → 插件 → 本地目录」，并说明 CLI 拒绝 `desktop` profile 的限制。 Install guide now points at the desktop plugin manager (Settings → Plugins → local directory) and documents that the CLI refuses the `desktop` profile.
- 新增 `vitest.config.ts` 限定测试范围，避免扫描到依赖目录；新增 `.npmrc` 使用 hoisted 布局，规避 Windows 符号链接权限问题。 Added `vitest.config.ts` to scope tests to `src/`, and `.npmrc` with the hoisted layout to avoid Windows symlink restrictions.

### Harness 首次点击引导 / Harness click-choice onboarding

- 新增 DeepSeek Harness Web 插件、首次引导弹窗与点击式问卷。 Added a Harness Web plugin with first-run dialog and clickable questionnaire.
- 加入明确同意、保存前审阅与修改、本地档案、系统提示注入、稍后与拒绝流程。 Added explicit consent, pre-save review/edit, profile persistence, prompt injection, defer and decline flows.
- 保留便携 Skill 与 CLI，供其他 Agent 作为离线替代方案。 Kept the portable Skill and CLI as an offline option for other agents.
- 新增计分边界测试。 Added scoring edge-case tests.

## 2.0.0

- 平衡问卷正反向计分键，减少固定选择 A 的答题风格偏差。 Balanced positive and reverse-keyed items to reduce response-style bias.
- 移除误导性的 0–100 分数，仅保留粗略倾向和答题覆盖度。 Removed misleading 0–100 scores; retain coarse poles and coverage.
- 低覆盖维度不产生建议，并独立显示覆盖度提醒。 Low-coverage dimensions produce no defaults, and coverage warnings are independent.
- 明确要求同意、支持输出语言、覆盖旧档案缺少双语名称的情况，并加强 Schema 语义约束。 Require explicit consent, support output language, tolerate legacy missing bilingual names, and strengthen schema semantics.
- `schema_version` 改为兼容语义版本格式；旧档案可保留其版本号并按兼容规则校验。 `schema_version` now accepts semantic version strings; legacy profiles retain their original version and are validated against compatibility rules.

## 1.1.0

- 增加中英双语输出、用户修正项和覆盖度提示。 Added bilingual output, user overrides, and coverage notices.

## 1.0.0

- 初始可测试版本。 Initial testable release.
