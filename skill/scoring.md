# 计分规则 / Scoring Rules

每个维度包含 3 道 A/B 题。每题通过 `a_value` 标注 A 选项取值（`-1` 或 `+1`），B 取相反值；题目交错反向，避免固定选择 A 自动形成相同倾向。`skip`、缺失题目或 `null` 不计入结果，不进行插补。 Each dimension has three A/B items. `a_value` assigns A a value of `-1` or `+1`, and B receives the opposite; item keying is balanced to avoid a fixed A response creating one uniform pole. Skipped, missing, and `null` answers are excluded without imputation.

## 维度计算 / Per-dimension calculation

- `answered`：有效回答数（0–3）。 Number of valid answers (0–3).
- 当前版本不输出 0–100 数值分数：24 道二选一题无法支持这种精细比较。低覆盖度下不生成倾向或协作默认建议。Current versions emit no 0–100 score: 24 forced-choice items do not support that level of precision. Low coverage produces neither a pole nor a collaboration default.
- 达到至少 2 题后，均值 <= `-(1/3)` 时为 `low`，均值 >= `1/3` 时为 `high`，否则为 `mixed`。Among at least two answers, use `low` at <= `-(1/3)`, `high` at >= `1/3`, and `mixed` otherwise.
- 三题中 2:1 的多数票会显示对应倾向。只有两题作答且一正一反时为 `mixed`。A 2:1 majority among three answers is directional. With only two answers, a one-to-one split is `mixed`.
- `confidence`：0–1 题为 `low`，2 题为 `medium`，3 题为 `high`。它只表示答题覆盖度，不代表测量效度。Coverage label: 0–1 answers is `low`, 2 is `medium`, 3 is `high`. It describes coverage, not validity.

覆盖度为 `low` 的维度不会生成协作默认建议。低覆盖结果可见于表格，但不应作为 Agent 指令。 Dimensions with `low` coverage do not produce collaboration defaults. Low-coverage results may appear in the table but must not be treated as agent instructions.

这些阈值只是界面摘要规则，并非经验证的心理学界值。混合结果正常；不要比较用户，也不要据此预测行为。 These thresholds are UI summary rules, not validated psychological cutoffs. Mixed results are normal; do not compare users or predict behavior from them.
