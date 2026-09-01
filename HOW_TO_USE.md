# How to Use the JSON Event Validator

## What is this tool for?

Before certain actions on the website (like clicking a search result,
viewing a product, adding something to a cart, or completing an order)
are sent to our systems, they are recorded as a small piece of
structured data. Think of it like a receipt that says "this happened,
here are the details."

This tool lets you **check that one of these "receipts" is filled out
correctly** before it gets sent along — so you can catch mistakes early
instead of finding out later that something didn't record properly.

You don't need any technical background to use it. You will mostly be:

1. Choosing what kind of event you're checking.
2. Pasting in the data you want to check.
3. Clicking a button.
4. Reading a plain-English result telling you if anything is wrong.

## Opening the tool

Open the tool's web address in your browser, the same way you would
open any website. No login or setup is required.

When the page loads, you'll see three sections stacked on the page:

- **Event Type** (top left) — lets you pick what kind of event you're
  checking.
- **JSON Input** (top right) — where you paste the data you want to
  check.
- **Result** (bottom) — shows you what the tool found after you check
  your data.

> A quick note on "JSON": JSON is just a common way of writing data as
> text, using curly braces `{ }`, square brackets `[ ]`, and
> `"key": "value"` pairs. You don't need to understand it in depth —
> you'll usually be given this text by a developer, a log file, or a
> testing tool, and your job is just to paste it in and check it.

## Step-by-step guide

### 1. Choose the event type

At the top left, use the **Event Type** dropdown to select the kind of
event your data represents — for example "Widget Click for Preview
Search" or "Add to Cart Event". This tells the tool which rules to
check your data against, since every event type expects slightly
different information.

If you're not sure which one to pick, ask whoever gave you the data
(or check the context it came from — e.g. a search box interaction vs.
a checkout page).

### 2. Get some data into the box

You have two options:

- **Paste your own data** directly into the large **JSON Input** box on
  the right. This is what you'll do when you're checking a real payload
  someone gave you, or something you copied from a browser's developer
  tools or a log.
- **Click "Load Sample JSON"** to fill the box with a working example
  for the event type you selected. This is useful if you just want to
  see what a correct example looks like, or want a starting point to
  experiment with (for example, deleting a field on purpose to see what
  error message appears).

Other buttons in this area:

- **Clear** empties the input box completely.

### 3. Check your data

Click **Submit & Validate**. The tool will read through your data and
compare it against what's expected for the event type you picked.

If your text isn't valid JSON at all (for example, a missing comma or
quotation mark), you'll be told the data couldn't be read, along with a
short hint about what's wrong.

### 4. (Optional) Tidy up the formatting

If your pasted data is all on one line or hard to read, click
**Format JSON** to have the tool neatly re-indent it. This doesn't
change the content, only how it's displayed — useful for making dense
data easier to scan by eye.

## Understanding your results

After you click **Submit & Validate**, look at the **Result** panel at
the bottom of the page:

- A **green checkmark (✓)** and "Valid JSON structure" means everything
  the tool checks for is present and correctly filled in. Nothing more
  to do.
- A **red X (✕)** means something is wrong. Scroll down to the
  **"Missing / invalid fields"** section — each row tells you:
  - **What kind of problem it is** (e.g. a field is missing entirely,
    or it has the wrong kind of value).
  - **Where in the data it is** — a short label like `value.entities[0].id`
    pointing to the exact field. Read it left to right as "inside
    `value`, inside the first item of `entities`, the `id` field."
  - **A plain-English explanation** of what was expected versus what
    was actually found.
- An **amber "!"** badge appears for informational messages that aren't
  errors — for example right after you load a sample or clear the box,
  before you've clicked Validate.

Further down, two more panels can help:

- **"Expected required top-level keys"** shows, as a list of small
  tags, the main pieces of information this event type must include.
  This is a quick way to sanity-check your data even before validating.
- **"Formatted JSON Preview"** shows a neatly formatted copy of the
  data you just checked, so you can visually compare it against the
  sample if needed.

### A note on extra information

It's completely fine if your data contains **extra fields** beyond what
the tool checks for. The validator only flags information that is
**missing or incorrect** — it will never complain about additional
details being present.

## Frequently asked questions

**"Invalid JSON format" — what does this mean?**
It means the text you pasted isn't structured the way JSON should be
(for example, a missing closing bracket, a stray comma, or unmatched
quotation marks). Double-check that you copied the entire payload,
including its outermost `{` and `}`. Clicking **Format JSON** can also
help surface where the structure breaks.

**Do I need to fix every issue listed?**
Yes — each row under "Missing / invalid fields" represents something
the receiving system expects. If any of them are left unresolved, the
event may not be recorded correctly (or at all) once it's actually
sent.

**Can I check the same data against a different event type?**
Yes. Just change the **Event Type** dropdown and click **Submit &
Validate** again — your pasted data stays in the box, only the rules it's
checked against change.

**Does this tool send my data anywhere?**
No. Everything happens directly in your browser. Pasting data in and
checking it does not transmit anything to any backend system — it's a
purely local check.

**I made changes but the Result panel didn't update.**
The Result panel only updates when you click one of the buttons
(**Submit & Validate**, **Load Sample JSON**, **Clear**, **Format
JSON**, or when you change the Event Type). Simply typing in the box
doesn't trigger a new check — click **Submit & Validate** again after
editing.

## Tips

- When testing whether you understand what's required, try loading a
  sample and then deleting one field at a time to see what error
  message shows up — it's a safe way to learn what each event type
  needs.
- Keep a known-good sample (via **Load Sample JSON**) handy to compare
  against when something looks wrong in your real data.
- If you're unsure what a field name in an error message refers to,
  check the **Formatted JSON Preview** — it shows your data with the
  same field names, laid out for easy reading.
