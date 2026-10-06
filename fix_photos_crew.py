#!/usr/bin/env python3
"""
GrindrX Photo/Album Fix Crew
Uses CrewAI with Claude CLI (claude -p) as the LLM backend.
Agents: Inspector → Root Cause Analyst → Frontend Fixer → Rust Fixer → Reviewer
"""

import json
import subprocess
import sys
import time
from pathlib import Path
from typing import Any, Optional, Union

import litellm
from litellm import CustomLLM, ModelResponse
from litellm.types.utils import Choices, Message
from crewai import Agent, Crew, Process, Task


# ── Claude CLI LLM wrapper ────────────────────────────────────────────────────

class ClaudeCliLLM(CustomLLM):
    """Calls `claude -p` subprocess, returns a ModelResponse."""

    def _call_claude(self, messages: list, timeout: int = 300) -> str:
        # Flatten messages into a single prompt
        parts = []
        for m in messages:
            role = m.get("role", "user")
            content = m.get("content", "")
            if role == "system":
                parts.insert(0, f"<system>\n{content}\n</system>")
            elif role == "user":
                parts.append(f"<user>\n{content}\n</user>")
            elif role == "assistant":
                parts.append(f"<assistant>\n{content}\n</assistant>")

        prompt = "\n\n".join(parts)

        cmd = [
            "claude", "-p", prompt,
            "--output-format", "json",
            "--model", "claude-sonnet-4-6",
            "--allowedTools", "",
        ]

        try:
            result = subprocess.run(
                cmd, capture_output=True, text=True, timeout=timeout
            )
        except FileNotFoundError:
            return "ERROR: claude CLI not found. Run: npm install -g @anthropic-ai/claude-code"
        except subprocess.TimeoutExpired:
            return f"ERROR: Claude timed out after {timeout}s"

        if result.returncode != 0:
            # Some versions write the result to stdout anyway
            if result.stdout.strip():
                try:
                    data = json.loads(result.stdout)
                    return data.get("result", result.stdout.strip())
                except json.JSONDecodeError:
                    return result.stdout.strip()
            return f"ERROR (exit {result.returncode}): {result.stderr.strip()[:500]}"

        try:
            data = json.loads(result.stdout)
            return data.get("result", result.stdout.strip())
        except json.JSONDecodeError:
            return result.stdout.strip()

    def completion(self, model: str, messages: list, *args, **kwargs) -> ModelResponse:
        text = self._call_claude(messages)
        return ModelResponse(
            id=f"claude-cli-{int(time.time())}",
            choices=[Choices(message=Message(role="assistant", content=text))],
            model=model,
        )


# Register the provider
claude_cli_provider = ClaudeCliLLM()
litellm.custom_provider_map = [
    {"provider": "claude-cli", "custom_handler": claude_cli_provider}
]

LLM_MODEL = "claude-cli/claude-sonnet-4-6"


# ── Load source files ─────────────────────────────────────────────────────────

def load(path: str) -> str:
    try:
        return Path(path).read_text()
    except Exception as e:
        return f"[ERROR reading {path}: {e}]"

REPO = "/Users/thomasbateman/open-grind"

AUTHED_IMAGE    = load(f"{REPO}/src/lib/components/AuthedImage.svelte")
PROFILE_CARD    = load(f"{REPO}/src/routes/(protected)/(navbar)/(root)/ProfileMiniCard.svelte")
ALBUM_PICKER    = load(f"{REPO}/src/routes/(protected)/chat/[conversationId]/AlbumPicker.svelte")
ALBUM_MESSAGE   = load(f"{REPO}/src/routes/(protected)/chat/[conversationId]/message/AlbumMessage.svelte")
IMAGE_MESSAGE   = load(f"{REPO}/src/routes/(protected)/chat/[conversationId]/message/ImageMessage.svelte")
IMAGE_CAROUSEL_ITEM = load(f"{REPO}/src/routes/(protected)/chat/[conversationId]/ImageCarouselItem.svelte") if Path(f"{REPO}/src/routes/(protected)/chat/[conversationId]/ImageCarouselItem.svelte").exists() else load(f"{REPO}/src/routes/(protected)/(navbar)/profile/[profileId]/ImageCarouselItem.svelte")
REST_RS         = load(f"{REPO}/src-tauri/src/api/rest.rs")
HEADERS_RS      = load(f"{REPO}/src-tauri/src/api/headers.rs")

