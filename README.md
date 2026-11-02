# RISE — BNI Navi Mumbai

A Next.js App Router magazine website based on the six client PDFs in `docs/`. React, TypeScript and native CSS; no parallel Vite application or Tailwind dependency.

## Run and verify

```sh
npm install
npm run dev
npm run typecheck
npm test
npm run build
```

Open http://localhost:3000. The landing page's static sections render on the server; the form, reader dialogs and follow-up experience are client components. `app/api/leads/route.ts` is the server-only submission endpoint.

## Design

Burgundy, warm ivory, BNI red and muted gold, with Schibsted Grotesk interface text and Instrument Serif accents. A compact desktop hero pairs an upright original magazine cover with a two-step form. All six client fields and explicit consent are retained. Story cards show complete, straight magazine pages; the event artwork remains fully visible.

On phones, the opening features the original cover at a readable size, an edition summary and a clear action before the form. Story previews use a native scroll-snap shelf with previous/next controls and an announced position. Larger body text and touch targets keep the supporting sections comfortable to browse.

The site includes responsive community metrics, opportunity cards, founder story, event details, FAQs, keyboard-accessible native dialogs, a mobile CTA, thank-you screen, resend cooldown, share links and guest-visit requests. Form-step changes announce the new step and keep the form beneath the header without opening the keyboard automatically. Dialog close buttons remain reachable while scrolling on phones. Reduced-motion preferences are respected. Original source PDFs are preserved in `docs/`; duplicate image copies and unused dependencies have been removed.

## Delivery modes

Copy `.env.example` to `.env.local` only if the latter does not already exist. Keep credentials out of source control. Restart the server after configuration changes.

- **preview** (default): skips WhatsApp. If `EMAIL_*` / `GOOGLE_SHEETS_WEBHOOK_URL` are set, every lead still emails the team and appends a Google Sheet row (same pattern as JM Visa / BookMyCorp).
- **doubletick**: sends the approved WhatsApp template from the server, plus email + Sheets when configured.
- **webhook**: forwards the validated request to your HTTPS automation, plus email + Sheets when configured.

### Email + Google Sheets (2 Apps Scripts)

1. Set `EMAIL_USER`, `EMAIL_APP_PASSWORD` and `EMAIL_RECEIVER` in `.env.local`.
2. **Form leads sheet** — create `RISE_BNI_Navi_Mumbai_Leads`, paste `google-apps-script-leads.js`, deploy Web app → `GOOGLE_SHEETS_WEBHOOK_URL`.
3. **Visitor tracking sheet** — create `RISE_BNI_Navi_Mumbai_Visitor_Tracking`, paste `google-apps-script-visitor-tracking.js`, deploy Web app → `VISITOR_TRACKING_WEBHOOK_URL`.
4. Both deployments: Execute as Me, Who has access: Anyone. Restart `npm run dev`. Smoke-test email with `npm run email:check`.

### DoubleTick setup

1. Supply a working API key and registered sender in `DOUBLETICK_API_KEY` and `DOUBLETICK_FROM`.
2. Set the final 48-page PDF's public HTTPS URL as `RISE_MAGAZINE_URL`.
3. Set the approved template name and language. Configure `DOUBLETICK_TEMPLATE_DATA_JSON` to match its exact placeholder order, header and dynamic URL-button parameters. The example is illustrative, not an approved template.
4. Supported substitutions are `{{firstName}}`, `{{fullName}}`, `{{magazineUrl}}`, `{{visitUrl}}` and `{{coverUrl}}`. URL-button parameters may be suffixes depending on the approved template; match the provider's configuration.
5. Run `npm run whatsapp:check` for read-only channel/template diagnostics. It never sends a message or prints the credential.
6. Enable `RISE_DELIVERY_MODE=doubletick` only after account permissions and template configuration are verified.

The supplied account key returned **HTTP 403 (FORBIDDEN)** for channel details and template listing during setup. The UI remains in preview mode until this is resolved. No real WhatsApp messages have been sent. The template name, sender and final magazine URL still need confirmation.

Official reference: [DoubleTick template API](https://docs.doubletick.io/reference/outgoing-messages-whatsapp-template).

### Automation and guest visits

Set `RISE_LEAD_WEBHOOK_URL` and optionally `RISE_WEBHOOK_TOKEN`. Requests contain `action` (`subscribe`, `resend`, `visit`), name, normalized +91 phone, email, business, area, BNI status, consent version, timestamp and allowed campaign attribution. Direct DoubleTick requests carry the same metadata in `customData`.

The connected automation must implement durable lead storage, cross-instance deduplication/rate limits, backup email, tracked downloads, STOP/unsubscribe handling, delivery retries and the client's follow-ups. The built-in 60-second cooldown is a bounded per-process duplicate-submit guard; it is not a distributed abuse-prevention service. Guest-visit requests require the BNI team to confirm chapter, date and venue.

## Reference boundaries

The client PDFs supply content and flow requirements. The website uses a new visual design and includes a sample delivery message. QR cards and outbound campaigns are separate assets. The thank-you page intentionally has no direct magazine download. Before public launch, confirm delivery configuration, final copy, event details and the privacy policy.
