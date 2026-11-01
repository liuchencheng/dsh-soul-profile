# Agent 指令适配 / Agent Instruction Adapter

将以下说明加入 Agent 的系统指令或项目指令，并确保 Agent 能读取 `USER_PROFILE.md`。此模板不会自动安装，也不保证宿主会读取本地文件。 Add the following guidance to the agent's system or project instructions and make `USER_PROFILE.md` available. This template does not install itself or guarantee local-file access.

> 将 `USER_PROFILE.md` 视为用户亲自填写、仅供参考的协作偏好。只在相关时用它调整回答结构、语气、规划和反馈方式。用户当前要求优先。偏好含糊或冲突时先询问。不要据此推断诊断或固定人格类型。用户可以随时修改或删除档案；不要根据对话暗中改写。 Treat `USER_PROFILE.md` as tentative, user-authored collaboration preferences. Apply only relevant preferences to structure, tone, planning, and feedback. The current request always wins. Ask when preferences are unclear or conflict. Do not infer diagnoses or fixed personality types. The user may edit or delete the profile; never silently update it from conversation.

## Codex 适配 / Codex adapter

将 Skill 文件夹保存在工作区或宿主支持的 Skills 位置，让 `USER_PROFILE.md` 在任务上下文中可用，并把上述指令加入项目 `AGENTS.md` 或其他受支持的配置。可让 Agent 复述明确写出的偏好以确认加载。本项目未针对所有 Codex 版本和配置进行测试。 Keep the skill folder in the workspace or another supported Skills location, make `USER_PROFILE.md` available in task context, and add the instruction above to `AGENTS.md` or another supported configuration. Ask the agent to restate explicit preferences to confirm loading. This project has not been tested with every Codex version or configuration.

## ChatGPT 适配 / ChatGPT adapter

可在对话中上传或粘贴 Markdown 档案；若自定义 GPT 支持，可将通用指令加入其配置。不同账号和界面对 Skills 安装或本地文件读取的支持可能不同。仅复制文件夹不会自动配置 ChatGPT。可让配置后的 Agent 复述档案中的明确偏好以确认读取。 Upload or paste the Markdown profile into a conversation, or add the instruction to a custom GPT when supported. Skills installation and local-file access vary by account and surface. Copying this folder alone does not configure ChatGPT. Ask the configured agent to restate explicit preferences to confirm access.

## 其他 Agent / Other agents

将档案作为上下文提供，并把通用指令复制到宿主支持的系统或项目指令中。这是手动适配说明，不是通用插件格式。 Provide the profile as context and copy the general instruction into the host's supported system or project instructions. This is manual adapter guidance, not a universal plugin format.
