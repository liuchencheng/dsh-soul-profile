# Soul Profile

[中文](README.md)

Admit it — you're fed up with every new session starting with the model getting to know you all over again.

Say nothing, and it falls back to its defaults: three questions first, then a wall of context, then "shall I keep going?"
You've said "just give me the conclusion" plenty of times. It remembers this session, forgets by the next.

You're just as fed up with the other thing: drop one casual sentence and the model treats it like treasure, files it into memory, and starts summarising who you are from your chats. That's a black box — you can't see what it concluded, or whether it got you wrong.

This plugin goes the other way: **create a subconscious version of you, and place it where the model reads first.**

24 click-choice items, 3 minutes. You read the summary first, change whatever doesn't feel right, and enable it once it does.
From then on, every conversation opens with it already knowing how to work with you — no repeating yourself, no guessing.

(To be clear: this is not a personality test or a psychological assessment. It just writes down how you want to be worked with.)

Turn it off or delete it whenever you like. It's just text — nothing reaches the prompt until you hit enable.

## Install: 3 steps

1. Open Harness → **Plugins → Add plugin**
2. Paste the absolute path of **this folder** — the one containing `package.json`
3. **Restart Harness**

## Usage

| I want to… | Where |
|---|---|
| Set it up | The questionnaire opens after restart: tick consent → answer → save and enable |
| Edit it | Settings → Soul Profile → Manage profile → Retake |
| Pause it | Same place → Disable profile (content stays; reopen anytime) |
| Clear it | Same place → Delete profile (cannot be undone) |

Closing the dialog is not the same as disabling the profile. To stop it **auto-appearing**, finish the questionnaire and pick “Do not enable”, or disable it in Settings afterwards.

After deleting, the onboarding dialog will not come back on its own — go to **Settings → Soul Profile** to start again.

## Compatibility

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

## Layout

```
dsh-soul-profile/
├── package.json · cordis.patch.yml   ← plugin manifest
├── src/ · lib/                        ← source and build output
├── skill/                             ← portable Skill (not part of the plugin tarball)
│   ├── SKILL.md · questions.json      ← questionnaire and docs
│   └── schema/ · tools/ · tests/ · examples/
└── README.md · INSTALL.md · SPEC.md · CHANGELOG.md
```

## Limits

- Only the summary **you confirmed** is stored; raw answers are not
- A dimension with fewer than 2 answers is recorded as unknown
- Your current instruction always outranks the profile
- The profile belongs to one profile only

## Development

```sh
npm install
npm run verify                              # type check + tests + build
python -m unittest discover -s skill/tests  # portable Skill tests
python scripts/check-instruction-parity.py  # verify the plugin and CLI instruction copy match
```

The instruction text lives in two places — `src/client/index.tsx` (injected into the system prompt) and `skill/tools/profile.py` (offline CLI). Change one, change the other; the last command checks it.
