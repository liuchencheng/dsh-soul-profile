import z from "@deepseek-ai/schemastery";
// src/index.ts
const name = "soul-profile";
const Config = z.object({
	profile: z.string().volatile(),
	enabled: z.boolean().volatile(),
	completed: z.boolean().volatile(),
	dismissed: z.boolean().volatile()
});
/**
* Host half: profile is a live, profile-local setting written by the UI.
*
* `enabled` is a separate switch from the stored text: turning the profile off
* keeps what the user answered while contributing an empty section, so the
* agent sees nothing until it is switched back on. A missing `enabled` (older
* profiles) counts as enabled.
*/
function apply(ctx, config) {
	ctx.inject(["systemPrompt"], (promptCtx) => {
		promptCtx.systemPrompt.section({
			name: "soul-profile:collaboration-preferences",
			order: 8e3,
			text: () => config.enabled.get() === false ? "" : (config.profile.get() ?? "").trim()
		});
	});
}
export { Config, apply, name };
