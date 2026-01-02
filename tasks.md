# Tasks

A living checklist and instructions for enabling **client‑side editing** of the Ceremony Card, allowing buyers to try customizing the card before purchase.

---

## 1) Goal

Allow potential clients to **edit and preview** the Ceremony Card in real time. This gives them an interactive demo to adjust titles, dates, venues, and colors to see how their personalized invitation would look before buying.

---

## 2) Files Added / Modified

**New**

* `lib/eventTypes.ts` — Defines `EventData` structure and default sample values.
* `context/EventContext.tsx` — React Context that holds editable event data and saves it to `localStorage`.
* `components/CeremonyEditor.tsx` — Simple form that clients use to modify the Ceremony Card content.
* `app/providers.tsx` — Wraps the app with `EventProvider` so edits are globally available.
* `app/editor/page.tsx` — Public editing page for clients to try customization.

**Modified**

* `components/CeremonyCard.tsx` — Reads live data from the context instead of using hardcoded values.

---

## 3) Step‑by‑Step Instructions

1. **Create data types**

   * Add `lib/eventTypes.ts` with `EventData`, `Contact`, and `defaultEvent`.

2. **Create the event context**

   * Add `context/EventContext.tsx` with `EventProvider` and `useEvent()`.
   * It stores edits in `localStorage` so clients’ changes persist during a session.

3. **Wrap the app with provider**

   * Add `app/providers.tsx` and wrap `<EventProvider>` around children in `app/layout.tsx`.

4. **Make the card reactive**

   * Import `useEvent` in `CeremonyCard.tsx` and replace hardcoded data:

     ```tsx
     const { event } = useEvent();
     ```

5. **Add the editable form**

   * Create `components/CeremonyEditor.tsx` to allow field editing (title, dates, location, etc.).
   * Add an `app/editor/page.tsx` route to expose the live preview editor for clients.

6. **Test the experience**

   * Open `/editor` and modify the fields.
   * Open the main invitation card page and confirm the data matches edits.
   * Refresh to ensure the data persists for the user session.

---

## 4) Usage Notes

* **For clients:** This editor is available to try freely; changes are local to their browser and do not affect the global design.
* **Persistence:** Uses `localStorage`, so each client’s edits stay only on their device.
* **Reset:** The form includes a “Reset” button to restore the default event sample.
* **Preview:** The Ceremony Card updates live, reflecting each input.

---

## 5) QA Checklist

* [ ] Card loads from context and reflects current `event` data.
* [ ] Client edits instantly update the preview.
* [ ] Local edits persist on refresh.
* [ ] Reset button returns to defaults.
* [ ] Date/time values correctly format and sync to calendar links.
* [ ] Contacts add/remove works smoothly.
* [ ] UI remains responsive on mobile and desktop.

---

## 6) Troubleshooting

* **Edits not showing:** Ensure the editor and card are both wrapped in `<EventProvider>`.
* **LocalStorage blocked:** Some browsers in private mode may disable it.
* **Calendar times incorrect:** Confirm valid ISO8601 date strings with timezone (e.g., `2025-10-29T11:00:00+08:00`).

---

## 7) Conventions

* Client editor available at `/editor`.
* Tailwind styling consistent with the invitation’s design system.
* No backend required — all editing runs on the client.

---

## 8) Future Enhancements (Optional)

* Allow theme color or background pattern selection.
* Enable save/export of the customized `.ics` and preview image.
* Add login or temporary session to let clients send their customized preview to the seller.
* Integrate optional “Buy Now” CTA when satisfied with the preview.

---

## 9) Definition of Done

* Clients can open `/editor` and freely modify the invitation details.
* Ceremony Card immediately reflects those edits.
* Changes persist in their browser until reset.
* Experience feels smooth, mobile-friendly, and ready for demo/sales usage.

---

## 10) Client Editing Forms (Per Section)

This adds realtime, client-side editing forms that directly update the card as users type. Intended for buyers to try before purchase.

### Dependencies

Install TipTap for the Section 3 rich text editor:

```bash
npm i @tiptap/react @tiptap/starter-kit
```