CONTEXT = f"""
## Project: GrindrX (Tauri 2 + SvelteKit 5 + Rust Android app)

### Known symptoms
1. Profile photos on grid/profile pages show as solid **black boxes**
2. Photos not in an album appear in the album send picker and should be excluded
3. App may freeze when loading many concurrent images

### Architecture
- `AuthedImage.svelte` — fetches CDN images via Rust `fetch_authed_bytes` Tauri command (adds Authorization header, returns base64 data URL)
- `fetch_authed_bytes` (rest.rs) — uses the shared reqwest HTTP client which has `Accept: application/json` as a default header (set in `build_default_headers` in headers.rs)
- CDN URL format: `https://cdns.grindr.com/images/thumb/320x320/{{mediaHash}}`
- Profile photos require `Authorization: Grindr3 {{token}}` header — bare `<img>` tags fail without it
- The `state` field on a photo object: `state === 0` means published/approved; other values are pending/rejected

### Already applied (may or may not have fixed it — still diagnosing)
- Added `.header("Accept", "*/*")` to the `fetch_authed_bytes` request to override `Accept: application/json`
- Added `eprintln!` logging to see CDN response status

---

### FILE: src/lib/components/AuthedImage.svelte
```svelte
{AUTHED_IMAGE}
```

### FILE: src/routes/(protected)/(navbar)/(root)/ProfileMiniCard.svelte
```svelte
{PROFILE_CARD}
```

### FILE: src/routes/(protected)/chat/[conversationId]/AlbumPicker.svelte
```svelte
{ALBUM_PICKER}
```

### FILE: src/routes/(protected)/chat/[conversationId]/message/AlbumMessage.svelte
```svelte
{ALBUM_MESSAGE}
```

### FILE: src/routes/(protected)/chat/[conversationId]/message/ImageMessage.svelte
```svelte
{IMAGE_MESSAGE}
```

### FILE: src-tauri/src/api/rest.rs (fetch_authed_bytes + request_json)
```rust
{REST_RS}
```

### FILE: src-tauri/src/api/headers.rs (build_default_headers — sets Accept: application/json)
```rust
{HEADERS_RS[:3000]}
```
"""


# ── Agents ────────────────────────────────────────────────────────────────────

inspector = Agent(
    role="Code Inspector",
    goal="Read and fully understand the photo/album loading code across Svelte and Rust layers.",
    backstory=(
        "You are a senior full-stack engineer specialising in Tauri, SvelteKit 5 (runes), and Rust. "
        "You read code carefully, trace data flows end-to-end, and document every finding."
    ),
    llm=LLM_MODEL,
    verbose=True,
    allow_delegation=False,
)

analyst = Agent(
    role="Root Cause Analyst",
    goal="Determine exactly why photos show as black boxes and why non-album photos appear in the album picker.",
    backstory=(
        "You are a debugging specialist. You form precise hypotheses, eliminate false theories, "
        "and produce a definitive root-cause report with supporting evidence from the code."
    ),
    llm=LLM_MODEL,
    verbose=True,
    allow_delegation=False,
)

frontend_fixer = Agent(
    role="SvelteKit 5 Engineer",
    goal="Write the correct, minimal fixes for all Svelte components involved in photo/album display.",
    backstory=(
        "You are an expert in SvelteKit 5 runes ($state, $effect, $derived, $props). "
        "You write clean, idiomatic Svelte 5 code and only change what is necessary to fix the bug."
    ),
    llm=LLM_MODEL,
    verbose=True,
    allow_delegation=False,
)

rust_fixer = Agent(
    role="Rust/Tauri Engineer",
    goal="Write the correct, minimal fixes for the Rust fetch_authed_bytes command and any related backend issues.",
    backstory=(
        "You are an expert in Rust, reqwest, and Tauri 2 commands. "
        "You write safe, idiomatic Rust and only change what is necessary to fix the bug."
    ),
    llm=LLM_MODEL,
    verbose=True,
    allow_delegation=False,
)

reviewer = Agent(
    role="Code Reviewer",
    goal="Verify all proposed fixes are correct, complete, and free of regressions before they are applied.",
    backstory=(
        "You are a meticulous senior engineer who reviews diffs for correctness, "
        "edge cases, and unintended side effects. You approve or reject each fix with clear reasoning."
    ),
    llm=LLM_MODEL,
    verbose=True,
    allow_delegation=False,
)


# ── Tasks ─────────────────────────────────────────────────────────────────────

task_inspect = Task(
    description=f"""
Analyse the following GrindrX source code.

{CONTEXT}

Your job:
1. Trace the full data flow for a profile photo from API response → Svelte component → AuthedImage → Rust → CDN → img tag
2. Trace the full data flow for album photos in the send picker
3. List every place where a photo URL is set on an <img> tag (bare or via AuthedImage)
4. Document the `state` field filtering logic for photos
5. Note any concurrency, reactivity, or async issues you spot in AuthedImage.svelte

Output a structured report with sections: Data Flow, Direct img tags found, Album filtering logic, Potential issues.
""",
    agent=inspector,
    expected_output="Structured inspection report covering data flow, all img tag usages, album filtering, and potential issues.",
)

