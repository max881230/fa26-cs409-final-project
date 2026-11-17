# Part B prototype tasks

Sign in with username demo and password demo. A new browser origin starts with
24 Discover opportunities, 12 tracked applications, and six sample notifications.
Existing saved workspace data is retained across builds and sign-out. The
original anonymous workspace migrates to the fixed demo identity.

1. Browse Discover pages 1–3. Check that pages show 10, 10, and 4 positions; then
   search on page 3 and check that results start on the first matching page.
2. Save a role. Find its Saved record. Open Apply, return from the careers tab,
   choose Not yet, and verify the record is still Saved. Repeat and choose Yes;
   verify one Applied record exists and its notes were preserved.
3. In Applications, use page 2, filter by stage, and open Details. Check that its
   top edge aligns with the Position/Updates headings. Test keyboard navigation
   and the row's hover/focus treatment.
4. Review Figma's sample email, edit the interview time, and confirm. Locate the
   event on the calendar and verify the same time/stage in Details. Save a note,
   reopen it, and reload the page to verify persistence. Also try Ignore and Undo.
5. Review the five additional messages: Notion interview, Stripe deadline
   extension, Linear confirmation, Canva offer, and Datadog rejection. Verify each
   affects only its matched application; status-only updates add no calendar event,
   deadline extensions replace their existing event, and Undo restores the count
   and prior data. Try the inbox filters and Next pending update.
6. Test empty fields, a wrong password, password visibility, demo autofill, Enter
   submission, session restoration after reload, and sign-out. Reload while signed
   out to verify the workspace stays hidden. Saved notes should remain after login.
7. Choose Light, Dark, and System before and after login. Reload and sign out to
   check preference persistence. Change the system appearance while in System
   mode and verify explicit Light/Dark remains independent. Switch themes while
   editing a preparation note to confirm the draft is preserved.
8. Inspect 320px, tablet, and wide desktop layouts in both color schemes. Look for
   corner color gaps, horizontal overflow, clipped actions, mismatched columns,
   readable contrast, keyboard focus, and accessible errors.

Record observed issues, the relevant heuristic, severity (0–4), proposed revision,
before/after evidence, and the result of trying the task again.
