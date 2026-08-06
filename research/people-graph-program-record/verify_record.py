#!/usr/bin/env python3
"""Offline integrity checks for the People Graph program record."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent


def load_json(name: str):
    with (ROOT / name).open(encoding="utf-8") as fh:
        return json.load(fh)


def fail(message: str, errors: list[str]) -> None:
    errors.append(message)


def main() -> int:
    errors: list[str] = []
    findings = load_json("findings.json")
    sources = load_json("source-receipts.json")
    swarm = load_json("swarm-status-2026-08-06.json")
    manifest = load_json("file-manifest.json")

    finding_ids = [f["id"] for f in findings["findings"]]
    if len(finding_ids) != len(set(finding_ids)):
        fail("duplicate finding IDs", errors)
    if not all(re.fullmatch(r"PG-AUDIT-\d{3}", value) for value in finding_ids):
        fail("invalid finding ID format", errors)
    for finding in findings["findings"]:
        for key in ("severity", "title", "status", "evidence", "reasoning", "blast_radius", "recommended_action"):
            if not finding.get(key):
                fail(f"{finding['id']} missing {key}", errors)

    source_ids = [s["id"] for s in sources["sources"]]
    if len(source_ids) != len(set(source_ids)):
        fail("duplicate source IDs", errors)
    for source in sources["sources"]:
        if not source.get("url", "").startswith("https://"):
            fail(f"{source['id']} has a non-HTTPS source URL", errors)
        if not source.get("observed_at"):
            fail(f"{source['id']} missing observed_at", errors)

    lanes = swarm["lanes"]
    prompts = sorted(lane["prompt"] for lane in lanes)
    if prompts != list(range(1, 14)):
        fail(f"expected prompt numbers 1..13, got {prompts}", errors)
    allowed_states = {"draft_pr", "pushed_no_pr", "branch_reserved_empty", "absent"}
    for lane in lanes:
        if lane["github_state"] not in allowed_states:
            fail(f"prompt {lane['prompt']} has invalid state {lane['github_state']}", errors)
        if lane["github_state"] == "branch_reserved_empty" and lane["ahead_by"] != 0:
            fail(f"prompt {lane['prompt']} empty branch is ahead", errors)
        if lane["github_state"] == "draft_pr" and not lane.get("pr"):
            fail(f"prompt {lane['prompt']} draft_pr missing PR number", errors)
        if lane["github_state"] == "absent" and lane.get("head_sha"):
            fail(f"prompt {lane['prompt']} absent lane has head SHA", errors)

    current_prompts = (ROOT / "prompts" / "parallel-slam.md").read_text(encoding="utf-8")
    prompt_headings = re.findall(r"^## Prompt (\d+) ", current_prompts, re.MULTILINE)
    if [int(n) for n in prompt_headings] != list(range(1, 14)):
        fail(f"parallel prompt headings are {prompt_headings}, expected 1..13", errors)

    historical = (ROOT / "prompts" / "dependency-ordered-superseded.md").read_text(encoding="utf-8")
    old_headings = re.findall(r"^## Prompt (\d+) ", historical, re.MULTILINE)
    if len(old_headings) != 13:
        fail(f"historical prompt pack has {len(old_headings)} prompts, expected 13", errors)

    import hashlib
    for relative, receipt in manifest["files"].items():
        path = ROOT / relative
        if not path.exists():
            fail(f"manifest path missing: {relative}", errors)
            continue
        digest = hashlib.sha256(path.read_bytes()).hexdigest()
        if digest != receipt["sha256"]:
            fail(f"manifest digest mismatch: {relative}", errors)
        if path.stat().st_size != receipt["bytes"]:
            fail(f"manifest byte count mismatch: {relative}", errors)

    markdown_files = list(ROOT.rglob("*.md"))
    link_pattern = re.compile(r"\[[^\]]*\]\(([^)]+)\)")
    for md in markdown_files:
        text = md.read_text(encoding="utf-8")
        for target in link_pattern.findall(text):
            if target.startswith(("http://", "https://", "#", "mailto:")):
                continue
            target = target.split("#", 1)[0]
            if not target:
                continue
            resolved = (md.parent / target).resolve()
            try:
                resolved.relative_to(ROOT.resolve())
            except ValueError:
                fail(f"{md.relative_to(ROOT)} link escapes record root: {target}", errors)
                continue
            if not resolved.exists():
                fail(f"{md.relative_to(ROOT)} has missing local link: {target}", errors)

    if errors:
        print("FAIL")
        for error in errors:
            print(f"- {error}")
        return 1

    print("PASS")
    print(f"findings={len(finding_ids)} sources={len(source_ids)} lanes={len(lanes)} markdown={len(markdown_files)}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
