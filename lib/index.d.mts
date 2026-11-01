import z from "@deepseek-ai/schemastery";
import { Context, Volatile } from "@deepseek-ai/cordis";
declare const name = "soul-profile";
interface Config {
  profile: Volatile<string | undefined>;
  enabled: Volatile<boolean | undefined>;
  completed: Volatile<boolean | undefined>;
  dismissed: Volatile<boolean | undefined>;
}
interface ConfigValues {
  profile: string | undefined;
  enabled: boolean | undefined;
  completed: boolean | undefined;
  dismissed: boolean | undefined;
}
declare const Config: z<Partial<ConfigValues>, Config>;
/**
 * Host half: profile is a live, profile-local setting written by the UI.
 *
 * `enabled` is a separate switch from the stored text: turning the profile off
 * keeps what the user answered while contributing an empty section, so the
 * agent sees nothing until it is switched back on. A missing `enabled` (older
 * profiles) counts as enabled.
 */
declare function apply(ctx: Context, config: Config): void;
export { Config, apply, name };