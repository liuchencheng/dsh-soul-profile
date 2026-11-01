#!/usr/bin/env python3
"""灵魂画像计分与渲染工具（无需第三方依赖）。 Bilingual Soul Profile scorer and renderer (no third-party dependencies)."""
import argparse
import json
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
QUESTIONS = json.loads((ROOT / "questions.json").read_text(encoding="utf-8-sig"))


def score_answers(answers):
    if not isinstance(answers, dict):
        raise ValueError("答案必须是以 Q01..Q24 为键的 JSON 对象。 Answers must be a JSON object keyed by Q01..Q24.")
    valid_ids = {q["id"] for q in QUESTIONS["questions"]}
    extras = [key for key in answers if not isinstance(key, str) or key not in valid_ids]
    if extras:
        raise ValueError("未知题号 / Unknown question IDs: " + ", ".join(sorted(map(str, extras))))
    result = {}
    for dim in QUESTIONS["dimensions"]:
        values = []
        for q in QUESTIONS["questions"]:
            if q["dimension"] != dim["id"]:
                continue
            value = answers.get(q["id"])
            if value is None:
                continue
            if not isinstance(value, str):
                raise ValueError(f"{q['id']} 必须为 A、B、skip 或 null。 Must be A, B, skip, or null.")
            value = value.strip().upper()
            if value == "SKIP":
                continue
            if value not in ("A", "B"):
                raise ValueError(f"{q['id']} 必须为 A、B、skip 或 null。 Must be A, B, skip, or null.")
            values.append(q["a_value"] if value == "A" else -q["a_value"])
        n = len(values)
        mean = sum(values) / n if n else None
        # Three answered items produce means in thirds; epsilon avoids float drift at 1/3.
        threshold = (1 / 3) - 1e-9
        # One response is insufficient for a score or a directional conclusion.
        pole = "unknown" if n < 2 else "low" if mean <= -threshold else "high" if mean >= threshold else "mixed"
        result[dim["id"]] = {"name": dim["name"], "name_en": dim.get("name_en") or dim["name"],
                             "pole": pole, "answered": n, "confidence": "low" if n < 2 else "medium" if n == 2 else "high"}
    return result


