# Habit Tracker

A single-page habit tracker built with vanilla HTML, CSS, and JavaScript — no build step, no dependencies.

## How to run

**Option 1 — Open directly in a browser**

Double-click `index.html`, or drag it into any modern browser (Chrome, Firefox, Edge, Safari).

**Option 2 — Serve locally (recommended, avoids any browser file:// restrictions)**

If you have Python installed:
```bash
# Python 3
python -m http.server 8080
```
Then open **http://localhost:8080** in your browser.

Or if you have Node.js:
```bash
npx serve .
```
Then open the URL it prints.

No npm install needed. No build step. No config. Just open and use.

---

## Features

- **Add / rename / delete** habits from the header bar (or the empty-state form)
- **Weekly grid** — habits on the left, Mon–Sun across the top
- **Toggle checkmarks** for any past or current day
- **Today's column** is highlighted so you always know where you are
- **Streak counter** per habit — counts consecutive completed days; stays alive through today even if today isn't ticked yet, so you don't see a broken streak when you open the app in the morning
- **Week navigation** — previous / next week, plus a "This week" shortcut
- **Historical data** — past weeks show their real completion state
- **Persistent** — everything survives full page reloads via `localStorage`
- **Responsive** — horizontal-scroll grid with a sticky habit-name column on narrow screens
- **Accessible** — keyboard navigable, ARIA labels, `focus-visible` outlines, `aria-pressed` on toggle buttons, `aria-live` on the week-range label

## Stack

Vanilla HTML5 · CSS3 (custom properties, `@keyframes`) · ES2020 JavaScript

No frameworks. No build tools. No dependencies.
