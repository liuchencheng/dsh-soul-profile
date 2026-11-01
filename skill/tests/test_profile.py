import importlib.util
import json
import re
import tempfile
import unittest
from datetime import date
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("profile", ROOT / "tools" / "profile.py")
profile = importlib.util.module_from_spec(spec)
spec.loader.exec_module(profile)

def schema_errors(instance, spec, root, path="$", root_spec=None):
    root_spec = root_spec or spec
    errors = []
    if "$ref" in spec:
        target = root_spec
        for part in spec["$ref"].removeprefix("#/").split("/"):
            target = target[part]
        return schema_errors(instance, target, root, path, root_spec)
    if "pattern" in spec and isinstance(instance, str) and re.search(spec["pattern"], instance) is None:
        return [f"{path}: pattern mismatch"]
    expected = spec.get("type")
    if expected:
        expected = [expected] if isinstance(expected, str) else expected
        type_map = {"object": lambda x: isinstance(x, dict), "array": lambda x: isinstance(x, list),
                    "string": lambda x: isinstance(x, str), "boolean": lambda x: isinstance(x, bool),
                    "integer": lambda x: isinstance(x, int) and not isinstance(x, bool),
                    "number": lambda x: isinstance(x, (int, float)) and not isinstance(x, bool),
                    "null": lambda x: x is None}
        if not any(type_map[t](instance) for t in expected):
            return [f"{path}: wrong type"]
    if "const" in spec and instance != spec["const"]:
        errors.append(f"{path}: expected const")
    if "enum" in spec and instance not in spec["enum"]:
        errors.append(f"{path}: value not in enum")
    if isinstance(instance, dict):
        for key in spec.get("required", []):
            if key not in instance:
                errors.append(f"{path}.{key}: required")
        props = spec.get("properties", {})
        if spec.get("additionalProperties") is False:
            errors.extend(f"{path}.{key}: additional property" for key in instance if key not in props)
        for key, value in instance.items():
            if key in props:
                errors.extend(schema_errors(value, props[key], root, f"{path}.{key}", root_spec))
            elif isinstance(spec.get("additionalProperties"), dict):
                errors.extend(schema_errors(value, spec["additionalProperties"], root, f"{path}.{key}", root_spec))
        if len(instance) < spec.get("minProperties", 0):
            errors.append(f"{path}: too few properties")
    if isinstance(instance, list) and "items" in spec:
        for i, value in enumerate(instance):
            errors.extend(schema_errors(value, spec["items"], root, f"{path}[{i}]", root_spec))
    if isinstance(instance, (int, float)) and not isinstance(instance, bool):
        if instance < spec.get("minimum", instance) or instance > spec.get("maximum", instance):
            errors.append(f"{path}: out of range")
    if spec.get("format") == "date" and isinstance(instance, str):
        try:
            date.fromisoformat(instance)
        except ValueError:
            errors.append(f"{path}: invalid date")
    for subschema in spec.get("allOf", []):
        errors.extend(schema_errors(instance, subschema, root, path, root_spec))
    if "if" in spec:
        condition_errors = schema_errors(instance, spec["if"], root, path, root_spec)
        branch = spec.get("then") if not condition_errors else spec.get("else")
        if branch:
            errors.extend(schema_errors(instance, branch, root, path, root_spec))
    return errors

