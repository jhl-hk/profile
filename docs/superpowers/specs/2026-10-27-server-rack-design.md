# Home server rack

## Intent

Add network and server atmosphere to the site through one set piece on the home page: a server rack that holds the projects.
It sits in the same visual world as the departure board: a dark physical object inside the aviation and terminal site.

## Goals

- Replace the "Featured projects" row list on the home page with a rack.
- One device per project, all entries in `src/data/projects.ts`.
- Each device links to its project, like the current row's arrow link.

## Non-goals

- No real network data: no ASN, prefixes, peers, PoPs or live fetches.
- The Projects page keeps `ProjectRow`.
- No footer hop path, topology background or other site-wide network motifs.

## Anti-goals

- Not a stock "server" illustration: it must read as the same hand-built object family as the departure board and split-flap tiles.
- No decoration that delays or hides the project links.

## Approaches

1. Network details woven into existing components: footer hop path, port lamps, `* * *` traceroute 404. Low risk, little presence.
2. A rack set piece on the home page. Strongest identity, most new work. **Chosen.**
3. Network topology layered on the chart background. Site-wide, but noisy and costly to animate.

The user then chose to have the rack replace the home project list rather than add a separate section holding blog topics.

## Design

### Placement

- `src/pages/[lang]/index.astro`: the `featured-projects` section keeps its heading and "View all" link; `ProjectRow` is replaced by `ServerRack`.
- New component `src/components/ServerRack.astro`.

### Rack

- Dark panel in both themes, built from the `.board-surface` palette (`--board-text`, `--board-amber`, `--board-muted`).
- Side rails with unit numbers, top to bottom.
- One device per project, then one blank vented panel to finish the frame.

### Device face

- Project name, then host in mono (`linkHost`) followed by the project's tags on one line.
- A switch block of eight RJ45 jacks in two rows; most port lamps blink, a few stay dark.
- A power lamp and a link lamp; the link lamp is green for `active` and blinks like traffic.
- The localized status text stays available to screen readers, as in `ProjectRow`.
- The whole face is the link: `target="_blank"`, `rel="noreferrer"`, and the same accessible name as `ProjectRow` (`externalProject: name`).
- Hover and focus: the device's port lamps flicker faster.

### Motion

- On reveal, devices power on top to bottom: power lamp, then link lamps.
- Lamp blinking is CSS with per-port delays fixed at build time.
- Reduced motion: lamps steady, no power-on sequence.
- Blinking pauses when the rack is off screen.

### Responsive

- Narrow screens: rails and jacks shrink; below 480px the lamp labels hide and the tag line truncates.
- No horizontal overflow at 390px.

### Copy

- New UI strings, if any, go in `src/i18n/ui.ts` for `en`, `ja` and `zh`.

## Left to the builder

- Exact unit heights per device and port count.
- Whether the power-on uses `data-reveal` with a new mode in `src/lib/motion.ts` or CSS triggered by the existing reveal.
- README: add `ServerRack` to the Layout list.
