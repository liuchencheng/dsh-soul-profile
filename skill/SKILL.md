---
name: soul-profile
description: 建立、查看、应用、更新或删除可编辑的沟通与协作偏好档案；非诊断性参考。 Create, review, apply, update, or delete an editable communication and collaboration preference profile; non-diagnostic reference only.
---

# 灵魂画像 / Soul Profile

当用户希望创建、查看、应用、更新或删除灵魂画像（Soul Profile）时使用本 Skill。 Use this skill when the user wants to create, review, apply, update, or delete a Soul Profile.

## 基本原则 / Principles

- 将画像视为用户亲自填写的协作辅助信息，而不是用户的“真实本质”。一份问卷无法可靠地概括一个人的全部性格。 Treat the profile as a user-authored collaboration aid, not the user's “true self.” A questionnaire cannot reliably capture someone's whole personality.
- 本问卷是非正式、参考心理学研究的偏好清单，不是经过验证的心理测验、医疗评估或诊断。不得据分数贴人格或临床标签。 This is an informal, research-informed preference inventory, not a validated psychological test, medical assessment, or diagnosis. Never assign personality or clinical labels from scores.
- 只询问实际互动偏好，不推断心理健康、创伤、身份或其他敏感特征。 Ask only about practical interaction preferences; do not infer mental health, trauma, identity, or other sensitive traits.
- 参与自愿。提问前说明用途、局限和保存方式；允许跳题、修改或停止。 Participation is voluntary. Explain purpose, limitations, and storage before asking; allow skipping, correction, or stopping.
- 答案和生成文件默认留在本地。未经明确要求不传输或放入共享目录，也不询问身份或健康信息。 Keep answers and generated files local by default. Do not transmit or share them without explicit request; do not ask for identifying or health information.
- 档案偏好只是默认值，用户当前明确要求始终优先。含糊时先问，不要过度解读分数。 Profile preferences are defaults; the user's current explicit request always wins. Ask when unclear and do not over-interpret scores.

## 建档流程 / Onboarding

1. 在 Harness Web 中，插件会通过首次引导窗口说明用途、局限和保存方式。用户可稍后处理；只有明确勾选同意后才进入题目。 In Harness Web, the plugin explains purpose, limits and storage in its first-run dialog. The user can defer; questions start only after explicit opt-in.
2. 使用中英双语点击选择题回答 `questions.json` 内的 24 道题，可返回、跳题或退出。 Answer the 24 bilingual click-choice items from `questions.json`; users can go back, skip or exit.
3. 检查 8 个维度摘要及答题覆盖数，可按用户自己的描述修改；低覆盖结果不冒充由答题可靠推得。 Review the eight dimension summaries and answer coverage. Users may correct results; low-coverage answers must not be presented as reliable conclusions.
4. 只有用户点击“保存并启用”后才把摘要写入 Harness profile，并用于后续系统提示词。若选择“不启用”，不保存答案或画像。 Save the summary to the Harness profile and use it in later prompts only after “Save and enable”. “Do not enable” stores neither answers nor profile.
5. Harness UI 之外的宿主可用 `python tools/profile.py score <answers.json> --out <directory> --consent --lang zh|en|both` 离线生成档案；`--lang` 默认 `both`，`--overrides <preferences.json>` 可加用户修正。 Other hosts may use the Python CLI as an offline fallback; it requires consent and can import user overrides.
6. 更新时重新填写或编辑；删除时移除 profile 或清空其中的摘要。不得根据对话推测暗中更新。 Revise by retaking or editing; delete by removing or clearing the profile. Never silently update it from conversational inference.

## 应用档案 / Applying the profile

- 仅在用户或宿主提供 `USER_PROFILE.md` 或 `profile.json` 时读取。 Read `USER_PROFILE.md` or `profile.json` only when the user or host makes it available.
- 只将相关偏好用于回答结构、节奏、详略、规划和反馈方式。 Apply relevant preferences to response structure, pacing, detail, planning, and feedback.
- 用户当前要求优先于旧档案。发现偏好可能变化时遵循当前要求或先询问。 The current request overrides the saved profile. Follow current instructions or ask if preferences may have changed.
- 平台接入说明见 `adapters/agent-instructions.md`。 See `adapters/agent-instructions.md` for platform guidance.

## 文件说明 / Files

- `questions.json`：中英双语题库与计分键。 Bilingual questionnaire and scoring keys.
- `scoring.md`：中英双语计分规则。 Bilingual scoring rules.
- `schema/profile.schema.json`：可移植 JSON Schema。 Portable JSON Schema.
- `tools/profile.py`：无第三方依赖的生成器。 Dependency-free profile generator.
- `adapters/`：平台接入说明。 Platform adapter guidance.
- `tests/`：运行 `python -m unittest discover -s tests -v`。Run automated checks with this command.