class ProfileTests(unittest.TestCase):
    def test_all_a_is_low_and_all_b_is_high(self):
        low_answers = {q["id"]: ("A" if q["a_value"] == -1 else "B") for q in profile.QUESTIONS["questions"]}
        high_answers = {q["id"]: ("A" if q["a_value"] == 1 else "B") for q in profile.QUESTIONS["questions"]}
        low = profile.score_answers(low_answers)
        high = profile.score_answers(high_answers)
        self.assertTrue(all(d["pole"] == "low" for d in low.values()))
        self.assertTrue(all(d["pole"] == "high" for d in high.values()))

    def test_mixed_and_skipped_are_valid(self):
        answers = {"Q01":"A", "Q02":"A", "Q03":"skip"}
        out = profile.score_answers(answers)["structure"]
        self.assertEqual((out["pole"], out["answered"], out["confidence"]), ("mixed", 2, "medium"))

    def test_two_to_one_majority_is_directional(self):
        low = profile.score_answers({"Q01":"A", "Q02":"B", "Q03":"B"})["structure"]
        high = profile.score_answers({"Q01":"B", "Q02":"A", "Q03":"A"})["structure"]
        self.assertEqual(low["pole"], "low")
        self.assertEqual(high["pole"], "high")

    def test_answer_whitespace_and_case_are_normalized(self):
        out = profile.score_answers({"Q01":" a ", "Q02":" SKIP ", "Q03":None})["structure"]
        self.assertEqual((out["pole"], out["answered"]), ("unknown", 1))

    def test_single_answer_does_not_create_extreme_score_or_default(self):
        p = profile.build_profile({"Q01":"A"}, consent=True)
        dimension = p["dimensions"]["structure"]
        self.assertEqual((dimension["pole"], dimension["confidence"]), ("unknown", "low"))
        self.assertNotIn("score", dimension)
        self.assertEqual(p["collaboration_preferences"]["response_defaults"], [])
        self.assertIn("答题不足", profile.render_markdown(p, lang="zh"))

    def test_coverage_warning_is_independent_of_available_defaults(self):
        answers = {"Q01":"A"}
        for dimension in profile.QUESTIONS["dimensions"]:
            items = [q for q in profile.QUESTIONS["questions"] if q["dimension"] == dimension["id"]]
            if dimension["id"] != "structure":
                for q in items[:2]:
                    answers[q["id"]] = "A" if q["a_value"] == 1 else "B"
        p = profile.build_profile(answers, consent=True, lang="zh")
        markdown = profile.render_markdown(p, lang="zh")
        self.assertIn("1/8 个维度答题不足", markdown)
        # 覆盖不足的 structure 不出建议，但其余维度仍要给出可执行指令
        defaults = p["collaboration_preferences"]["response_defaults"]
        self.assertEqual(len(defaults), 7)
        self.assertTrue(all("——" in d for d in defaults))
        self.assertTrue(any("更外向" in d for d in defaults))

    def test_no_answers_is_unknown_and_null(self):
        out = profile.score_answers({})
        self.assertTrue(all(d["pole"] == "unknown" and "score" not in d for d in out.values()))

    def test_invalid_answer_and_unknown_id_rejected(self):
        with self.assertRaises(ValueError): profile.score_answers({"Q01":"maybe"})
        with self.assertRaises(ValueError): profile.score_answers({"Q99":"A"})

    def test_non_string_question_ids_raise_value_error(self):
        with self.assertRaises(ValueError): profile.score_answers({1:"A"})

    def test_first_option_style_is_not_one_pole_for_every_dimension(self):
        all_first = profile.score_answers({q["id"]:"A" for q in profile.QUESTIONS["questions"]})
        self.assertEqual({d["pole"] for d in all_first.values()}, {"low", "high"})
        self.assertEqual(sum(d["pole"] == "low" for d in all_first.values()), 4)

    def test_profile_and_markdown_have_safety_and_user_controls(self):
        p = profile.build_profile({"Q01":"B"}, reviewed=True, consent=True,
                                  overrides=["先给结论"], today=__import__("datetime").date(2026,1,2))
        self.assertTrue(p["consent_acknowledged"])
        self.assertEqual(p["collaboration_preferences"]["user_overrides"], ["先给结论"])
        self.assertTrue(p["safety"]["non_diagnostic"])
        self.assertTrue(p["safety"]["current_instruction_wins"])
        self.assertTrue(p["safety"]["reviewed_by_user"])
        md = profile.render_markdown(p)
        self.assertIn("我当前提出的要求始终优先", md)
        self.assertIn("编辑或删除", md)
        self.assertIn("My current instructions always take priority", md)
        self.assertIn("edit or delete", md)

    def test_profile_requires_consent(self):
        with self.assertRaises(ValueError): profile.build_profile({})
        with self.assertRaises(ValueError): profile.build_profile({}, consent="yes")

    def test_safety_notes_follow_selected_language(self):
        self.assertNotIn("Informal", profile.build_profile({}, consent=True, lang="zh")["safety"]["notes"])
        self.assertNotIn("非正式", profile.build_profile({}, consent=True, lang="en")["safety"]["notes"])
        self.assertIn("Informal", profile.build_profile({}, consent=True, lang="both")["safety"]["notes"])

    def test_old_profile_without_name_en_still_renders(self):
        old = profile.build_profile({"Q01":"A", "Q02":"B"}, consent=True)
        old["schema_version"] = "1.0.0"
        old.pop("language")
        for dimension in old["dimensions"].values():
            dimension.pop("name_en")
        md = profile.render_markdown(old)
        self.assertIn("计划与灵活度", md)
        self.assertIn("My Soul Profile", md)

    def test_language_selection_outputs_chinese_english_or_both(self):
        p = profile.build_profile({"Q01":"B", "Q02":"B"}, consent=True)
        zh = profile.render_markdown(p, lang="zh")
        en = profile.render_markdown(p, lang="en")
        both = profile.render_markdown(p, lang="both")
        self.assertIn("偏好维度", zh)
        self.assertNotIn("Preference dimensions", zh)
        self.assertIn("Preference dimensions", en)
        self.assertNotIn("偏好维度", en)
        self.assertIn("偏好维度 / Preference dimensions", both)

    def test_cli_generates_both_files(self):
        import subprocess, sys
        with tempfile.TemporaryDirectory() as td:
            src = Path(td) / "answers.json"
            out = Path(td) / "out"
            src.write_text(json.dumps({"Q01":"A"}), encoding="utf-8")
            subprocess.run([sys.executable, str(ROOT / "tools" / "profile.py"), "score", str(src), "--out", str(out), "--consent"], check=True, capture_output=True, text=True)
            self.assertTrue((out / "profile.json").is_file())
            self.assertTrue((out / "USER_PROFILE.md").is_file())
            generated = json.loads((out / "profile.json").read_text(encoding="utf-8"))
            self.assertEqual(generated["dimensions"]["structure"]["answered"], 1)
            self.assertEqual(generated["schema_version"], "2.0.0")

    def test_cli_language_and_overrides(self):
        import subprocess, sys
        with tempfile.TemporaryDirectory() as td:
            src, override_file, out = Path(td) / "answers.json", Path(td) / "overrides.json", Path(td) / "out"
            src.write_text(json.dumps({"Q01":"B", "Q02":"B"}), encoding="utf-8")
            override_file.write_text(json.dumps(["Keep answers concise"]), encoding="utf-8")
            subprocess.run([sys.executable, str(ROOT / "tools" / "profile.py"), "score", str(src),
                            "--out", str(out), "--consent", "--lang", "en", "--overrides", str(override_file)],
                           check=True, capture_output=True, text=True)
            generated = json.loads((out / "profile.json").read_text(encoding="utf-8"))
            markdown = (out / "USER_PROFILE.md").read_text(encoding="utf-8")
            self.assertEqual(generated["language"], "en")
            self.assertEqual(generated["collaboration_preferences"]["user_overrides"], ["Keep answers concise"])
            self.assertIn("Preference dimensions", markdown)
            self.assertNotIn("偏好维度", markdown)

    def test_invalid_cli_overrides_are_rejected(self):
        import subprocess, sys
        with tempfile.TemporaryDirectory() as td:
            src, override_file, out = Path(td) / "answers.json", Path(td) / "overrides.json", Path(td) / "out"
            src.write_text("{}", encoding="utf-8")
            override_file.write_text(json.dumps({"not":"an array"}), encoding="utf-8")
            result = subprocess.run([sys.executable, str(ROOT / "tools" / "profile.py"), "score", str(src),
                                     "--out", str(out), "--consent", "--overrides", str(override_file)],
                                    capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)

    def test_cli_requires_consent(self):
        import subprocess, sys
        with tempfile.TemporaryDirectory() as td:
            src = Path(td) / "answers.json"
            src.write_text("{}", encoding="utf-8")
            result = subprocess.run([sys.executable, str(ROOT / "tools" / "profile.py"), "score", str(src)], capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("--consent", result.stderr)

    def test_cli_output_path_file_returns_clean_error(self):
        import subprocess, sys
        with tempfile.TemporaryDirectory() as td:
            src, out_file = Path(td) / "answers.json", Path(td) / "not-a-directory"
            src.write_text("{}", encoding="utf-8")
            out_file.write_text("occupied", encoding="utf-8")
            result = subprocess.run([sys.executable, str(ROOT / "tools" / "profile.py"), "score", str(src),
                                     "--out", str(out_file), "--consent"], capture_output=True, text=True)
            self.assertNotEqual(result.returncode, 0)
            self.assertIn("无法写入输出目录", result.stderr)
            self.assertNotIn("Traceback", result.stderr)

    def test_schema_covers_generated_profile_shape(self):
        schema = json.loads((ROOT / "schema" / "profile.schema.json").read_text(encoding="utf-8"))
        profile_data = profile.build_profile({}, consent=True)
        self.assertTrue(set(schema["required"]).issubset(profile_data))
        self.assertEqual(set(schema["properties"]["dimensions"]["required"]), set(profile_data["dimensions"]))
        for key, dimension in profile_data["dimensions"].items():
            self.assertTrue(set(schema["$defs"]["dimension"]["required"]).issubset(dimension))
            self.assertTrue(dimension["name"] and dimension["name_en"])
            self.assertNotIn("score", dimension)

    def test_schema_semantics_validate_profile_and_reject_invalid_data(self):
        schema = json.loads((ROOT / "schema" / "profile.schema.json").read_text(encoding="utf-8"))
        data = profile.build_profile({"Q01":"A", "Q02":"B"}, consent=True)
        self.assertEqual(schema_errors(data, schema, schema), [])
        for example in ("generated-balanced", "generated-high", "generated-incomplete", "generated-low"):
            sample = json.loads((ROOT / "examples" / example / "profile.json").read_text(encoding="utf-8"))
            self.assertEqual(schema_errors(sample, schema, schema), [], example)
        invalid = json.loads(json.dumps(data))
        invalid["dimensions"]["structure"]["score"] = 100
        invalid["dimensions"]["structure"]["pole"] = "low"
        invalid["dimensions"]["structure"]["answered"] = 0
        self.assertTrue(schema_errors(invalid, schema, schema))
        old = json.loads(json.dumps(data))
        old["schema_version"] = "1.0.0"
        old.pop("language")
        for dimension in old["dimensions"].values():
            dimension.pop("name_en")
            dimension["score"] = {"low":0,"high":100,"mixed":50,"unknown":None}[dimension["pole"]]
        self.assertEqual(schema_errors(old, schema, schema), [])
        data["schema_version"] = "2.0.1"
        self.assertEqual(schema_errors(data, schema, schema), [])

    def test_questionnaire_has_bilingual_prompts(self):
        self.assertTrue(all(d.get("name") and d.get("name_en") for d in profile.QUESTIONS["dimensions"]))
        self.assertTrue(all(q.get("a") and q.get("a_en") and q.get("b") and q.get("b_en")
                            for q in profile.QUESTIONS["questions"]))
        self.assertEqual(sum(q["a_value"] == 1 for q in profile.QUESTIONS["questions"]), 12)
        self.assertEqual(sum(q["a_value"] == -1 for q in profile.QUESTIONS["questions"]), 12)

if __name__ == "__main__": unittest.main()
