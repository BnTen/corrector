# Design System Law — Text Corrector

## Surfaces

| Token | Value | Use |
| --- | --- | --- |
| Canvas | `#F3F4F6` | Page background |
| Elevated | `#FFFFFF` | Cards, panels, editor stage |
| Inverse | `#14151A` | Top bar, primary buttons |

## Accents (lint + UI)

| Token | Value | Role |
| --- | --- | --- |
| Lime | `#D4EF3A` | Active tools, focus, success accents |
| Sky | `#BDEBFF` | Style lint |
| Coral | `#FF4D3D` | Spelling lint, danger |
| Pink | `#F8BBD0` | Grammar lint |
| Yellow | `#FFF59D` | Punctuation lint |
| Lavender | `#E1BEE7` | Conjugation lint |

## Layout rules

1. **Desktop-first** — three-zone workspace (tools / stage / insights). Mobile collapses to center stage + bottom tool dock.
2. **One composition** — the editor scene is the hero; avoid dashboard chrome in the first viewport of the editor.
3. **Cards sparingly** — white elevated surfaces (`rounded-[14px]`, soft shadow) only for interactive or content containers.
4. **Top bar is brand** — near-black bar with “Text Corrector”; never bury the product name.
5. **Lint color is law** — TipTap marks use `.lint-*` classes only; do not invent alternate underline colors.

## Typography

Geist Sans for UI (`--font-geist-sans`). Keep body on canvas gray; ink near-black `#14151A`.

## Motion

Prefer short, purposeful transitions (hover, dock active state). No glow stacks or purple gradients.
