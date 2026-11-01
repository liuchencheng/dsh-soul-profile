# 灵魂画像 / Soul Profile — 用户协作偏好 / User collaboration preferences

灵魂画像（Soul Profile）是一个可选的首次引导插件。安装后，DeepSeek Harness Web 的引导界面会显示同意说明；用户选择开始后，通过点击选择题建立一份可编辑、非诊断的协作偏好档案。生成摘要只会在用户审阅并点击“保存并启用”后用于 Agent。

Soul Profile is an optional first-run plugin. Its DeepSeek Harness Web onboarding step explains the choice first. If the user opts in, clickable questions create an editable, non-diagnostic collaboration profile. The agent uses the summary only after the user reviews and saves it.

**当前交付目标 / Current target:** 插件版本 `2.0.6`，目标 DeepSeek Harness `0.2.1-rc.2` 及以上（`<0.3.0`）。Plugin version `2.0.6`, targeting DeepSeek Harness `0.2.1-rc.2` and above, below `0.3.0`.

## 兼容性 / Compatibility

`package.json` 声明 `engines.dsh: ">=0.2.1-rc.2 <0.3.0"`。Harness 安装插件时用 `semver.satisfies(版本, 范围, { includePrerelease: true })` 判定，因此预发布版本也算在内。

The plugin declares `engines.dsh: ">=0.2.1-rc.2 <0.3.0"`. Harness checks it with `semver.satisfies(version, range, { includePrerelease: true })`, so prereleases count.

| Harness 版本 | 允许安装 | 类型检查实测 | 说明 |
|---|---|---|---|
| `0.2.0` 及更早 | ❌ | — | 缺少 `settings.onboarding` 插槽 |
| `0.2.1-alpha.*` / `0.2.1-rc.1` | ❌ | — | 低于声明下限 |
| `0.2.1-rc.2` | ✅ | ✅ | 当前桌面端版本 |
| `0.2.1-rc.3` / `-rc.4` | ✅ | 未单独测 | 介于已测版本之间 |
| `0.2.1-rc.5` | ✅ | ✅ | npm `latest` / `next` |
| `0.2.2-alpha.2` | ✅ | ✅ | npm `alpha` |
| `0.3.0` 及以上 | ❌ | — | 需重新适配后放宽范围 |

“类型检查实测”指把 `devDependencies` 指向该版本、`npm install` 后运行 `tsc --noEmit` 通过；**不代表已完成真机加载验证**。升级 Harness 后请重新跑 `pnpm verify` 并在测试 profile 里走一遍引导流程。

“Type-checked” means `devDependencies` were pointed at that release and `tsc --noEmit` passed after a fresh install; it does **not** mean the plugin was load-tested in a live Harness. After upgrading Harness, rerun `pnpm verify` and walk through onboarding once in a test profile.

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