def build_profile(answers, reviewed=False, overrides=None, today=None, consent=False, lang="both"):
    if consent is not True:
        raise ValueError("生成档案前必须先向用户说明用途并取得明确同意。 Explain the purpose and obtain explicit consent before generating a profile.")
    if lang not in ("zh", "en", "both"):
        raise ValueError("语言必须为 zh、en 或 both。 Language must be zh, en, or both.")
    if overrides is None:
        overrides = []
    if not isinstance(overrides, list) or any(not isinstance(item, str) for item in overrides):
        raise ValueError("用户补充偏好必须是字符串数组。 User-provided overrides must be an array of strings.")
    dimensions = score_answers(answers)
    defaults = []
    # 与插件注入的提示词保持一致：每条都写成可执行的动作（做什么 + 不要做什么），
    # 而不是形容用户的形容词——系统提示里祈使句的遵守率明显更高。
    # 文案与 `src/client/index.tsx` 的 INSTRUCTIONS / INSTRUCTIONS_EN 一一对应，改动时两边同步。
    recommendations = {
      "structure": (("先给方向再细化——面对开放任务时先给 2–3 条可选路径，等我选定后再展开，不要一上来就输出完整计划。", "Offer direction before detail: for open-ended work, give 2–3 routes and expand only after I pick one; do not open with a full plan."), ("先给完整步骤——动手前列出步骤与顺序，标出下一步，再按顺序执行。", "Give the full sequence: list the steps and their order before starting, name the next action, then work through them.")),
      "social_energy": (("保持一对一、低干扰的交流——不堆寒暄，也不引入多方视角，直接对着我说。", "Keep the exchange one-to-one and low-noise: skip pleasantries and multi-party framing, address me directly."), ("可以更外向地展开——适度提议、追问、给出多方视角，保持交流的节奏。", "Lean outward: offer suggestions, ask follow-ups, and bring in more than one angle to keep the exchange lively.")),
      "information_style": (("先给具体例子——用一个真实案例开场，再归纳规律，不要先讲抽象框架。", "Lead with a concrete example: open with a real case, then generalise; do not start with an abstract framework."), ("先给整体框架——用一两句话说明全貌和结构，再进入细节。", "Lead with the whole picture: state the overall shape in one or two sentences, then go into detail.")),
      "decision_basis": (("决策建议要说明对人的影响——除了证据，也指出这个选择会影响谁、代价是什么。", "When recommending, say who is affected: alongside the evidence, name who this choice touches and what it costs them."), ("决策建议要摆出证据和判断标准——说明依据是什么、按什么标准比较，再给结论。", "When recommending, state the evidence and the criteria: say what the basis is and what standard you compared against before concluding.")),
      "expression": (("回答保持简短克制——先给结论，省略铺垫，不要为了完整而扩写。", "Stay brief and understated: lead with the conclusion, drop preamble, and do not expand just to be complete."), ("回答要补足背景——结论之后说明原因和必要上下文，不要只丢一个结论。", "Add context: after the conclusion, explain the reasoning and the context that matters; do not hand over a bare conclusion.")),
      "feedback": (("指出问题时先肯定再提异议——先说哪里做对了，再指出不一致的地方，避免直接否定。", "When pointing out a problem, acknowledge first: say what works, then name the inconsistency; avoid flat negation."), ("指出问题要直接——先说不一致的地方和影响，不要用缓冲语绕开。", "Be direct when pointing out a problem: name the inconsistency and its impact first, without cushioning phrases.")),
      "autonomy": (("过程中保持同步——每完成一个阶段简短汇报，遇到岔路先问我。", "Stay in sync while working: report briefly at each stage and ask before taking a fork."), ("目标明确时直接做完再汇报——中途不要问“要不要继续”，只在需要我决策时停下。", "When the goal is clear, finish the work and report once: do not ask “shall I continue”; stop only where I must decide.")),
      "stress_support": (("我说压力或麻烦时，先别急着给方案——先回应我说的事实和感受，再问要不要建议。", "When I describe stress or trouble, do not jump to solutions: acknowledge what I said and how it lands, then ask whether I want advice."), ("我说压力或麻烦时，先给可执行的下一步——列出能做的一两件事，再补充说明。", "When I describe stress or trouble, lead with a doable next step: name one or two things I can act on, then explain."))}
    for key, dim in dimensions.items():
        if dim["pole"] in ("low", "high") and dim["confidence"] != "low":
            pair = recommendations[key][0 if dim["pole"] == "low" else 1]
            defaults.append(pair[0] if lang == "zh" else pair[1] if lang == "en" else f"{pair[0]} / {pair[1]}")
    notes = {
        "zh": "非正式的偏好快照；答题覆盖度不代表测量效度。",
        "en": "Informal preference snapshot; answer coverage does not indicate measurement validity.",
        "both": "非正式的偏好快照；答题覆盖度不代表测量效度。 Informal preference snapshot; answer coverage does not indicate measurement validity."
    }[lang]
    return {"schema_version":"2.0.0", "profile_type":"collaboration_preferences", "language":lang,
      "created_at": (today or date.today()).isoformat(), "consent_acknowledged": bool(consent),
      "dimensions": dimensions,
      "collaboration_preferences":{"response_defaults":defaults,"user_overrides":overrides or []},
      "safety":{"non_diagnostic":True,"current_instruction_wins":True,"reviewed_by_user":bool(reviewed),
                "notes":notes}}


