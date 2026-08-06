# Studio S. — Dark Cinematic Portfolio

A responsive design portfolio for an independent digital designer serving cafés, restaurants, and local hospitality businesses in Ghent.

## Included projects

- **FOS Café** — an expressive neighbourhood café website
- **KINU** — an ultra-minimal Japanese restaurant website
- **Maison Éloise** — a classic European property-rental landing page

The portfolio includes detailed process case studies for FOS and KINU, and all three concepts are complete, working websites inside this repository.

It also includes a complete brand-collateral library for FOS and KINU: print-ready menus, two-sided business cards, digital menu boards, and portrait campaign assets. The PDFs are downloadable directly from the portfolio.

## Run locally

This is a dependency-free static website. Start any static server from the repository root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Before publishing professionally

- Replace “Studio S.” with the final personal or business name.
- Replace `hello@studio-s.be` with the real contact email.
- Update the profile copy with final personal information.
- Connect the repository to GitHub Pages, Cloudflare Pages, or another static host.

## Structure

```text
.
├── index.html       # Portfolio
├── fos/             # FOS Café case study
├── kinu/            # KINU restaurant case study
├── residence/       # Maison Éloise rental case study
├── collateral/      # Editable FOS and KINU digital collateral
├── output/pdf/      # Print-ready menus and business cards
└── assets/          # Optimized portfolio imagery
```
