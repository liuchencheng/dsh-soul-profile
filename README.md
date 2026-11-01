# 灵魂画像 / Soul Profile

承认吧，你受够了每开一个新会话，AI 都要重新认识你一遍。

你不说，它就按默认的来：先问三个问题，再铺一大段背景，最后问你"要不要继续"。
你讲过很多次"直接给结论"，它这一轮记住了，下一轮又忘了。

也受够了随意说一句话，AI 就如获至宝一样将其加入到记忆中——让 AI 自己从聊天里总结你。
但那是个黑箱：它总结成什么样、有没有总结歪，你看不见。

这个插件换了个方向：**先创造一个潜意识状态下的你，放在它一开始就能读到的地方。**

24 道选择题，3 分钟。答完你先看摘要，不满意就改，改到满意再启用。
之后每次对话，它开局就知道该怎么跟你配合——不用你重复，也不用它猜。

（说清楚一点：这不是人格测试，也不是心理诊断。它只是把你想要的配合方式写下来。）

不想用了随时关掉或删掉。它只是一段文字，你不点"启用"，它不会进提示词。

---

<details>
<summary>English</summary>

Admit it — you're fed up with every new session starting with the model getting to know you all over again.

Say nothing, and it falls back to its defaults: three questions first, then a wall of context, then "shall I keep going?"
You've said "just give me the conclusion" plenty of times. It remembers this session, forgets by the next.

You're just as fed up with the other thing: drop one casual sentence and the model treats it like treasure, files it into memory, and starts summarising who you are from your chats. That's a black box — you can't see what it concluded, or whether it got you wrong.

This plugin goes the other way: **create a subconscious version of you, and place it where the model reads first.**

24 click-choice items, 3 minutes. You read the summary first, change whatever doesn't feel right, and enable it once it does.
From then on, every conversation opens with it already knowing how to work with you — no repeating yourself, no guessing.

(To be clear: this is not a personality test or a psychological assessment. It just writes down how you want to be worked with.)

Turn it off or delete it whenever you like. It's just text — nothing reaches the prompt until you hit enable.

</details>

---

## 装：3 步

1. 打开 Harness → **插件 → 添加插件**
2. 粘贴**本目录**的绝对路径（就是有 `package.json` 的这一层）
3. **重启 Harness**

<details>
<summary>English</summary>

1. Open Harness → **Plugins → Add plugin**
2. Paste the absolute path of **this folder** — the one containing `package.json`
3. **Restart Harness**

</details>

## 用

| 想干什么 | 去哪 |
|---|---|
| 首次填写 | 重启后自动弹问卷，勾选同意 → 答题 → 保存并启用 |
| 改档案 | 设置 → 灵魂画像 → 管理档案 → 重新填写 |
| 暂停 | 同上 → 关闭档案（内容保留，随时能再开） |
| 清空 | 同上 → 删除档案（不可恢复） |

关掉弹窗 ≠ 关掉档案。想让它**不再自动弹**，得走完问卷点「不启用」，或者填完后去设置里关。

删除档案后，引导弹窗也不会再自动出现——想重新填写请自己去 **设置 → 灵魂画像**。

<details>
<summary>English</summary>

| I want to… | Where |
|---|---|
| Set it up | The questionnaire opens after restart: tick consent → answer → save and enable |
| Edit it | Settings → Soul Profile → Manage profile → Retake |
| Pause it | Same place → Disable profile (content stays; reopen anytime) |
| Clear it | Same place → Delete profile (cannot be undone) |

Closing the dialog is not the same as disabling the profile. To stop it **auto-appearing**, finish the questionnaire and pick “Do not enable”, or disable it in Settings afterwards.

After deleting, the onboarding dialog will not come back on its own — go to **Settings → Soul Profile** to start again.

</details>

## 兼容

要求 **DSH 运行时 ≥ `0.2.1-rc.2` 且 `< 0.3.0`**。

