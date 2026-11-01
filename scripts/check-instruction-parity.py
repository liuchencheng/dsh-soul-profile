"""校验插件与便携 CLI 的指令文案是否一致。

同一条偏好有两条落地路径：插件把指令注入系统提示（`src/client/index.tsx` 的
`INSTRUCTIONS` / `INSTRUCTIONS_EN`），便携 CLI 把同样的指令写进 `USER_PROFILE.md`
（`skill/tools/profile.py` 的 `recommendations`）。两份手写文案容易各自漂移，
所以这里做一次逐条比对。

用法 / Usage:
    python scripts/check-instruction-parity.py
"""

from __future__ import annotations

import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parents[1]
TSX = ROOT / "src" / "client" / "index.tsx"
PY = ROOT / "skill" / "tools" / "profile.py"


def ts_instructions() -> dict[str, tuple[str, str]]:
    text = TSX.read_text(encoding="utf-8")
    block = text[text.index("const INSTRUCTIONS: Record"):text.index("const INSTRUCTIONS_EN")]
    found = re.findall(r"\n  (\w+): \[\n    '([^']*)',\n    '([^']*)',\n  \],", block)
    return {dim: (low, high) for dim, low, high in found}


def py_instructions() -> dict[str, tuple[str, str]]:
    text = PY.read_text(encoding="utf-8")
    block = re.search(r"recommendations = \{(.*?)\n    \}", text, re.S)
    if block is None:
        raise SystemExit("未找到 recommendations 定义")
    found = re.findall(
        r'"(\w+)": \(\("([^"]*)", "[^"]*"\), \("([^"]*)", "[^"]*"\)\)',
        block.group(1),
    )
    return {dim: (low, high) for dim, low, high in found}


def main() -> int:
    ts = ts_instructions()
    py = py_instructions()
    problems: list[str] = []

    if len(ts) != 8:
        problems.append(f"TS 侧解析到 {len(ts)} 个维度，期望 8")
    if len(py) != 8:
        problems.append(f"Python 侧解析到 {len(py)} 个维度，期望 8")

    for dim in sorted(set(ts) | set(py)):
        if dim not in ts:
            problems.append(f"{dim}: 仅 Python 侧存在")
            continue
        if dim not in py:
            problems.append(f"{dim}: 仅 TS 侧存在")
            continue
        for pole, index in (("low", 0), ("high", 1)):
            if ts[dim][index] != py[dim][index]:
                problems.append(f"{dim}/{pole} 文案不一致\n    TS: {ts[dim][index]}\n    PY: {py[dim][index]}")

    if problems:
        print("指令文案不一致：")
        for item in problems:
            print("  -", item)
        return 1

    print(f"指令文案一致：{len(ts)} 个维度 × 2 极，中英各一套。")
    return 0


if __name__ == "__main__":
    sys.exit(main())
