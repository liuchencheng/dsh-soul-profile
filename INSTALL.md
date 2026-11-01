# 安装 / Install

## 桌面端（唯一推荐路径）

**1.** 打开 Harness → **插件 → 添加插件**

**2.** 粘贴本仓库根目录的绝对路径 —— 就是有 `package.json` 的那一层：

```
<仓库所在位置>\dsh-soul-profile
```

**3.** 重启 Harness

**4.** 重启后自动弹出问卷 → 勾选同意 → 答 24 题 → **保存并启用**

装完去 **设置 → 灵魂画像** 能看到入口，就说明成功了。

> ⚠️ **不要用命令行安装。** `dsh plugin add` 会直接报错：
> `profile "desktop" is managed exclusively by the Electron application`
> 桌面端 profile 只归 Electron 应用管，CLI 无权操作。

**English**

**1.** Open Harness → **Plugins → Add plugin**

**2.** Paste the absolute path of this repository root — the folder containing `package.json`:

```
<wherever you put it>\dsh-soul-profile
```

**3.** Restart Harness

**4.** The questionnaire opens after restart → tick consent → answer 24 items → **Save and enable**

Once **Settings → Soul Profile** shows an entry, the install worked.

> ⚠️ **Do not install from the command line.** `dsh plugin add` fails outright:
> `profile "desktop" is managed exclusively by the Electron application`
> The desktop profile belongs to the Electron app; the CLI has no authority over it.

## 装不上？按这个顺序查

| 报错 / 现象 | 原因 | 怎么办 |
|---|---|---|
| `incompatible-version` | DSH 版本不在 `>=0.2.1-rc.2 <0.3.0` 内 | 升级 Harness，或改 `package.json` 的 `engines.dsh` |
| 提示路径无效 | 粘贴的是父目录 | 选到有 `package.json` 的那一层 |
| 装完没反应 | 没重启 | 完全退出 Harness 再打开 |
| 设置里没有入口 | 插件被停用 | 设置 → 插件，确认它是启用状态 |
| 弹窗关了不再出现 | 「稍后」不写状态 | 去设置 → 灵魂画像 手动开始 |

**English**

| Error / symptom | Cause | Fix |
|---|---|---|
| `incompatible-version` | DSH version outside `>=0.2.1-rc.2 <0.3.0` | Upgrade Harness, or change `engines.dsh` in `package.json` |
| “Invalid path” | You pasted the parent folder | Pick the folder that contains `package.json` |
| Installed but nothing happens | Harness was not restarted | Quit Harness completely, then reopen |
| No entry in Settings | The plugin is disabled | Settings → Plugins, make sure it is enabled |
| Dialog closed and never returns | “Later” stores no state | Go to Settings → Soul Profile and start manually |

## 非桌面 profile（CLI）

如果你用的是 Web / CLI 版 Harness，可以走命令行：

```sh
dsh plugin --profile <profile 名> add .
```

**English**

If you run the web or CLI build of Harness, use the command line instead:

```sh
dsh plugin --profile <profile name> add .
```

## 本地开发

```sh
npm install
npm run verify                              # 类型检查 + 测试 + 构建
python -m unittest discover -s skill/tests  # 便携 Skill 的测试
```

改动后要重新 `npm run build`，`lib/` 才会更新。

**English**

```sh
npm install
npm run verify                              # type check + tests + build
python -m unittest discover -s skill/tests  # portable Skill tests
```

Re-run `npm run build` after any change, or `lib/` stays stale.

## 便携 Skill（不用插件也能用）

`skill/` 下是独立于 Harness 的可移植版本：`SKILL.md` + `questions.json` + `tools/profile.py`。

适合把这份问卷接进别的 Agent —— 但需要宿主自己提供交互界面，并负责把生成的档案塞进上下文。接入方式见 `skill/adapters/agent-instructions.md`。

**English**

`skill/` holds a portable version that does not depend on Harness: `SKILL.md` + `questions.json` + `tools/profile.py`.

It is meant for wiring this questionnaire into another agent — but the host must supply the interactive UI and feed the resulting profile into its context. See `skill/adapters/agent-instructions.md` for the integration notes.
