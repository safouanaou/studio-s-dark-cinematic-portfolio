# Studio S. — Dark Cinematic Portfolio

A responsive design portfolio for an independent digital designer serving distinctive local businesses and places.

## Included projects

- **FOS Café** — an expressive neighbourhood café website
- **KINU** — an ultra-minimal Japanese restaurant website
- **Maison Éloise** — a classic European property-rental landing page
- **Maison Dentaire** — a calm-clinical dental practice landing page
- **SILLAGE Nº7** — an archival niche-fragrance e-commerce experience
- **MATERIA 01** — an avant-garde skincare atelier and e-commerce experience

The portfolio includes detailed process case studies for FOS and KINU, and all six concepts are complete, working websites inside this repository.

It also includes a complete brand-collateral library for FOS and KINU: print-ready menus, two-sided business cards, digital menu boards, and portrait campaign assets. The PDFs are downloadable directly from the portfolio.

The portfolio’s design-process section explains the thinking behind the work: research, positioning, hierarchy, visual direction, responsive prototyping, accessibility, refinement, and brand-system extension.

The services area includes three transparent packages with starting prices, defined deliverables, realistic timelines, optional additions, and straightforward project terms.

The personal-profile chapter introduces the independent designer behind Studio S. with an editorial portrait, first-person story, working approach, capabilities, and client-relevant details.

## Run locally

This is a dependency-free static website. Start any static server from the repository root:

```bash
python3 -m http.server 8080
```

Then open `http://localhost:8080`.

## Before publishing professionally

- Replace “Studio S.” with the final personal or business name.
- Replace `hello@studio-s.be` with the real contact email.
- Extend the public profile later with any name, languages, education, or social links you want clients to see.
- Connect the repository to GitHub Pages, Cloudflare Pages, or another static host.

## Structure

```text
.
├── index.html       # Portfolio
├── fos/             # FOS Café case study
├── kinu/            # KINU restaurant case study
├── residence/       # Maison Éloise rental case study
├── dentist/         # Maison Dentaire dental-practice landing page
├── sillage/         # SILLAGE Nº7 fragrance e-commerce experience
├── materia/          # MATERIA 01 skincare e-commerce experience
├── collateral/      # Editable FOS and KINU digital collateral
├── output/pdf/      # Print-ready menus and business cards
└── assets/          # Optimized portfolio imagery
```
