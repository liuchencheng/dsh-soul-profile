window.__ModuleLoader__.load({ id: 'dsh-soul-profile', factory: (require) => { var module = { exports: {} }; var exports = module.exports;
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
let react = require("react");
let _deepseek_ai_dsh_client_ui_primitives = require("@deepseek-ai/dsh-client-ui-primitives");
let _deepseek_ai_dsh_client_store = require("@deepseek-ai/dsh-client-store");
let react_jsx_runtime = require("react/jsx-runtime");
// src/client/scoring.ts
const bank = {
	version: "2.0.0",
	dimensions: [
		{
			"id": "structure",
			"name": "计划与灵活度",
			"low": "灵活安排",
			"high": "按计划走",
			"name_en": "Planning and flexibility",
			"low_en": "Flexible",
			"high_en": "Planned"
		},
		{
			"id": "social_energy",
			"name": "社交刺激偏好",
			"low": "安静、一对一",
			"high": "热闹、一起聊",
			"name_en": "Social stimulation",
			"low_en": "Quiet, one-to-one",
			"high_en": "Lively, together"
		},
		{
			"id": "information_style",
			"name": "信息接收方式",
			"low": "具体例子",
			"high": "整体概览",
			"name_en": "Information style",
			"low_en": "Concrete examples",
			"high_en": "Big picture"
		},
		{
			"id": "decision_basis",
			"name": "决策侧重",
			"low": "看对人的影响",
			"high": "看证据和标准",
			"name_en": "Decision emphasis",
			"low_en": "Impact on people",
			"high_en": "Evidence and rules"
		},
		{
			"id": "expression",
			"name": "表达方式",
			"low": "简短含蓄",
			"high": "多讲背景",
			"name_en": "Expression style",
			"low_en": "Brief and understated",
			"high_en": "Context and feeling"
		},
		{
			"id": "feedback",
			"name": "反馈方式",
			"low": "温和委婉",
			"high": "直接了当",
			"name_en": "Feedback style",
			"low_en": "Gentle and framed",
			"high_en": "Direct and plain"
		},
		{
			"id": "autonomy",
			"name": "协作自主度",
			"low": "多沟通",
			"high": "独立做",
			"name_en": "Collaboration autonomy",
			"low_en": "Check in often",
			"high_en": "Work independently"
		},
		{
			"id": "stress_support",
			"name": "压力时的支持方式",
			"low": "先听我说",
			"high": "先给方案",
			"name_en": "Support under stress",
			"low_en": "Listen first",
			"high_en": "Solutions first"
		}
	],
	questions: [
		{
			"id": "Q01",
			"dimension": "structure",
			"a": "先干起来，边做边摸清",
			"b": "先想清楚步骤，再开始动手",
			"a_value": -1,
			"a_en": "Jump in and figure it out as I go",
			"b_en": "Work out the steps first, then start",
			"scenario": "接手一件没做过的事",
			"scenario_en": "Taking on something I've never done"
		},
		{
			"id": "Q02",
			"dimension": "structure",
			"a": "先把每天要做的事列出来",
			"b": "先定个大概，中途再调整",
			"a_value": 1,
			"a_en": "List what to do each day up front",
			"b_en": "Set a rough direction and adjust along the way",
			"scenario": "开始一个要花好几天的工作",
			"scenario_en": "Starting work that takes several days"
		},
		{
			"id": "Q03",
			"dimension": "structure",
			"a": "留出空档，临时再定",
			"b": "提前排好，按表走",
			"a_value": -1,
			"a_en": "Leave gaps and decide later",
			"b_en": "Plan ahead and follow the schedule",
			"scenario": "安排接下来一周",
			"scenario_en": "Planning the coming week"
		},
		{
			"id": "Q04",
			"dimension": "social_energy",
			"a": "一群人一起聊，边说边想",
			"b": "自己先想清楚，或只跟一个人聊",
			"a_value": 1,
			"a_en": "Talk it through with a group",
			"b_en": "Think it through alone, or with one person",
			"scenario": "遇到一个要拿主意的问题",
			"scenario_en": "Facing a problem that needs a decision"
		},
		{
			"id": "Q05",
			"dimension": "social_energy",
			"a": "热闹一天后，我需要独处缓一缓",
			"b": "跟人聊完，我通常更有精神",
			"a_value": -1,
			"a_en": "After a busy day with people I need time alone",
			"b_en": "Talking with people usually leaves me energized",
			"scenario": "连续和人打交道一整天之后",
			"scenario_en": "After a full day around people"
		},
		{
			"id": "Q06",
			"dimension": "social_energy",
			"a": "你来我往、节奏快的对话",
			"b": "安静、能慢慢说的对话",
			"a_value": 1,
			"a_en": "Fast back-and-forth conversation",
			"b_en": "Quiet conversation with room to think",
			"scenario": "聊天时我更享受",
			"scenario_en": "In conversation I enjoy"
		},
		{
			"id": "Q07",
			"dimension": "information_style",
			"a": "先给我一个具体的例子",
			"b": "先告诉我整体是怎么回事",
			"a_value": -1,
			"a_en": "Give me a concrete example first",
			"b_en": "Tell me the big picture first",
			"scenario": "了解一件新事物",
			"scenario_en": "Getting to know something new"
		},
		{
			"id": "Q08",
			"dimension": "information_style",
			"a": "先聊有哪些可能、意味着什么",
			"b": "先说现在能确认的事实",
			"a_value": 1,
			"a_en": "Explore what could happen and what it means",
			"b_en": "Start with what we can confirm right now",
			"scenario": "讨论一个还没有定论的方案",
			"scenario_en": "Discussing a plan that isn't settled yet"
		},
		{
			"id": "Q09",
			"dimension": "information_style",
			"a": "看几个真实案例，我就懂了",
			"b": "先看一张全景图，再看案例",
			"a_value": -1,
			"a_en": "Show me a few real cases and I get it",
			"b_en": "Show me the whole picture, then the cases",
			"scenario": "学一个新概念",
			"scenario_en": "Learning a new concept"
		},
		{
			"id": "Q10",
			"dimension": "decision_basis",
			"a": "把证据摆出来，用同一套标准比",
			"b": "先看这个决定会影响到谁",
			"a_value": 1,
			"a_en": "Lay out the evidence and compare by the same standard",
			"b_en": "Start with who this decision affects",
			"scenario": "在两个方案之间选一个",
			"scenario_en": "Choosing between two options"
		},
		{
			"id": "Q11",
			"dimension": "decision_basis",
			"a": "同样的规则，也要看各人的具体情况",
			"b": "同样的规则，对所有人一样执行",
			"a_value": -1,
			"a_en": "Same rule, but each person's situation matters",
			"b_en": "Same rule, applied the same way to everyone",
			"scenario": "定规则、分资源的时候",
			"scenario_en": "Setting rules or dividing resources"
		},
		{
			"id": "Q12",
			"dimension": "decision_basis",
			"a": "先看哪种做法前后一致、说得通",
			"b": "先看哪种做法对人伤害最小",
			"a_value": 1,
			"a_en": "Which option is consistent and holds together",
			"b_en": "Which option hurts people least",
			"scenario": "遇到两难的选择",
			"scenario_en": "Facing a choice where both sides cost something"
		},
		{
			"id": "Q13",
			"dimension": "expression",
			"a": "消息短一点，说清楚就行",
			"b": "多说点背景，也说说我的感受",
			"a_value": -1,
			"a_en": "Keep it short and to the point",
			"b_en": "Add context and say how I feel",
			"scenario": "发消息说明一件事",
			"scenario_en": "Explaining something in a message"
		},
		{
			"id": "Q14",
			"dimension": "expression",
			"a": "多举几个例子，把细节讲透",
			"b": "少说几句，直接讲重点",
			"a_value": 1,
			"a_en": "Use examples and spell out the details",
			"b_en": "Say less and get straight to the point",
			"scenario": "解释一个复杂的问题",
			"scenario_en": "Explaining something complicated"
		},
		{
			"id": "Q15",
			"dimension": "expression",
			"a": "语气平一点、低调一点",
			"b": "语气暖一点、有起伏一点",
			"a_value": -1,
			"a_en": "A calm, low-key tone",
			"b_en": "A warm, expressive tone",
			"scenario": "我平时说话的语气",
			"scenario_en": "My usual tone of voice"
		},
		{
			"id": "Q16",
			"dimension": "feedback",
			"a": "有问题直接说，别绕",
			"b": "先说背景，再慢慢提",
			"a_value": 1,
			"a_en": "Say the problem straight",
			"b_en": "Set the context first, then raise it",
			"scenario": "别人的方案有明显问题",
			"scenario_en": "Someone's plan has an obvious problem"
		},
		{
			"id": "Q17",
			"dimension": "feedback",
			"a": "先肯定做得好的地方，再说问题",
			"b": "问题优先说清楚，语气直一点没关系",
			"a_value": -1,
			"a_en": "Acknowledge what works, then raise the problem",
			"b_en": "State the problem clearly even if it lands hard",
			"scenario": "要指出别人做得不对",
			"scenario_en": "Pointing out that someone got it wrong"
		},
		{
			"id": "Q18",
			"dimension": "feedback",
			"a": "有顾虑就当场说出来",
			"b": "找个合适的时候，委婉地说",
			"a_value": 1,
			"a_en": "Raise the concern right away",
			"b_en": "Pick a good moment and say it gently",
			"scenario": "我对某件事有顾虑",
			"scenario_en": "I have a concern about something"
		},
		{
			"id": "Q19",
			"dimension": "autonomy",
			"a": "过程中多沟通，随时对齐",
			"b": "先让我自己做完，再一起看结果",
			"a_value": -1,
			"a_en": "Check in with me as you go",
			"b_en": "Let me finish on my own, then review together",
			"scenario": "和别人一起做一件事",
			"scenario_en": "Working on something with someone"
		},
		{
			"id": "Q20",
			"dimension": "autonomy",
			"a": "告诉我目标就行，怎么做我自己定",
			"b": "先一起把方案聊出来",
			"a_value": 1,
			"a_en": "Give me the goal and let me decide how",
			"b_en": "Work out the approach with me first",
			"scenario": "接到一个任务",
			"scenario_en": "Being handed a task"
		},
		{
			"id": "Q21",
			"dimension": "autonomy",
			"a": "经常给我一点进度，我心里有底",
			"b": "关键节点说一声就够了",
			"a_value": -1,
			"a_en": "Frequent small updates keep me at ease",
			"b_en": "A short update at milestones is enough",
			"scenario": "别人替我推进一件事",
			"scenario_en": "Someone else is carrying work forward for me"
		},
		{
			"id": "Q22",
			"dimension": "stress_support",
			"a": "先帮我想怎么补救",
			"b": "先听我说完，别急着出主意",
			"a_value": 1,
			"a_en": "Help me figure out how to fix it",
			"b_en": "Hear me out before offering solutions",
			"scenario": "我把事情搞砸了",
			"scenario_en": "I've messed something up"
		},
		{
			"id": "Q23",
			"dimension": "stress_support",
			"a": "先让我随便说说",
			"b": "先给我一个能做的小步骤",
			"a_value": -1,
			"a_en": "Let me talk it out first",
			"b_en": "Give me one small step I can take",
			"scenario": "我压力很大、说不清楚",
			"scenario_en": "I'm overwhelmed and can't explain it well"
		},
		{
			"id": "Q24",
			"dimension": "stress_support",
			"a": "先看哪些地方还能改",
			"b": "先让我觉得你懂我的处境",
			"a_value": 1,
			"a_en": "Look at what can still change",
			"b_en": "Let me feel that you get what I'm up against",
			"scenario": "我在抱怨一个很难改的问题",
			"scenario_en": "I'm venting about a problem that's hard to change"
		}
	],
	title_zh: "灵魂画像 / Soul Profile 协作偏好问卷",
	title_en: "Soul Profile Collaboration Preference Questionnaire",
	instructions_zh: "请选择通常更自然或省力的选项，而不是看起来更理想的选项；不确定时可以跳过。",
	instructions_en: "Choose what usually feels more natural or easier, rather than what seems ideal; skip any item you are unsure about."
};
const QUESTIONS = bank.questions.map((q) => ({
	...q,
	a_value: q.a_value === 1 ? 1 : -1
}));
const DIMENSIONS = bank.dimensions.map((d) => d.id);
const DIMENSION_NAMES = Object.fromEntries(bank.dimensions.map((d) => [d.id, d.name]));
const DIMENSION_NAMES_EN = Object.fromEntries(bank.dimensions.map((d) => [d.id, d.name_en]));
const LABELS = Object.fromEntries(bank.dimensions.map((d) => [d.id, [d.low, d.high]]));
const LABELS_EN = Object.fromEntries(bank.dimensions.map((d) => [d.id, [d.low_en, d.high_en]]));
function score(answers) {
	return DIMENSIONS.map((id) => {
		const values = QUESTIONS.filter((q) => q.dimension === id).flatMap((q) => {
			const answer = answers[q.id];
			return answer === "A" ? [q.a_value] : answer === "B" ? [-q.a_value] : [];
		});
		const mean = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
		return {
			id,
			pole: values.length < 2 ? "unknown" : mean <= -1 / 3 + 1e-9 ? "low" : mean >= 1 / 3 - 1e-9 ? "high" : "mixed",
			answered: values.length
		};
	});
}
// src/client/index.tsx
const STYLE = `.soul-profile{display:grid;gap:16px;max-width:680px;line-height:1.55}.soul-profile p{margin:0}.soul-profile p.sp-hint{color:var(--muted-color,#657080);font-size:13px;margin:2px 0 6px}.soul-profile label{display:flex;align-items:flex-start;gap:10px}.soul-profile input[type=checkbox]{margin-top:5px}.sp-actions{display:flex;flex-wrap:wrap;justify-content:flex-end;gap:8px;margin-top:8px}.sp-progress{display:grid;gap:8px;font-size:13px}.sp-progress progress{width:100%}.soul-profile h3{margin:8px 0;font-size:20px}.sp-choice{border:1px solid var(--border-color,#d7dce2);border-radius:10px;background:var(--surface-color,#fff);color:inherit;padding:14px 16px;text-align:left;cursor:pointer;font:inherit}.sp-choice:hover,.sp-choice.selected{border-color:var(--accent-color,#4d7cfe);background:color-mix(in srgb,var(--accent-color,#4d7cfe) 8%,transparent)}.sp-skip,.sp-language button{border:0;background:transparent;color:var(--muted-color,#657080);cursor:pointer;font:inherit;padding:5px}.sp-language{display:flex;justify-content:flex-end;gap:8px}.sp-results{display:grid;gap:10px;max-height:48vh;overflow:auto}.sp-results label{display:grid;grid-template-columns:minmax(120px,1fr) minmax(150px,1fr) auto;align-items:center;gap:10px}.sp-results select{min-width:0;padding:8px}.sp-results small{color:var(--muted-color,#657080);white-space:nowrap}@media(max-width:600px){.sp-results label{grid-template-columns:1fr 1fr}.sp-results small{grid-column:2}}`;
const NS = "soul-profile";
const name = "soul-profile";
const inject = ["slots", "configForms"];
function apply(ctx) {
	ctx.effect(() => {
		const element = document.createElement("style");
		element.dataset.soulProfile = "styles";
		element.textContent = STYLE;
		document.head.append(element);
		return () => element.remove();
	}, "soul-profile: styles");
	const form = ctx.configForms.get(NS);
	const state = (0, _deepseek_ai_dsh_client_store.createSnapshotStore)({
		value: form.getSnapshot().value ?? null,
		ready: form.getSnapshot().status === "ready"
	});
	form.subscribe(() => state.update((snapshot) => {
		const current = form.getSnapshot();
		snapshot.value = current.value ?? null;
		snapshot.ready = current.status === "ready";
	}));
	const injected = () => ({
		form,
		hooks: { profile: state }
	});
	ctx.slots.inject("settings.onboarding", () => ctx.slots.register({
		name: "settings.onboarding",
		id: "soul-profile",
		order: 20,
		inject: injected
	}, SoulProfileOnboarding));
	ctx.slots.inject("settings.section", () => ctx.slots.register({
		name: "settings.section",
		id: "soul-profile",
		order: 50,
		label: () => "灵魂画像 / Soul Profile",
		inject: injected
	}, SoulProfileSettings));
}
function SoulProfileSettings(props) {
	const [open, setOpen] = (0, react.useState)(false);
	const state = props.useProfile((value) => value.value);
	if (open) {
		const onboardingProps = {
			...props,
			stepId: "soul-profile",
			explicit: true,
			complete: () => setOpen(false),
			openSection: () => {}
		};
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(SoulProfileOnboarding, { ...onboardingProps });
	}
	const hasProfile = Boolean(state?.profile);
	const enabled = state?.enabled !== false;
	return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("section", {
		className: "soul-profile",
		children: [
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h2", { children: "灵魂画像 / Soul Profile" }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: !hasProfile ? "尚未填写档案。 / No profile yet." : enabled ? "档案已启用，正在注入系统提示。 / Profile is enabled and injected into the system prompt." : "档案已关闭，当前不会注入。 / Profile is off and no longer injected." }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: "这是一份可编辑的协作偏好摘要，不是人格测试或诊断。可随时重新填写、关闭或删除。 / An editable collaboration preference summary, not a personality test or diagnosis. Retake, disable, or delete it at any time." }),
			/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
				variant: "primary",
				onClick: () => setOpen(true),
				children: hasProfile ? "管理档案 / Manage profile" : "开始设置 / Set up profile"
			})
		]
	});
}
/**
* Draft answers live at module scope so an unmount caused by the host
* (window focus change, settings refetch, slot re-render) cannot wipe the
* answers a user is in the middle of giving.
*/
const draft = {
	screen: null,
	index: 0,
	answers: {},
	manual: {},
	language: "zh",
	consented: false
};
function resetDraft() {
	draft.screen = null;
	draft.index = 0;
	draft.answers = {};
	draft.manual = {};
	draft.consented = false;
}
function SoulProfileOnboarding(props) {
	const { complete, explicit = false, form, useProfile } = props;
	const profileState = useProfile((s) => s);
	const saved = profileState.value;
	const [screen, setScreenState] = (0, react.useState)(draft.screen);
	const [index, setIndex] = (0, react.useState)(draft.index);
	const [answers, setAnswers] = (0, react.useState)(draft.answers);
	const [manual, setManual] = (0, react.useState)(draft.manual);
	const [language, setLanguage] = (0, react.useState)(draft.language);
	const [error, setError] = (0, react.useState)("");
	const [consented, setConsented] = (0, react.useState)(draft.consented);
	const question = QUESTIONS[index];
	const result = (0, react.useMemo)(() => score(answers), [answers]);
	const t = (zh, en) => language === "zh" ? zh : en;
	const decided = (0, react.useRef)(draft.screen !== null);
	const readyOnce = (0, react.useRef)(profileState.ready);
	if (profileState.ready) readyOnce.current = true;
	const setScreen = (next) => {
		draft.screen = next;
		setScreenState(next);
	};
	/** Close the dialog and drop the draft, so reopening starts clean. */
	const finish = () => {
		resetDraft();
		complete();
	};
	(0, react.useEffect)(() => {
		draft.index = index;
		draft.answers = answers;
		draft.manual = manual;
		draft.language = language;
		draft.consented = consented;
	}, [
		index,
		answers,
		manual,
		language,
		consented
	]);
	(0, react.useEffect)(() => {
		if (screen === null) return;
		const root = document.getElementById("root");
		if (!root) return;
		const wasInert = root.inert;
		root.inert = true;
		return () => {
			root.inert = wasInert;
		};
	}, [screen]);
	(0, react.useEffect)(() => {
		if (decided.current || !profileState.ready) return;
		decided.current = true;
		if (explicit) {
			setScreen(saved?.completed ? "manage" : "intro");
			return;
		}
		if (saved?.completed || saved?.dismissed) {
			complete();
			return;
		}
		setScreen("intro");
	}, [
		explicit,
		profileState.ready,
		saved?.completed,
		saved?.dismissed,
		complete
	]);
	if (screen === null || !readyOnce.current) return null;
	if (screen === "intro") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: true,
		title: t("灵魂画像 · 协作偏好设置", "Soul Profile · Collaboration preferences"),
		closeLabel: t("关闭", "Close"),
		onClose: finish,
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "soul-profile",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("这是一份轻量、可修改的协作偏好设置，不是人格测试或心理诊断。约需 3 分钟，可跳过任何题目。", "A short, editable collaboration preference setup—not a personality test or psychological assessment. About 3 minutes; every question can be skipped.") }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("只有你点击“保存并启用”后，整理后的偏好才会保存在当前 Harness 配置中，并用于后续 Agent 提示词。原始答案不会保存。", "Only after you choose “Save and enable” will the summarized preferences be stored in this Harness profile and used in later agent prompts. Raw answers are not stored.") }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: consented,
						onChange: (e) => setConsented(e.target.checked)
					}),
					" ",
					t("我同意回答这些偏好问题，并在保存后让 Agent 参考整理结果。", "I agree to answer these preference questions and let the agent use the summary if I save it.")
				] }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "sp-actions",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						onClick: finish,
						children: t("稍后", "Later")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "primary",
						disabled: !consented,
						onClick: () => setScreen("questions"),
						children: t("开始", "Start")
					})]
				})
			]
		})
	});
	if (screen === "questions") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: true,
		title: t("你的协作偏好", "Your collaboration preferences"),
		closeLabel: t("关闭", "Close"),
		onClose: finish,
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "soul-profile",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "sp-progress",
					children: [t(`第 ${index + 1} / ${QUESTIONS.length} 题`, `Question ${index + 1} of ${QUESTIONS.length}`), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("progress", {
						value: index + 1,
						max: QUESTIONS.length
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "sp-language",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						onClick: () => setLanguage("zh"),
						children: "中文"
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
						onClick: () => setLanguage("en"),
						children: "English"
					})]
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("h3", { children: language === "zh" ? question.scenario : question.scenario_en }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					className: "sp-hint",
					children: t("哪一项更像平时的你？", "Which one is more like you?")
				}),
				[["A", language === "zh" ? question.a : question.a_en], ["B", language === "zh" ? question.b : question.b_en]].map(([key, label]) => /* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: `sp-choice ${answers[question.id] === key ? "selected" : ""}`,
					onClick: () => {
						setAnswers((v) => ({
							...v,
							[question.id]: key
						}));
						setIndex((i) => Math.min(QUESTIONS.length - 1, i + 1));
					},
					children: label
				}, key)),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("button", {
					className: "sp-skip",
					onClick: () => {
						setAnswers((v) => ({
							...v,
							[question.id]: "skip"
						}));
						setIndex((i) => Math.min(QUESTIONS.length - 1, i + 1));
					},
					children: t("跳过 / 都可以", "Skip / It depends")
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "sp-actions",
					children: [/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						disabled: index === 0,
						onClick: () => setIndex((i) => i - 1),
						children: t("上一步", "Back")
					}), /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
						variant: "primary",
						onClick: () => index === QUESTIONS.length - 1 ? setScreen("review") : setIndex((i) => i + 1),
						children: index === QUESTIONS.length - 1 ? t("查看摘要", "Review") : t("下一题", "Next")
					})]
				})
			]
		})
	});
	if (screen === "review") return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
		open: true,
		title: t("检查并确认摘要", "Review your summary"),
		closeLabel: t("关闭", "Close"),
		onClose: finish,
		children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
			className: "soul-profile",
			children: [
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("以下只是根据已答题目生成的暂定协作偏好。可以修改任何一项，也可以不启用。", "These are tentative collaboration preferences based only on answered items. You can change any item or choose not to enable them.") }),
				/* @__PURE__ */ (0, react_jsx_runtime.jsx)("div", {
					className: "sp-results",
					children: result.map((d) => {
						const labels = language === "zh" ? LABELS[d.id] : LABELS_EN[d.id];
						return /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("label", { children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("span", { children: language === "zh" ? DIMENSION_NAMES[d.id] : DIMENSION_NAMES_EN[d.id] }),
							/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("select", {
								value: manual[d.id] ?? "auto",
								onChange: (e) => {
									const value = e.target.value;
									setManual((m) => {
										const next = { ...m };
										if (value === "auto") delete next[d.id];
										else next[d.id] = value;
										return next;
									});
								},
								children: [
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "auto",
										children: t("按答题摘要", "Use answers")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "unknown",
										children: t("暂不确定", "Undetermined")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "low",
										children: labels[0]
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "mixed",
										children: t("视情况而定", "Depends on context")
									}),
									/* @__PURE__ */ (0, react_jsx_runtime.jsx)("option", {
										value: "high",
										children: labels[1]
									})
								]
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)("small", { children: t(`依据 ${d.answered}/3 题`, `${d.answered}/3 answered`) })
						] }, d.id);
					})
				}),
				error && /* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", {
					role: "alert",
					children: error
				}),
				/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
					className: "sp-actions",
					children: [
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							onClick: () => setScreen("questions"),
							children: t("返回修改", "Edit answers")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							onClick: () => {
								form.set("dismissed", true).then(finish);
							},
							children: t("不启用", "Do not enable")
						}),
						/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
							variant: "primary",
							onClick: () => {
								const profile = renderProfile(result, language, manual);
								form.set("profile", profile).then((ok) => ok ? form.set("enabled", true).then(() => form.set("dismissed", false)).then(() => form.set("completed", true)).then(finish) : setError(t("保存失败，请重试。", "Save failed. Please try again.")));
							},
							children: t("保存并启用", "Save and enable")
						})
					]
				})
			]
		})
	});
	if (screen === "manage") {
		const enabled = saved?.enabled !== false;
		const retake = () => {
			setAnswers({});
			setManual({});
			setIndex(0);
			setScreen("questions");
		};
		const toggle = () => {
			form.set("enabled", !enabled).then(finish);
		};
		const remove = () => {
			form.set("profile", "").then(() => form.set("enabled", true)).then(() => form.set("completed", false)).then(() => form.set("dismissed", true)).then(finish);
		};
		return /* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Modal, {
			open: true,
			title: t("管理灵魂画像", "Manage Soul Profile"),
			closeLabel: t("关闭", "Close"),
			onClose: finish,
			children: /* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
				className: "soul-profile",
				children: [
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: enabled ? t("档案已启用，正在注入系统提示。", "The profile is enabled and injected into the system prompt.") : t("档案已关闭，内容仍在，但不会注入。", "The profile is off. Its content stays, but nothing is injected.") }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsx)("p", { children: t("关闭只是暂停使用，随时可以再打开；删除会清空内容，无法恢复。", "Disabling pauses it and can be undone; deleting clears the content for good.") }),
					/* @__PURE__ */ (0, react_jsx_runtime.jsxs)("div", {
						className: "sp-actions",
						children: [
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								onClick: retake,
								children: t("重新填写", "Retake")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								onClick: toggle,
								children: enabled ? t("关闭档案", "Disable profile") : t("启用档案", "Enable profile")
							}),
							/* @__PURE__ */ (0, react_jsx_runtime.jsx)(_deepseek_ai_dsh_client_ui_primitives.Button, {
								onClick: remove,
								children: t("删除档案", "Delete profile")
							})
						]
					})
				]
			})
		});
	}
	return null;
}
/**
* 注入提示词的正文：每一极写成一个可执行的动作，而不是形容用户的形容词。
* 系统提示里命令句的遵守率明显高于描述句，所以这里全部用祈使句。
*/
const INSTRUCTIONS = {
	structure: ["先给方向再细化——面对开放任务时先给 2–3 条可选路径，等我选定后再展开，不要一上来就输出完整计划。", "先给完整步骤——动手前列出步骤与顺序，标出下一步，再按顺序执行。"],
	social_energy: ["保持一对一、低干扰的交流——不堆寒暄，也不引入多方视角，直接对着我说。", "可以更外向地展开——适度提议、追问、给出多方视角，保持交流的节奏。"],
	information_style: ["先给具体例子——用一个真实案例开场，再归纳规律，不要先讲抽象框架。", "先给整体框架——用一两句话说明全貌和结构，再进入细节。"],
	decision_basis: ["决策建议要说明对人的影响——除了证据，也指出这个选择会影响谁、代价是什么。", "决策建议要摆出证据和判断标准——说明依据是什么、用什么标准比较，再给结论。"],
	expression: ["回答保持简短克制——先给结论，省略铺垫，不要为了完整而扩写。", "回答要补足背景——结论之后说明原因和必要上下文，不要只丢一个结论。"],
	feedback: ["指出问题时先肯定再提异议——先说哪里做对了，再指出不一致的地方，避免直接否定。", "指出问题要直接——先说不一致的地方和影响，不要用缓冲语绕开。"],
	autonomy: ["过程中保持同步——每完成一个阶段简短汇报，遇到岔路先问我。", "目标明确时直接做完再汇报——中途不要问“要不要继续”，只在需要我决策时停下。"],
	stress_support: ["我说压力或麻烦时，先别急着给方案——先回应我说的事实和感受，再问要不要建议。", "我说压力或麻烦时，先给可执行的下一步——列出能做的一两件事，再补充说明。"]
};
const INSTRUCTIONS_EN = {
	structure: ["Offer direction before detail: for open-ended work, give 2–3 routes and expand only after I pick one; do not open with a full plan.", "Give the full sequence: list the steps and their order before starting, name the next action, then work through them."],
	social_energy: ["Keep the exchange one-to-one and low-noise: skip pleasantries and multi-party framing, address me directly.", "Lean outward: offer suggestions, ask follow-ups, and bring in more than one angle to keep the exchange lively."],
	information_style: ["Lead with a concrete example: open with a real case, then generalise; do not start with an abstract framework.", "Lead with the whole picture: state the overall shape in one or two sentences, then go into detail."],
	decision_basis: ["When recommending, say who is affected: alongside the evidence, name who this choice touches and what it costs them.", "When recommending, state the evidence and the criteria: say what the basis is and what standard you compared against before concluding."],
	expression: ["Stay brief and understated: lead with the conclusion, drop preamble, and do not expand just to be complete.", "Add context: after the conclusion, explain the reasoning and the context that matters; do not hand over a bare conclusion."],
	feedback: ["When pointing out a problem, acknowledge first: say what works, then name the inconsistency; avoid flat negation.", "Be direct when pointing out a problem: name the inconsistency and its impact first, without cushioning phrases."],
	autonomy: ["Stay in sync while working: report briefly at each stage and ask before taking a fork.", "When the goal is clear, finish the work and report once: do not ask “shall I continue”; stop only where I must decide."],
	stress_support: ["When I describe stress or trouble, do not jump to solutions: acknowledge what I said and how it lands, then ask whether I want advice.", "When I describe stress or trouble, lead with a doable next step: name one or two things I can act on, then explain."]
};
function renderProfile(results, lang, manual) {
	const title = lang === "zh" ? "## 用户的协作偏好（请照此协作）" : "## User collaboration preferences (follow these)";
	const caveat = lang === "zh" ? "下面每一条都是我确认过的协作方式，请在日常回答中照做。当我当前的要求与它们冲突时，以我当前的要求为准；某条不适用或含义不清时先问我，不要自行推测。" : "Each line below is a collaboration preference I confirmed; follow it in normal replies. When my current request conflicts with one, my current request wins; ask me when a line does not apply or is unclear rather than guessing.";
	const lines = results.flatMap((d) => {
		const pole = manual[d.id] ?? d.pole;
		if (pole !== "low" && pole !== "high") return [];
		const text = (lang === "zh" ? INSTRUCTIONS : INSTRUCTIONS_EN)[d.id]?.[pole === "low" ? 0 : 1];
		if (!text) return [];
		return [`- ${lang === "zh" ? DIMENSION_NAMES[d.id] : DIMENSION_NAMES_EN[d.id]}：${text}`];
	});
	return [
		title,
		"",
		`> ${caveat}`,
		"",
		...lines.length ? lines : [lang === "zh" ? "- 目前没有足够明确、可以照做的偏好；需要时直接问我。" : "- No preference is clear enough to act on yet; ask me when it matters."]
	].join("\n");
}
exports.apply = apply;
exports.inject = inject;
exports.name = name;

return module.exports; } });