| 版本 | 能装 | 验证程度 |
|---|---|---|
| < `0.2.1-rc.2` | ❌ | — |
| `0.2.1-rc.2` | ✅ | 真机跑通 |
| `0.2.1-rc.3` / `-rc.4` | ✅ | 仅版本判定 |
| `0.2.1-rc.5` | ✅ | 类型检查 |
| `0.2.2-alpha.2` | ✅ | 类型检查 |
| ≥ `0.3.0` | ❌ | — |

「类型检查」= API 签名没变，但**没在真实 Harness 里加载过**。

查自己的版本：`<安装目录>/resources/app/dsh/package.json` 里的 `version`。装不上时 Harness 会直接告诉你它检测到的版本。

> 这是 `@deepseek-ai/dsh` 运行时版本，不是桌面端安装包版本。每个人的版本可能不同。

<details>
<summary>English</summary>

Requires **DSH runtime ≥ `0.2.1-rc.2` and `< 0.3.0`**.

| Version | Installable | Verification |
|---|---|---|
| < `0.2.1-rc.2` | ❌ | — |
| `0.2.1-rc.2` | ✅ | Runs in a live Harness |
| `0.2.1-rc.3` / `-rc.4` | ✅ | Version range only |
| `0.2.1-rc.5` | ✅ | Type-checked |
| `0.2.2-alpha.2` | ✅ | Type-checked |
| ≥ `0.3.0` | ❌ | — |

“Type-checked” means the API signatures still match, but the plugin has **not** been loaded in a real Harness of that version.

To check your version: the `version` field of `<install dir>/resources/app/dsh/package.json`. A refused install also reports the version Harness detected.

> This is the `@deepseek-ai/dsh` runtime version, not the desktop installer version. Yours may differ.

</details>

## 目录

```
dsh-soul-profile/
├── package.json · cordis.patch.yml   ← 插件声明
├── src/ · lib/                        ← 源码与构建产物
├── skill/                             ← 便携 Skill（不参与插件打包）
│   ├── SKILL.md · questions.json      ← 题库与说明
│   └── schema/ · tools/ · tests/ · examples/
└── README.md · INSTALL.md · SPEC.md · CHANGELOG.md
```

<details>
<summary>English</summary>

```
dsh-soul-profile/
├── package.json · cordis.patch.yml   ← plugin manifest
├── src/ · lib/                        ← source and build output
├── skill/                             ← portable Skill (not part of the plugin tarball)
│   ├── SKILL.md · questions.json      ← questionnaire and docs
│   └── schema/ · tools/ · tests/ · examples/
└── README.md · INSTALL.md · SPEC.md · CHANGELOG.md
```

</details>

## 边界

- 只记录**你确认过的摘要**，原始答案不保存
- 答题少于 2 题的维度记为「未知」
- 你的当前指令永远优先于档案
- 档案只属于当前 profile

<details>
<summary>English</summary>

- Only the summary **you confirmed** is stored; raw answers are not
- A dimension with fewer than 2 answers is recorded as unknown
- Your current instruction always outranks the profile
- The profile belongs to one profile only

</details>

## 开发

```sh
npm install
npm run verify                              # 类型检查 + 测试 + 构建
python -m unittest discover -s skill/tests  # 便携 Skill 的测试
python scripts/check-instruction-parity.py  # 校验插件与 CLI 的指令文案是否一致
```

指令文案在 `src/client/index.tsx`（注入系统提示）和 `skill/tools/profile.py`（离线 CLI）各存一份，改一处必须同步另一处，最后一条命令就是查这个。

<details>
<summary>English</summary>

```sh
npm install
npm run verify                              # type check + tests + build
python -m unittest discover -s skill/tests  # portable Skill tests
python scripts/check-instruction-parity.py  # verify the plugin and CLI instruction copy match
```

The instruction text lives in two places — `src/client/index.tsx` (injected into the system prompt) and `skill/tools/profile.py` (offline CLI). Change one, change the other; the last command checks it.

</details>