### Data model additions (extend `EventData`)

Add these fields to `EventData` in `lib/eventTypes.ts` (with sensible defaults):

* `uiTitlePrefix: string` — default `"Majlis Aqiqah"` (Section 1)
* `uiName: string` — default `"Aqil"` (Section 1)
* `greeting: string` — default `"Assalamualaikum, hello & selamat sejahtera"` (Section 2)
* `speech: string` — multiline text for the invitation blurb (Section 2)
* `aturcaraTitleUseDefault: boolean` — default `true` (Section 3)
* `aturcaraTitle: string` — default `"Aturcara Majlis"` (Section 3, used when toggle is OFF)
* `aturcaraHtml: string` — TipTap HTML content for the schedule list (Section 3)
* `allowCongrats: boolean` — default `true` (Section 4, when `false` hide Congrats UI)
* `congratsNote: string` — short description explaining the toggle state (Section 4)

> These augment existing fields: `dateShort`, `locationShort`, `locationFull`, `dateFull`, `timeRange`.

### New files

* `components/forms/Section1Form.tsx` — Inputs for:

  * Event Title (Majlis line)
  * Person Name (e.g., Aqil)
  * Date Short → `event.dateShort`
  * Location Short → `event.locationShort`
* `components/forms/Section2Form.tsx` — Inputs for:

  * Greeting line
  * Speech (textarea)
  * Full Location → `event.locationFull`
  * Date Full → `event.dateFull`
  * Time Range → `event.timeRange`
* `components/forms/Section3Form.tsx` — Controls:

  * Toggle: use default title `"Aturcara Majlis"` or custom
  * If custom, input for title
  * TipTap editor for the schedule body (times + activities)
* `components/forms/Section4Form.tsx` — Controls:

  * Toggle: allow guests to send congratulations
  * Short description text field (what the toggle means for guests)
* `components/RichTextEditor.tsx` — Small TipTap wrapper component that returns HTML to store in `aturcaraHtml`.
* `app/editor/page.tsx` — Renders the **paginated** forms (see Section 11) for clients.

### Rendering changes in `components/CardContent.tsx`

* Section 1:

  * Render `event.uiTitlePrefix` instead of hardcoded "Majlis Aqiqah".
  * Render `event.uiName` instead of hardcoded "Aqil".
  * Keep `event.dateShort` and `event.locationShort` as-is.
* Section 2:

  * Render `event.greeting`.
  * Render `event.speech` (respect line breaks).
  * Render `event.locationFull`, `event.dateFull`, `event.timeRange`.
* Section 3:

  * Title: `event.aturcaraTitleUseDefault ? "Aturcara Majlis" : event.aturcaraTitle`.
  * Body: render `event.aturcaraHtml` as HTML (from TipTap).
* Section 4:

  * If `event.allowCongrats` is `false`, hide the "Tulis Ucapan Tahniah" button; show `event.congratsNote` instead.

### UX behavior

* All inputs update the context immediately on change — no Save button needed.
* The TipTap editor outputs HTML; store it in `event.aturcaraHtml`.
* Use `localStorage` via the existing provider for persistence.

### QA additions

* [ ] TipTap content persists and re-renders after refresh.
* [ ] Toggling default/custom title in Section 3 switches the header correctly.
* [ ] Disabling congrats in Section 4 hides the button and shows the note.
* [ ] No console errors from `dangerouslySetInnerHTML` (sanitize upstream if needed).

---

## 11) Paginated Form UX (Show One Section at a Time)

**Requirement:** Do **not** show all forms at once. Display exactly **one section form at a time**, with a top navigation **select dropdown** to jump between sections, and **Prev/Next** buttons. When a section is selected, the **Card preview should auto-scroll to that section**.

### Section index and labels (for the select)

Use these exact labels in the select so clients understand the order:

1. `1. Title & Header`
2. `2. Greeting & Details`
3. `3. Aturcara`
4. `4. Ucapan`

### Implementation outline

