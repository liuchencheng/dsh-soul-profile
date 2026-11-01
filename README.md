# 灵魂画像 / Soul Profile — 用户协作偏好 / User collaboration preferences

灵魂画像（Soul Profile）是一个可选的首次引导插件。安装后，DeepSeek Harness Web 的引导界面会显示同意说明；用户选择开始后，通过点击选择题建立一份可编辑、非诊断的协作偏好档案。生成摘要只会在用户审阅并点击“保存并启用”后用于 Agent。

Soul Profile is an optional first-run plugin. Its DeepSeek Harness Web onboarding step explains the choice first. If the user opts in, clickable questions create an editable, non-diagnostic collaboration profile. The agent uses the summary only after the user reviews and saves it.

**当前版本 / Current version:** 插件 `2.1.0`；构建基线为 DeepSeek Harness 运行时 `0.2.1-rc.2`，支持范围见下方兼容性表。Plugin `2.1.0`; built against the DeepSeek Harness runtime `0.2.1-rc.2`, with the supported range in the table below.

## 兼容性 / Compatibility

`package.json` 声明 `engines.dsh: ">=0.2.1-rc.2 <0.3.0"`。Harness 安装插件时用 `semver.satisfies(版本, 范围, { includePrerelease: true })` 判定，因此预发布版本也算在内。

The plugin declares `engines.dsh: ">=0.2.1-rc.2 <0.3.0"`. Harness checks it with `semver.satisfies(version, range, { includePrerelease: true })`, so prereleases count.

> **这里的版本指 `@deepseek-ai/dsh` 运行时版本，不是桌面端安装包版本。** 两者通常一致，但每个人装到的版本各不相同——请以自己的 Harness 为准，不要假设和别人相同。
>
> **The version below is the `@deepseek-ai/dsh` runtime version, not the desktop installer version.** They usually match, but each install can differ; check your own rather than assuming.
>
> 查看方式 / How to check：`<Harness 安装目录>/resources/app/dsh/package.json` 的 `version` 字段。装不上时，Harness 的报错会直接给出它检测到的版本与要求的范围。/ Read the `version` field of `<install dir>/resources/app/dsh/package.json`; a refused install also reports both the detected version and the required range.

| DSH 运行时版本 | 允许安装 | 验证程度 | 备注 |
|---|---|---|---|
| 低于 `0.2.1-rc.2` | ❌ | — | 低于声明下限；`settings.onboarding` 等插槽与 API 不保证存在 |
| `0.2.1-rc.2` | ✅ | 真机加载 + 类型检查 | 声明下限；插件按此版本构建 |
| `0.2.1-rc.3` / `-rc.4` | ✅ | 仅 semver 判定 | 未单独验证 |
| `0.2.1-rc.5` | ✅ | 类型检查 | npm `latest` / `next` |
| `0.2.2-alpha.2` | ✅ | 类型检查 | npm `alpha` |
| `0.3.0` 及以上 | ❌ | — | 主版本变更，需重新适配后放宽范围 |

**验证程度**的含义 / What the column means：

- **真机加载 + 类型检查**：在该版本的真实 Harness 里装过，走完引导、保存、注入流程，且 `tsc --noEmit` 通过。 / Installed in a live Harness of that version and walked through onboarding, save, and injection; `tsc --noEmit` also passed.
- **类型检查**：把 `devDependencies` 指向该版本、重新安装后 `tsc --noEmit` 通过，**未在真实 Harness 里加载**。 / `devDependencies` were pointed at that release and `tsc --noEmit` passed after a fresh install; **not** load-tested in a live Harness.
- **仅 semver 判定**：只确认版本落在声明范围内，未做任何构建或运行验证。 / Only confirmed the version falls inside the declared range.

升级 Harness 后建议重新跑 `npm run verify`，并在测试 profile 里走一遍引导流程。/ After upgrading Harness, rerun `npm run verify` and walk through onboarding once in a test profile.

## 快速开始 / Quick start

请先阅读 [安装指南 / Install guide](INSTALL.md)。仓库根目录就是 DSH 插件包本体（`package.json` 的 `name` 为 `dsh-soul-profile`），便携 Skill、离线问卷和 Python 工具收在 `skill/`。Read the install guide first. The repository root **is** the DSH plugin package (its `package.json` name is `dsh-soul-profile`); the portable Skill, offline questionnaire and Python tool live under `skill/`.

```sh
dsh plugin --profile <profile> add .
```

## 目录 / Contents

```
dsh-soul-profile/            ← 插件包根（包名 dsh-soul-profile）
├── package.json             ← engines.dsh / dsh.bundle / dsh.client 声明
├── cordis.patch.yml         ← bundle 层：插入 soul-profile 插件行
├── src/                     ← TypeScript 源码（Host 半 + Web 半）
├── lib/                     ← 构建产物（index.mjs / client.js）
├── tsconfig.json · tsdown.config.ts · vitest.config.ts · .npmrc
└── skill/                   ← 便携 Skill（不参与插件打包）
    ├── SKILL.md
    ├── questions.json
    ├── scoring.md
    ├── schema/ · tools/ · tests/
    ├── adapters/ · examples/
```

- `src/`、`lib/`、`cordis.patch.yml` — DSH 插件本体：首次引导 UI、设置管理页、Host 提示词注入、计分与测试。
- `skill/` — 可移植 Skill 与离线工具：`SKILL.md`、`questions.json`（24 题双语题库与计分键）、`schema/profile.schema.json`、`tools/profile.py`、`adapters/`（宿主接入说明）、`examples/`（已审阅样例）。
- `SPEC.md` — 产品与技术规格；`INSTALL.md` — 安装指南；`CHANGELOG.md` — 更新记录。

## 设计边界 / Design limits

该问卷只用于协作偏好，不是经过验证的心理测量工具，不推断心理疾病或人格类型。题目允许跳过；答题少于两题的维度显示未知；用户当前指令始终优先。Harness 只持久化整理后的摘要和引导状态，不保存原始答题。

The questionnaire is for collaboration preferences, not a validated psychological measure. It does not infer disorders or personality types. Questions can be skipped; a dimension with fewer than two answers remains unknown; current user instructions always take priority. Harness stores only the reviewed summary and onboarding state, not raw answers.
