# Cadence website — project brief for Claude Code

Cadence (founderscadence.com) is an independent development arm for venture portfolios, based in Barcelona.
Founder: Rodin Affourtit. Partner: Stefan van Eerde (Shadow Leaders, a network of ~80 specialists).

## The product, in one system
1. **Cadence Pulse**: a private 20-minute check-up that each founder answers alone. Founders get a Team Report. Funds see only aggregates.
2. **Cadence Weekend**: three nights, max 4 founding pairs (8 founders) and 4 experts on site (facilitators, a business psychologist and an experienced founder), plus a mediator on call. Editions: Lakehouse (Lake Banyoles), Coast (Costa Brava), Alpine (Pyrenees/Alps).
3. **The 90-day Loop**: rituals, a monthly Pulse and a matched coach.
4. **Specialists**: the right expert from the Shadow Leaders network, through an anonymous brief that the founders approve.
5. **Pulse again** at day 90. Funds get the **Cadence Intelligence** portfolio view and an LP report.

Funds' entry offer: **a free Portfolio Pulse** (at least 8 teams; readout presented in a 30-minute meeting). "Book a pilot" is the secondary step.

## Hard rules (never break these)
- Funds only ever see aggregates of **5 or more teams**. Never individual teams, never individual founders, and never who took part.
- Never show share splits, equity or cap-table details anywhere on the site.
- **No invented endorsements, testimonials, logos or people presented as real.** The names of researchers and experts must belong to real people who have agreed to be shown, or be clearly removed.
- The university logos (VU Amsterdam, Universitat de Barcelona, Esade) and the line "Method developed with researchers from" go live only once each institution has confirmed in writing. Check this with Rodin before deploying.
- Any example data is labelled "example". Never present it as client results.
- Never use the words "Trojan horse", or any wording that makes the free Pulse sound like bait.
- Tone: product and system, scientific and calm. Not dreamy, not retreat-y. Short sentences, no hype.

## Site structure (plain static HTML, no build step yet)
- `site/index.html`: funds landing page (version C2). This is the only page live at launch.
- `drafts/`: earlier versions (founders-C.html, funds-C-long.html) to reuse sections from. Not deployed.
- Planned pages, in order: founders.html, a two-door home page (the funds page then moves to /funds), intelligence.html (platform + trust & data), method.html (method & team).
- Header at full build: Cadence · For funds · For founders · Intelligence · Method · [Free Portfolio Pulse]. Footer: product links, Method & team, contact, LinkedIn, Privacy policy, Aviso legal.
- `site/css/lp.css`: all styles. The brand tokens are in `:root`. Reuse the existing classes (`.wrap .sec .grid-2 .facts .btn .btn-clay .btn-line .night .tint .raised ...`) instead of adding new styles.
- `site/img/`: photos. `site/favicon.svg` is the logo mark.
- The SVG illustrations and diagrams are inline in the HTML. Edit them in place.

## Brand
- Colours: surface #F3EFE7, raised #FBF9F4, tint #EAF1EF, text #14201E, clay #A8472A (primary buttons), water #5D8C87, night #0E1A18 (dark "techy" sections), signal #5FE0B9 (data accents on dark backgrounds).
- Type: Instrument Serif (display), Inter Tight (body), JetBrains Mono (labels and readouts).
- Light pages; data and Intelligence sections are dark (`.night .dots`).

## Calls to action
- Every button (Free Portfolio Pulse, Talk to us, Book a pilot, Contact) opens https://cal.com/founderscadence/30min-cadence in a new tab. There are no forms on the site.

## Hosting
- Cloudflare (the domain registrar is also Cloudflare). The static `site/` folder is deployed through the GitHub integration, so each push to `main` goes live.
- Keep it static until the platform starts. The platform (survey, reports, fund dashboard) comes later as a separate app on Supabase (already set up; choose an EU region).
