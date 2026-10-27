# Home Server Rack Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the home page's featured-project rows with a server rack whose devices are the projects.

**Architecture:** One Astro component, `ServerRack.astro`, renders the rack from `projects`. Lamp motion is CSS keyframes; a small inline script marks the rack live while it is on screen so blinking pauses off screen. No changes to `src/lib/motion.ts`.

**Tech Stack:** Astro 7, scoped CSS, existing `[data-reveal]` motion.

**Spec:** `docs/superpowers/specs/2026-10-27-server-rack-design.md`

## Global Constraints

- Rack palette: `.board-surface` variables (`--board-text`, `--board-amber`, `--board-muted`); dark in both themes.
- No real network data shown.
- Device link: `target="_blank"`, `rel="noreferrer"`, `aria-label={`${copy.externalProject}: ${project.name}`}` with `copy = getUiCopy(locale).projects`.
- Status text: `copy[project.status]` in an `.sr-only` span.
- Reduced motion: lamps steady and lit.
- No horizontal overflow at 390px.

## Review Focus

- No JavaScript: lamps must render lit, not stuck on an "off" first keyframe. Check by disabling JS in the browser.
- Reduced motion: the global `animation-duration: 0.01ms` rule ends every lamp keyframe on its final frame, so the final frame must be "on".
- Keyboard: focus ring visible on the whole device face; hover and focus both speed up the port lamps.
- Long project names and four or more tags: name truncates with ellipsis, ports wrap without widening the rack.
- Light theme: the dark rack sits on the light page with the same shadow treatment as the departure board.

---

### Task 1: ServerRack component on the home page

**Files:**
- Create: `src/components/ServerRack.astro`
- Modify: `src/pages/[lang]/index.astro` (featured-projects section, imports)
- Modify: `README.md` (Layout list)

**Interfaces:**
- Produces: `ServerRack` with props `{ projects: readonly (typeof projects)[number][]; locale: Locale }`.

- [ ] **Step 1: Build `ServerRack.astro`**
  - Root `<div class="rack board-surface" data-rack>`; rails left and right, `aria-hidden`, unit numbers counted bottom-up (`U1` at the bottom). Units: 2 per project, 1 for the blank vented panel.
  - Devices in an `<ol>`; each `<li data-reveal style="--unit: n">` holds one `<a class="device">` covering the face.
  - Face: power lamp, link lamp (green, `active`), project name, host via `linkHost(project.url)` in mono with the tags after it, and a 2 × 4 switch block of RJ45 jacks. Port lamps get build-time `--blink-delay` and `--blink-duration` from `(deviceIndex, portIndex)` so they look random but stay deterministic; a fixed subset stays dark.
  - Keyframes: `power-on` (off → on, delayed by `--device` × 180ms) and `traffic` (flicker, final frame on). Hover and `:focus-visible` shorten `--blink-duration`.
  - Script: an `IntersectionObserver` with the reveal margin toggles `data-live` per device. Under `@media (scripting: enabled)`, lamp animations pause on devices without `data-live`.
  - ≤720px: rails narrow; ≤480px: lamp labels hidden, jacks shrink.

- [ ] **Step 2: Wire into the home page**
  In `src/pages/[lang]/index.astro`, replace `projects.slice(0, 2).map(... ProjectRow ...)` with `<ServerRack projects={projects} locale={locale} />`; drop the unused `ProjectRow` import.

- [ ] **Step 3: README**
  Add `src/components/ServerRack.astro` to the Layout list: home rack, one device per project, lamps blink while on screen.

- [ ] **Step 4: Verify**
  Run: `bun run verify`. Expected: all tests pass, "Generated site output verified."
  Browser at 1440 and 390, dark and light: rack renders, links open the project, focus ring visible, `scrollWidth` equals viewport width, JS disabled shows lit lamps, reduced motion shows steady lamps.

- [ ] **Step 5: Commit**

```bash
git add src/components/ServerRack.astro src/pages/[lang]/index.astro README.md docs/superpowers
git commit -m "feat(home): show projects as a server rack"
```
