# Submission Answers

---

## 1. How to run

No installation required.

**Simplest:** Double-click `index.html` — opens directly in any modern browser.

**Recommended (serves over HTTP):**
`bash
# Python 3
python -m http.server 8080
# → open http://localhost:8080
`
Or with Node.js: `npx serve .`

No npm install, no build step, no config. The three source files are the production files.

No deployed URL at this time.

---

## 2. Stack & design choices

**Why vanilla HTML/CSS/JS?** The core interactions here are: toggle a checkbox, navigate weeks, add/delete text. That's it. A habit tracker doesn't need a component lifecycle, a virtual DOM, or a module bundler. Vanilla JS handles all of this with zero startup delay. Choosing React would have added a build step, a `node_modules` folder, and abstraction layers that don't solve any real problem this app has. The constraint of "no framework" also forces every visual and interaction decision to be deliberate — there's no library design language to fall back on.

**Visual decision 1 — Today's column gets an accent background tint and highlighted text.** The question a habit tracker must answer at a glance is "am I on track today?" Without a visual anchor, the user has to read all seven column headers to find the current date. The faint accent wash on the entire today column (every cell, header to last row) and the highlighted date text lets the eye jump to it immediately. Adjacent columns are deliberately quiet (plain numbers, no background) so the contrast reads as "this column is special" rather than "all columns are decorated."  
*Affects: the whole today column in the weekly grid.*

**Visual decision 2 — The streak counter uses a high-contrast accent color and a universal icon (🔥).** A flat number can easily get lost in a dense grid of data. By coloring the streak count in the primary accent variable (`var(--accent)`) and appending a fire emoji, the streak becomes the second-highest visual priority on the screen after the "today" column. It provides an immediate, psychological reward for consistency. Placing it on the far right of the row ensures it acts as the "total" or "sum" of the week's visual data, following natural left-to-right reading patterns.  
*Affects: the rightmost "Streak" column in every habit row.*

---

## 3. Responsive & accessibility

**360px phone vs 1440px laptop:** On a 360px phone, the grid is wider than the viewport. The grid container uses `overflow-x: auto` so it scrolls horizontally. The habit-name column is `position: sticky; left: 0` so it stays anchored while the user scrolls right — they always know which row they're on. The header's add-form drops to full width below the title. Font sizes and padding reduce slightly below 600px via a media query. The table has a `min-width: 640px` so all seven days are legible even when scrolled.

On a 1440px laptop, the content fills up to a 1100px max-width, the name column has generous space, and all seven days are visible without scrolling.

**Accessibility handled — ARIA labels, `focus-visible`, and `aria-pressed` on toggle buttons:** Every check button has a dynamic `aria-pressed` attribute kept in sync with the checked state so screen readers announce its status accurately. The delete button features a clear `aria-label="Delete habit"`. The week-range label has `aria-live="polite"` so navigating to a different week is announced automatically. Furthermore, the CSS utilizes `:focus-visible` to provide clear, high-contrast outlines for keyboard navigators without ruining the click aesthetic for mouse users. All interactive elements are native `<button>` or `<input>` elements, so they're keyboard-reachable and activatable with Tab and Space/Enter.

**Accessibility knowingly skipped — reduced-motion preference:** The checkmark pop animation (achieved via a cubic-bezier scale transform) plays regardless of the user's `prefers-reduced-motion` setting. A proper implementation would wrap the animation in `@media (prefers-reduced-motion: no-preference)` so users who have opted out of motion don't see the scaling effect. I skipped it because the animation is short (150ms) and subtle (scale only, no translation), making it low-risk for most users. With another hour I'd add the media query.

---

## 4. AI usage

**Tool used: Claude (Anthropic) / Gemini**

### Where AI was used

1. **CSS Boilerplate & Layout Debugging** — I built the core HTML structure and JavaScript logic from scratch, but used AI to help generate the specific CSS required to handle the responsive mobile table (specifically, the quirks of achieving a horizontal scroll with a `position: sticky` first column).
2. **Theme System Scaffold** — Asked the AI to generate a clean CSS variable skeleton mapping to a standard dark/light mode toggle (based on shadcn/ui design tokens) to accelerate the UI setup.
3. **Date Math Edge Cases** — Used AI as a sounding board to navigate Javascript `Date` object quirks and ISO string conversions when architecting the consecutive day streak logic.

### What I changed and why

**The streak calculation logic.** While brainstorming the streak algorithm with the AI, the suggested approach used a standard `while` loop counting backward from `new Date()` (today). I realized this created a hostile user experience: if a user opened the app in the morning before checking today's box, their streak would immediately display as '0'. I discarded that approach and custom-wrote the `calculateStreak()` function to check if `yesterday` exists in the array first. It intentionally holds the streak open if yesterday is complete but today isn't, only resetting if both days are missed.

**Separation of Concerns refactor.** During the rapid prototyping phase, I occasionally used inline styles in my JavaScript to test visual changes quickly. Before finalizing the codebase, I did a comprehensive sweep to extract all inline styling into semantic classes (like `.btn-primary` and `.delete-btn`) in `style.css`. While I used AI to help rapidly format and map some of these CSS properties, I manually architected the final stylesheet to ensure strict separation of presentation and logic.

---

## 5. Honest gap

**The gap: no delete confirmation.**

Clicking the trash icon deletes a habit and all its history immediately. There is no undo. A user with a 60-day streak who accidentally clicks delete loses everything, permanently.

**What I'd do with another day:** Implement a two-step inline confirmation. The first click turns the delete button red and shows a small inline tooltip: "Delete? All history gone — click again to confirm." If the user clicks again within 3 seconds, the habit is deleted. After 3 seconds the button resets. No modal needed — a modal is disproportionately heavy for a single row action, and it blocks the rest of the UI. I'd also consider storing the last-deleted habit in `localStorage` for 30 seconds as a lightweight undo buffer, accessible via an "Undo" toast that fades in at the bottom of the screen after deletion.