* Create `components/EditorPager.tsx` that controls which form is visible.

  * State: `current = 1 | 2 | 3 | 4`.
  * `<select>` with the four options above. On change, update `current`.
  * `Prev`/`Next` buttons to move between steps; clamp to 1..4.
  * Render **only** the form that matches `current`:

    * `1` → `<Section1Form />`
    * `2` → `<Section2Form />`
    * `3` → `<Section3Form />`
    * `4` → `<Section4Form />`
* In `CardContent`, add anchors or refs per section:

  * Wrap each visual section with an id: `id="card-sec-1"`, `id="card-sec-2"`, etc.
* On `current` change in `EditorPager`, **scroll** the card preview to the matching anchor:

  * `document.getElementById("card-sec-<n>")?.scrollIntoView({ behavior: "smooth", block: "start" });`
  * If preview is in an iframe/other component, expose a `scrollToSection(n)` prop or a context method that triggers the scroll.

### Editor page wiring

* Replace `app/editor/page.tsx` content with the pager:

  * Top bar: the select dropdown showing `1..4` options.
  * Middle: the visible section form only.
  * Bottom: Prev/Next buttons.
* Ensure forms still edit the same `EventContext` so changes reflect instantly.

### Accessibility

* Label the select: `Pilih seksyen untuk sunting`.
* Announce section changes with `aria-live="polite"` (optional).

### QA additions for pagination

* [ ] Only one form is visible at any time.
* [ ] Select dropdown jumps to the chosen section.
* [ ] Prev/Next updates the select value and visible form.
* [ ] Card preview auto-scrolls to the corresponding section on change.
* [ ] Mobile usability verified (tap targets & scroll behavior).

---

## 12) Door Interaction Update (Manual Open with Button)

**Requirement:** The door should **not open automatically**. Instead, show a centered button that displays the **Event Title** and the text **"Buka"**. Only when the client clicks this button should the door opening animation play.

### Behavior

* On initial load: doors are **closed** and **visible**; the card contents are behind the doors as before.
* A floating/centered **Open button** appears above the doors with label: `"{event.title} — Buka"`.
* When the button is clicked:

  * Trigger the same opening animation as before.
  * Hide the button while the animation plays and after doors are hidden.
* The existing **Replay Opening** button may remain (optional) to re-run the animation.

### State changes in `CeremonyCard`

* Remove the autoplay logic:

  * **Delete** the `useEffect(() => { setDoorsOpen(true); }, [])`.
* Initialise like this:

  * `const [doorsOpen, setDoorsOpen] = useState(false);`
  * `const [showDoors, setShowDoors] = useState(true);`
* Add a new handler:

  ```tsx
  const openDoors = () => {
    // ensure doors visible, then trigger animation on next frame
    setShowDoors(true);
    setDoorsOpen(false);
    requestAnimationFrame(() => setDoorsOpen(true));
  };
  ```

### Button UI (before doors open)

Place a button above the doors (z-index higher than doors). For example:

```tsx
{showDoors && !doorsOpen && (
  <div className="absolute inset-0 z-20 flex items-center justify-center p-4">
    <button
      onClick={openDoors}
      className="px-5 py-3 rounded-full bg-white/90 backdrop-blur border border-rose-200 shadow text-rose-700 text-sm hover:bg-white"
      aria-label="Buka kad jemputan"
    >
      {event.title} — Buka
    </button>
  </div>
)}
```

### Keep the existing door components & animations

* No change to the `Door` component structure.
* Keep the current `AnimatePresence` blocks and `motion.div` animations.
* Ensure the right-door `onAnimationComplete` logic still sets `showDoors(false)` **only** when `doorsOpen` is true (unchanged from current behavior).

### Optional: Replay button

* Keep (or remove) the bottom **Replay Opening** button. If kept, it should:

  ```tsx
  const replay = () => {
    setDoorsOpen(false);
    setShowDoors(true);
    requestAnimationFrame(() => setDoorsOpen(true));
  };
  ```

### QA checklist for doors

* [ ] No automatic opening on first load.
* [ ] Button shows `{event.title} — Buka` and is centered/visible above doors.
* [ ] Clicking the button starts the door opening animation and hides the button.
* [ ] After animation completes, doors are removed (content accessible).
* [ ] Replay still works (if retained).