def render_markdown(profile, lang=None):
    # Older 1.0.0 profiles may lack both language and name_en; keep them renderable.
    lang = lang or profile.get("language", "both")
    if lang not in ("zh", "en", "both"):
        raise ValueError("语言必须为 zh、en 或 both。 Language must be zh, en, or both.")
    bilingual = lang == "both"
    def text(zh, en):
        return f"{zh} / {en}" if bilingual else zh if lang == "zh" else en

    labels = {"low":text("偏低", "Low"), "high":text("偏高", "High"),
              "mixed":text("混合", "Mixed"), "unknown":text("尚不明确", "Unknown")}
    coverage = {"low":text("较少", "Low"), "medium":text("一般", "Medium"), "high":text("较充分", "High")}
    low_coverage_count = sum(d["confidence"] == "low" for d in profile["dimensions"].values())
    lines = [f"# {text('我的灵魂画像协作偏好档案', 'My Soul Profile — collaboration preferences')}", "",
      "> " + text("这是一份可编辑的协作偏好快照，不是人格判定或诊断。", "This is an editable snapshot of collaboration preferences, not a personality verdict or diagnosis."), "",
      text("我当前提出的要求始终优先。若档案可能过时或含义不清，请先询问我。", "My current instructions always take priority. Ask me if this profile seems outdated or unclear."), "",
      ("> " + text(f"有 {low_coverage_count}/8 个维度答题不足，以下建议只依据覆盖充分的维度。", f"{low_coverage_count}/8 dimensions have low coverage; defaults below use only sufficiently answered dimensions.")) if low_coverage_count else "",
      "## " + text("偏好维度", "Preference dimensions"), "",
      "| " + text("维度", "Dimension") + " | " + text("倾向", "Pole") + " | " + text("已答", "Answered") + " | " + text("覆盖度", "Coverage") + " |",
      "|---|---|---:|---|"]
    for d in profile["dimensions"].values():
        name_zh = d.get("name") or d.get("name_en", "")
        name_en = d.get("name_en") or d.get("name") or ""
        dimension_name = text(name_zh, name_en)
        lines.append(f"| {dimension_name} | {labels[d['pole']]} | {d['answered']}/3 | {coverage[d['confidence']]} |")
    lines += ["", "## " + text("协作方式（请照此执行）", "How to work with me (follow these)"), ""]
    defaults = profile["collaboration_preferences"]["response_defaults"]
    empty_defaults = text("暂无可用的明确倾向；请询问我希望怎样协作。", "No clear, usable defaults yet; please ask what would help.")
    lines += [f"- {x}" for x in defaults] if defaults else ["- " + empty_defaults]
    lines += ["", "## " + text("我的补充与修正", "My overrides and corrections"), ""]
    overrides = profile["collaboration_preferences"]["user_overrides"]
    lines += [f"- {x}" for x in overrides] if overrides else ["- " + text("可在此添加或修改偏好。", "Add or edit preferences here.")]
    lines += ["", "## " + text("管理方式", "Control"), "",
      text("我可以随时编辑或删除此文件。结果仅供参考，出现混合倾向很正常。", "I can edit or delete this file at any time. Results are tentative; mixed results are normal."), ""]
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    sub = parser.add_subparsers(dest="command", required=True)
    p = sub.add_parser("score", help="对答案计分并生成画像文件 / Score answers and generate profile files")
    p.add_argument("answers", type=Path)
    p.add_argument("--lang", choices=("zh", "en", "both"), default="both",
                   help="画像语言：中文、英文或双语 / Profile language: Chinese, English, or bilingual (default: both)")
    p.add_argument("--out", type=Path, default=Path.cwd(), help="输出目录 / Output directory")
    p.add_argument("--consent", action="store_true", required=True,
                   help="确认已说明用途、限制和保存位置并取得同意 / Confirm purpose, limitations, storage, and explicit consent")
    p.add_argument("--overrides", type=Path,
                   help="可选 JSON 文件，含用户补充偏好字符串数组 / Optional JSON file containing an array of user preference strings")
    p.add_argument("--reviewed", action="store_true", help="用户审阅结果后设为 true / Set after the user reviews the result")
    args = parser.parse_args()
    try:
        answers = json.loads(args.answers.read_text(encoding="utf-8-sig"))
        overrides = json.loads(args.overrides.read_text(encoding="utf-8-sig")) if args.overrides else []
        profile = build_profile(answers, reviewed=args.reviewed, overrides=overrides, consent=args.consent, lang=args.lang)
    except (OSError, json.JSONDecodeError, ValueError) as e:
        parser.error(str(e))
    try:
        args.out.mkdir(parents=True, exist_ok=True)
        (args.out / "profile.json").write_text(json.dumps(profile, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        (args.out / "USER_PROFILE.md").write_text(render_markdown(profile, lang=args.lang), encoding="utf-8")
    except OSError as e:
        parser.error(f"无法写入输出目录 {args.out}: {e}. Cannot write output directory.")
    print(f"已生成 / Created: {args.out / 'USER_PROFILE.md'} 和 / and {args.out / 'profile.json'}")

if __name__ == "__main__":
    main()
