# Search Event Validator — Documentation

## 1. Purpose

Search-related product surfaces (preview search, full-page search, PLP,
cart, checkout) fire tracking **events** as JSON payloads to a backend
**event processor**. If a payload is missing a required key, has a field
of the wrong type, or a fixed field holds the wrong value, the event
processor either rejects it or silently records bad data.

This repository is a small, standalone web tool that lets a developer or
QA engineer **paste a candidate JSON payload and instantly check whether
it matches the shape the event processor expects**, for a chosen event
type — without needing to send the request to a real backend first. It
is a structural pre-flight check, not the event processor itself.

The tool intentionally validates **structure**, not full business
semantics:

- Required top-level and nested keys must be present.
- Nested objects/arrays must follow the expected hierarchy.
- Values must have the expected primitive type (`string`, `number`,
  `boolean`, `object`, `array`, `null`).
- Certain fields must equal a fixed literal (e.g. `action` must be
  `"click"`) or be one of a fixed set of values.
- Arrays that must be non-empty are checked against a minimum length,
  and their items are validated recursively.
- **Extra/unknown keys are always allowed** — the validator only flags
  missing or malformed required data, it never complains about
  additional fields.

## 2. Quick start

```bash
npm install
npm run dev       # start Vite dev server (http://localhost:5173 by default)
npm run build     # type-check (tsc -b) + production build to dist/
npm run preview   # serve the production build locally
npm run lint      # run ESLint
```

Requires Node.js compatible with Vite 8 / TypeScript ~6.0. There is no
backend, no environment variables, and no test suite in this repo — it
is a pure client-side single-page app.

## 3. Using the app

The UI (`src/App.tsx`) is a single page with three panels:

1. **Event Type panel (left)**
   - A `<select>` lists every known event type (from
     `src/data/eventSpecs.ts`).
   - **Load Sample JSON** replaces the input textarea with a known-good
     example payload for the selected event type and resets the result
     panel.
   - **Clear** empties the textarea.
   - A static help panel lists what is/isn't checked (see §1).
   - Switching the event type resets the result panel and shows the
     required top-level keys for the newly selected event, but does
     **not** touch the current JSON input or auto-validate it.

2. **JSON Input panel (right)**
   - A textarea for pasting/editing the payload.
   - **Submit & Validate** parses the text as JSON and validates it
     against the schema for the currently selected event type.
   - **Format JSON** parses the current text and pretty-prints it
     (2-space indent) back into the textarea, useful for cleaning up
     minified or copy-pasted payloads.

3. **Result panel (bottom, full width)**
   - A status badge: `✓` success (green), `✕` error (red), `!` warn
     (amber, used for informational states like "sample loaded" or
     "cleared").
   - "Selected Event" and "Issues Found" counters.
   - **Expected required top-level keys** — the top-level keys the
     current event type's schema requires (nested keys are not listed
     here, only surfaced via issues).
   - Either a **Missing / invalid fields** list, one entry per issue
     found (each with a category, JSON path, and message), or a
     **Validation summary** success message when there are no issues.
   - A **Formatted JSON Preview** of the last successfully parsed
     payload, shown after a validate/format action.

### Typical workflow

1. Pick the event type you're about to send (or already have a payload
   for).
2. Either click **Load Sample JSON** as a starting point, or paste your
   own payload into the textarea.
3. Click **Submit & Validate**.
4. Fix any reported issues (missing keys, wrong types, wrong fixed
   values) and re-validate until the summary shows success.

### What a validation error looks like

For a missing key, an issue's `path` is the dotted/indexed location of
the offending field (e.g. `value.context.browser.user_agent`,
`value.entities[0].id`), `type` is a short category
(`Missing key`, `Type mismatch`, `Incorrect value`, `Invalid value`,
`Too few items`), and `message` is a human-readable explanation.
Validation does **not** short-circuit on the first error — it collects
every issue it finds in one pass (except that a type mismatch at a
given node stops descending into that node's children, since there is
nothing valid to recurse into).

## 4. Project structure

```
index.html                 Vite HTML entry point, mounts #root
src/main.tsx                React entry point (StrictMode + createRoot)
src/App.tsx                 The entire UI: state, handlers, JSX
src/App.css, src/styles.css Styling
src/types/index.ts           Active type definitions (SchemaNode, EventSpec, Issue, ResultStatus, RenderPayload)
src/types/events.ts          Unused/legacy types built on Zod (see §6.4)
src/data/eventSpecs.ts       The schema + sample-payload catalogue, one entry per event type
src/utils/validator.ts       JSON parsing helpers + the recursive schema validator
public/                      Static assets (favicon, icons)
```

