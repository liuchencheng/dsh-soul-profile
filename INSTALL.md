# 安装 / Install

## 桌面端（唯一推荐路径）

**1.** 打开 Harness → **设置 → 插件 → 安装**

**2.** 粘贴本仓库根目录的绝对路径 —— 就是有 `package.json` 的那一层：

```
E:\...\outputs\dsh-soul-profile
```

**3.** 重启 Harness

**4.** 重启后自动弹出问卷 → 勾选同意 → 答 24 题 → **保存并启用**

装完去 **设置 → 灵魂画像** 能看到入口，就说明成功了。

> ⚠️ **不要用命令行安装。** `dsh plugin add` 会直接报错：
> `profile "desktop" is managed exclusively by the Electron application`
> 桌面端 profile 只归 Electron 应用管，CLI 无权操作。

## 装不上？按这个顺序查

| 报错 / 现象 | 原因 | 怎么办 |
|---|---|---|
| `incompatible-version` | DSH 版本不在 `>=0.2.1-rc.2 <0.3.0` 内 | 升级 Harness，或改 `package.json` 的 `engines.dsh` |
| 提示路径无效 | 粘贴的是父目录 | 选到有 `package.json` 的那一层 |
| 装完没反应 | 没重启 | 完全退出 Harness 再打开 |
| 设置里没有入口 | 插件被停用 | 设置 → 插件，确认它是启用状态 |
| 弹窗关了不再出现 | 「稍后」不写状态 | 去设置 → 灵魂画像 手动开始 |

## 非桌面 profile（CLI）

如果你用的是 Web / CLI 版 Harness，可以走命令行：

```sh
dsh plugin --profile <profile 名> add .
```

## 本地开发

```sh
npm install
npm run verify                              # 类型检查 + 测试 + 构建
python -m unittest discover -s skill/tests  # 便携 Skill 的测试
```

改动后要重新 `npm run build`，`lib/` 才会更新。

## 便携 Skill（不用插件也能用）

`skill/` 下是独立于 Harness 的可移植版本：`SKILL.md` + `questions.json` + `tools/profile.py`。

适合把这份问卷接进别的 Agent —— 但需要宿主自己提供交互界面，并负责把生成的档案塞进上下文。接入方式见 `skill/adapters/agent-instructions.md`。
