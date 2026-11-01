# Install

[中文](INSTALL.md)

## Desktop (the only recommended path)

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

## Won't install? Check in this order

| Error / symptom | Cause | Fix |
|---|---|---|
| `incompatible-version` | DSH version outside `>=0.2.1-rc.2 <0.3.0` | Upgrade Harness, or change `engines.dsh` in `package.json` |
| “Invalid path” | You pasted the parent folder | Pick the folder that contains `package.json` |
| Installed but nothing happens | Harness was not restarted | Quit Harness completely, then reopen |
| No entry in Settings | The plugin is disabled | Settings → Plugins, make sure it is enabled |
| Dialog closed and never returns | “Later” stores no state | Go to Settings → Soul Profile and start manually |

## Non-desktop profiles (CLI)

If you run the web or CLI build of Harness, use the command line instead:

```sh
dsh plugin --profile <profile name> add .
```

## Local development

```sh
npm install
npm run verify                              # type check + tests + build
python -m unittest discover -s skill/tests  # portable Skill tests
```

Re-run `npm run build` after any change, or `lib/` stays stale.

## Portable Skill (works without the plugin)

`skill/` holds a portable version that does not depend on Harness: `SKILL.md` + `questions.json` + `tools/profile.py`.

It is meant for wiring this questionnaire into another agent — but the host must supply the interactive UI and feed the resulting profile into its context. See `skill/adapters/agent-instructions.md` for the integration notes.