task_analyse = Task(
    description=f"""
Using the inspection report from the Code Inspector plus the source code below, determine the root causes.

{CONTEXT}

Known context:
- The Rust HTTP client has `Accept: application/json` as a default header (set globally in build_default_headers)
- We recently added `.header("Accept", "*/*")` to fetch_authed_bytes to override this — but it may or may not have fixed things
- Previous attempts with bare `<img>` tags failed silently (no onerror fired)
- The `$effect` in AuthedImage sets resolvedSrc = "" first, then async fetch, then resolvedSrc = dataUrl

Hypotheses to evaluate:
A. CDN rejects `Accept: application/json` → returns 406 or JSON body → black box
B. Svelte 5 reactivity: does `resolvedSrc = dataUrl` inside a .then() callback actually trigger DOM update?
C. The img tag gets `loading="lazy"` via ...rest — could lazy loading prevent the fetch from firing?
D. Non-album photos in picker: missing `state === 0` filter somewhere
E. Any other issue you identify from the code

For each hypothesis: CONFIRMED / REFUTED / UNCERTAIN + reasoning from the code.
Then state the definitive root cause(s).
""",
    agent=analyst,
    expected_output="Root cause report with each hypothesis evaluated and a definitive conclusion.",
    context=[task_inspect],
)

task_fix_frontend = Task(
    description=f"""
Based on the root cause analysis, write the complete fixed versions of all Svelte files that need changes.

{CONTEXT}

Rules:
- Use Svelte 5 runes syntax ($state, $effect, $derived, $props) — this is NOT Svelte 4
- Do NOT add unnecessary comments
- Do NOT change anything unrelated to the photo/album bug
- For AuthedImage.svelte: ensure the $effect correctly triggers a DOM update when resolvedSrc changes; handle the lazy loading issue if confirmed; add a loading placeholder so the black box is replaced with a subtle spinner/skeleton
- For AlbumPicker.svelte: ensure only state===0 photos appear in the send picker
- For any other component that needs a fix: provide the full corrected file

Output format for each file:
### FILE: <relative path>
```svelte
<full corrected file content>
```
""",
    agent=frontend_fixer,
    expected_output="Complete corrected Svelte file(s) with fixes applied, one per ### FILE: block.",
    context=[task_analyse],
)

task_fix_rust = Task(
    description=f"""
Based on the root cause analysis, write the complete fixed version of any Rust files that need changes.

{CONTEXT}

Rules:
- Idiomatic Rust, no unnecessary changes
- Keep the eprintln! logging lines — they are useful for debugging
- If the Accept: */* fix is sufficient, confirm it and make no other changes
- If there are additional Rust-side issues (e.g. the http client sending headers that confuse the CDN, missing error handling, etc.), fix them

Output format:
### FILE: src-tauri/src/api/rest.rs
```rust
<full corrected file content>
```
""",
    agent=rust_fixer,
    expected_output="Complete corrected Rust file(s) or confirmation that the already-applied fix is sufficient.",
    context=[task_analyse],
)

task_review = Task(
    description="""
Review ALL proposed fixes from the Frontend Fixer and Rust Fixer agents.

For each fix:
1. Is the root cause correctly addressed?
2. Are there any regressions introduced?
3. Is the Svelte 5 syntax correct (runes, not Svelte 4 stores)?
4. Is the Rust code safe and idiomatic?
5. Are there any edge cases missed?

Output:
- APPROVED or NEEDS_CHANGES for each file
- If NEEDS_CHANGES: exact corrections needed
- Final summary: what to apply, what to skip
""",
    agent=reviewer,
    expected_output="Review verdict (APPROVED/NEEDS_CHANGES) for each proposed fix, with a final apply/skip summary.",
    context=[task_fix_frontend, task_fix_rust],
)


# ── Crew ──────────────────────────────────────────────────────────────────────

crew = Crew(
    agents=[inspector, analyst, frontend_fixer, rust_fixer, reviewer],
    tasks=[task_inspect, task_analyse, task_fix_frontend, task_fix_rust, task_review],
    process=Process.sequential,
    verbose=True,
)

if __name__ == "__main__":
    print("=" * 70)
    print("GrindrX Photo/Album Fix Crew — starting")
    print("=" * 70)
    result = crew.kickoff()
    print("\n" + "=" * 70)
    print("CREW FINAL OUTPUT")
    print("=" * 70)
    print(result)

    # Save full output
    out_path = Path("/Users/thomasbateman/open-grind/crew_photo_fix_output.txt")
    out_path.write_text(str(result))
    print(f"\nSaved to {out_path}")