There is no routing, no global state library, and no backend calls —
`App.tsx` holds all UI state locally with `useState`/`useMemo`.

## 5. Internal technical details

### 5.1 The schema model (`src/types/index.ts`)

Schemas are **not** Zod schemas or JSON Schema — they are a small
custom recursive type, `SchemaNode`:

```ts
interface SchemaNode {
  type?: "string" | "number" | "boolean" | "object" | "array" | "null";
  equals?: string | number | boolean | null;   // exact literal match
  oneOf?: Array<string | number | boolean | null>; // enum match
  required?: Record<string, SchemaNode>;        // object: required child keys
  minItems?: number;                            // array: minimum length
  itemSchema?: SchemaNode;                      // array: schema each item must satisfy
}
```

This is deliberately minimal: it only ever describes what must be
*present and correct*; it has no concept of optional keys, unions of
shapes, string patterns/formats, or numeric ranges. An `EventSpec` pairs
one `SchemaNode` (or `null`, meaning "no validation performed / not yet
defined") with a `sample` payload used for "Load Sample JSON":

```ts
interface EventSpec {
  sample: unknown;
  schema: SchemaNode | null;
}
```

`Issue` is the shape emitted per validation failure (`path`, `type`,
`message`); `ResultStatus` is `"success" | "error" | "warn"`, driving the
result panel's badge/color.

### 5.2 The validator (`src/utils/validator.ts`)

`validateAgainstSchema(value, schema, path = "root", issues = [])` is a
recursive depth-first walk over `value` guided by `schema`:

1. If `schema` is `null`/falsy, no checks are performed (used for event
   types that have no schema defined yet — none remain unused in
   practice, see §5.3).
2. **Type check**: `getType(value)` classifies the runtime value as
   `"array" | "null" | "object" | <typeof>`. If `schema.type` is set and
   doesn't match, a `Type mismatch` issue is recorded and recursion into
   that branch stops (children can't be meaningfully checked against a
   wrong container type).
3. **Literal check**: if `schema.equals` is set and `value !== schema.equals`,
   an `Incorrect value` issue is recorded (comparison is via `!==`, so
   this is a strict-equality check — no coercion).
4. **Enum check**: if `schema.oneOf` is set and `value` isn't one of the
   listed literals, an `Invalid value` issue is recorded.
5. **Object recursion**: if `schema.type === "object"` and `schema.required`
   is set, each key in `required` is checked for presence
   (`Missing key` issue if absent) and, if present, recursively
   validated with `path` extended as `parent.key`. Keys on `value` that
   aren't in `schema.required` are ignored entirely — this is how
   "extra keys are allowed" is implemented.
6. **Array recursion**: if `schema.type === "array"`, a `Too few items`
   issue is recorded when `value.length < schema.minItems`; if
   `schema.itemSchema` is set, every array element is recursively
   validated with `path` extended as `parent[index]`.

All issues are accumulated into a single flat array returned to the
caller — the UI doesn't need to know about the recursion, it just
renders the list.

`parseJsonInput` / `normalizeJsonText` sit in front of `JSON.parse`:
`normalizeJsonText` trims the input, strips a leading/trailing `"""`
wrapper (in case a payload was copy-pasted from a doc block), and
collapses `""""`/`""` sequences into a single `"`. This is a heuristic
aimed at payloads copy-pasted from rendered documentation or logs where
quotes get doubled/escaped oddly — it is not a general JSON repair tool,
so unusual malformed JSON will still fail to parse and surface as an
`Invalid JSON format` error in the UI. `formatJson` is just
`JSON.stringify(obj, null, 2)`.

### 5.3 The event catalogue (`src/data/eventSpecs.ts`)

`eventSpecsBase` is a `Record<string, EventSpec>` keyed by a
human-readable event name. `eventSpecs` (same object) and
`eventTypeNames` (`Object.keys(eventSpecsBase)`, defining dropdown
order) are the two exports the UI consumes.

Defined event types (11 total), grouped by the flow they belong to:

| Flow | Event types |
|---|---|
| Preview search (typeahead widget) | Widget Click for Preview Search, Widget View for Preview Search, Request for Preview Search |
| Full page search results | Widget Click for Full Page Search, Widget View for Full Page Search, Request for Full Page Search |
| Category/PLP listing | Widget Click for PLP, Widget View for PLP, Request for Full PLP |
| Cart / checkout | Add to Cart Event, Order Confirmation Event |

Common shape notes:

- Widget click/view events share a top-level envelope:
  `action`, `ckey`, `client_time_ms`, `name` (fixed to `"widget"` or
  `"cart"`/`"order_confirm"` depending on event), `server_time_ms`,
  `uid`, `uuid`, and a `value` object holding `context`
  (`browser.user_agent`, `geo.ip`, `page.uri`) plus event-specific data
  such as `entities` (an array of `{ entity_type, id }`, with
  `entity_type` pinned via `equals` or constrained via `oneOf`
  depending on the event) and `rfk_id`.
- `Request for *` events represent the outgoing search/listing request
  itself (not a user interaction) and describe a different envelope:
  `context` (`page.uri`, `user.uuid`/`user.custom`, `browser.user_agent`,
  `store.group_id`/`store.id`, `ids.*`), `ordercloud` (seller/inventory
  info — absent on the PLP variant), and `widget.items[]`, each item
  carrying a nested `search` object (`content`, `query`, `suggestion[]`,
  and, for full page/PLP, `facet`, `sort`, `offset`, `limit`,
  `response_context`).
- `Add to Cart Event` and `Order Confirmation Event` follow the
  widget-style envelope but with cart/order-specific `value` contents
  (`transaction.order_total/order_subtotal/order_id` for order
  confirmation).

**Schema cloning quirk**: `Widget Click for Full Page Search` and
`Widget Click for PLP` are declared in the base object with
`schema: null`, then immediately overwritten at the bottom of the file:

```ts
eventSpecsBase["Widget Click for Full Page Search"].schema = JSON.parse(
  JSON.stringify(eventSpecsBase["Widget Click for Preview Search"].schema),
) as SchemaNode;
```

This deep-clones the `Widget Click for Preview Search` schema (via a
JSON round-trip, since `SchemaNode` here is plain data) so all three
"Widget Click for …" event types validate identically. If the click
schema ever needs to diverge between flows, this cloning must be
replaced with its own literal schema; editing the Preview Search click
schema alone will silently also change these two derived ones. There
are no other `schema: null` entries left after this module finishes
initializing — every event type in the dropdown has an active schema.

### 5.4 Unused legacy code — `src/types/events.ts`

`src/types/events.ts` defines `EventDefinition` (using `ZodTypeAny`
from the `zod` package) and a `ValidationIssue` type. Nothing in the
app imports this file, and `zod` — although listed as a dependency in
`package.json` — is not used anywhere in the active code path
(`eventSpecs.ts` and `validator.ts` both use the plain `SchemaNode`
model from `src/types/index.ts` instead). This appears to be a leftover
from an earlier design that considered using Zod schemas directly. Any
future move to Zod-based validation would replace `SchemaNode` +
`validateAgainstSchema` with schemas of this shape and `zodSchema.safeParse(...)`,
but as it stands this file and the `zod` dependency can be treated as
dead code.

## 6. Extending the tool

### 6.1 Add a new event type

1. Open `src/data/eventSpecs.ts`.
2. Add a new entry to `eventSpecsBase`:
   ```ts
   "My New Event": {
     sample: { /* a realistic example payload */ },
     schema: {
       type: "object",
       required: {
         /* one SchemaNode per required key, mirroring the sample's shape */
       },
     },
   },
   ```
3. No other file needs to change — `eventTypeNames` and the dropdown
   pick it up automatically from `Object.keys(eventSpecsBase)`.
4. If the new event's schema is largely identical to an existing one,
   either write it out again or clone it the same way the two
   `Widget Click for …` entries are derived (see §5.3) — but be aware
   that this creates a maintenance link between the two entries.

### 6.2 Add a new kind of check

Checks live entirely in `validateAgainstSchema`
(`src/utils/validator.ts`). To add a new constraint (e.g. a regex
pattern, a numeric min/max, "optional but if present must be X"):

1. Add the new field to `SchemaNode` in `src/types/index.ts`.
2. Handle it inside `validateAgainstSchema`, pushing an `Issue` with a
   descriptive `type` when the constraint is violated.
3. Use the new field in any `eventSpecs.ts` entries that need it.

### 6.3 UI changes

All UI logic lives in `src/App.tsx`; there is no component
decomposition to navigate — state (`eventType`, `jsonInput`, `result`)
and every handler (`loadSample`, `validateCurrentInput`, `clearInput`,
`formatCurrentJson`, `handleEventChange`) are defined directly in the
`App` function component.

## 7. Tech stack

- **React 19** + **TypeScript** (strict-ish, via `tsc -b` project
  references: `tsconfig.app.json` for the app, `tsconfig.node.json` for
  Vite config).
- **Vite 8** (`@vitejs/plugin-react`) for dev server and bundling.
- **ESLint 10** with `typescript-eslint`, `eslint-plugin-react-hooks`,
  and `eslint-plugin-react-refresh` (`eslint.config.js`).
- No test runner, no backend, no environment configuration — this is a
  self-contained, purely client-side static app suitable for deployment
  as static files (`npm run build` output in `dist/`).
