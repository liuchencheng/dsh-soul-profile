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
    recommendations = {
      "structure": (("计划保留弹性，允许过程中调整。", "Keep plans flexible and adapt as we go."), ("提供清晰步骤和明确的下一步。", "Give me clear steps and next actions.")),
      "social_energy": (("采用平静、专注的交流方式。", "Keep the exchange calm and focused."), ("适合时采用积极、协作式的交流方式。", "Use an energetic, collaborative exchange when useful.")),
      "information_style": (("先提供具体例子和细节。", "Lead with concrete examples and details."), ("先介绍整体概况和规律。", "Lead with the overview and patterns.")),
      "decision_basis": (("在呈现证据的同时，说明对人的影响与相关价值。", "Include human impact and values alongside evidence."), ("明确说明证据和决策标准。", "State evidence and criteria explicitly.")),
      "expression": (("回答简洁、语气含蓄。", "Keep responses concise and understated."), ("补充背景，采用温暖且更有表现力的语气。", "Add context with a warm, expressive tone.")),
      "feedback": (("结合背景，以温和方式提供反馈。", "Frame feedback gently and with context."), ("坦率、明确地提供反馈。", "Give candid, explicit feedback.")),
      "autonomy": (("工作过程中通过协作沟通保持同步。", "Check in collaboratively as work develops."), ("独立推进，并在关键节点汇报。", "Work independently and report at milestones.")),
      "stress_support": (("先理解和回应感受，再讨论解决办法。", "Acknowledge feelings before problem-solving."), ("先梳理优先级和切实可行的下一步。", "Prioritize practical next steps first."))}
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
    lines += ["", "## " + text("建议的协作默认方式", "Suggested collaboration defaults"), ""]
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
