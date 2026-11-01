# 灵魂画像 / Soul Profile

给 DeepSeek Harness 答一次问卷（24 题，约 3 分钟），之后每次对话都按你的协作偏好来。

不是人格测试，不是心理诊断。答完可以改、可以关、可以删。

*Answer 24 click-choice questions once and DeepSeek Harness adapts to how you collaborate. Not a personality test. Editable, disableable, deletable.*

---

## 装：3 步

1. 打开 Harness → **设置 → 插件 → 安装**
2. 粘贴**本目录**的绝对路径（就是有 `package.json` 的这一层）
3. **重启 Harness**

```
<仓库所在位置>\dsh-soul-profile
```

> ⚠️ 别用 `dsh plugin add`：命令行明确禁止操作 `desktop` profile，桌面端只能走上面的界面。

## 用

| 想干什么 | 去哪 |
|---|---|
| 首次填写 | 重启后自动弹问卷，勾选同意 → 答题 → 保存并启用 |
| 改档案 | 设置 → 灵魂画像 → 管理档案 → 重新填写 |
| 暂停 | 同上 → 关闭档案（内容保留，随时能再开） |
| 清空 | 同上 → 删除档案（不可恢复） |

关掉弹窗 ≠ 关掉档案。想让它**不再自动弹**，得走完问卷点「不启用」，或者填完后去设置里关。

删除档案后，引导弹窗也不会再自动出现——想重新填写请自己去 **设置 → 灵魂画像**。

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
>
> *Runtime version, not the desktop installer version. Yours may differ.*

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

## 边界

- 只记录**你确认过的摘要**，原始答案不保存
- 答题少于 2 题的维度记为「未知」
- 你的当前指令永远优先于档案
- 档案只属于当前 profile

*Only the confirmed summary is stored. Fewer than two answers in a dimension means unknown. Your current instruction always wins. The profile belongs to one profile only.*

## 开发

```sh
npm install
npm run verify                              # 类型检查 + 测试 + 构建
python -m unittest discover -s skill/tests  # 便携 Skill 的测试
python scripts/check-instruction-parity.py  # 校验插件与 CLI 的指令文案是否一致
```

指令文案在 `src/client/index.tsx`（注入系统提示）和 `skill/tools/profile.py`（离线 CLI）各存一份，改一处必须同步另一处，最后一条命令就是查这个。
