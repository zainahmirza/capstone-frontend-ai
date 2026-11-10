# WORKFLOW.md

## What I built

A settings form, built twice: once with a lazy one-line prompt, once with a detailed spec. Same feature, two branches (`round-1-vague` and `round-2-precise`), fresh AI session each time.

## Round 1 — vague prompt

Prompt: "build a settings form"

The AI ran with it and built a much bigger form than I expected: display name, email, bio, theme, language, timezone, three notification toggles, and a public profile toggle. It used manual `useState` and regex for validation, no tests, and put the component in `src/components/SettingsForm.jsx`.

It's actually decent code — labeled inputs, some `aria-invalid` attributes, dark mode support. But it guessed at scope. I never asked for theme, language, or timezone settings, and now that's extra surface area to maintain and review that I didn't plan for.

## Round 2 — precise prompt

I specified the exact 5 fields I wanted, the validation library to use (react-hook-form + zod), accessibility requirements (labels, aria-describedby, role="switch"), and asked it to write and run tests.

Result: exactly the fields I asked for, nothing extra. It installed react-hook-form, zod, and @hookform/resolvers, wrote `SettingsForm.jsx` plus `SettingsForm.test.jsx`, and ran the tests itself — all 3 passed (valid submission, missing display name, invalid email format).

## What the diff shows

- **Scope**: round 1 invented 6 fields I didn't ask for; round 2 matched my spec exactly.
- **Validation**: round 1 = manual regex in component state; round 2 = a proper zod schema, easier to extend and read.
- **Tests**: round 1 has none. Round 2 has 3 passing tests I can point to and re-run anytime.
- **File layout**: round 2 added a real test setup (`test-setup.js`) that didn't exist before — round 1 never touched testing infrastructure at all.

## The AI mistake I caught

Round 1's scope creep is the clearest mistake. Given one vague sentence, the AI filled in the gaps with assumptions instead of asking what I actually wanted. It didn't feel wrong at first glance — the code looks fine — but I'd have shipped four settings nobody asked for and no way to verify any of it worked.

## Time and effort

Round 1 was fast to prompt but I'd have needed a full read-through and back-and-forth to trim it down to what I actually needed, plus write tests myself after the fact. Round 2 took longer to write the prompt, but I got working, tested code on the first pass with nothing to cut. Once you count the cleanup round 1 would need, round 2 was faster overall — writing the spec upfront saved more time than it cost.

## Rules I'm adding to `.cursorrules`

1. Always list the exact fields/props required — never let the AI infer scope from a vague description.
2. Forms use react-hook-form + zod for validation, not manual useState + regex.
3. Any new component with logic (validation, state transitions) needs accompanying tests written and run before it's considered done.
