# Studio S. — Dark Cinematic Portfolio

A responsive client-acquisition portfolio for an independent design practice serving distinctive local businesses and places.

## Included projects

- **FOS Café** — an expressive neighbourhood café website
- **KINU** — an ultra-minimal Japanese restaurant website
- **Maison Éloise** — a classic European property-rental landing page
- **Maison Dentaire** — a calm-clinical dental practice landing page
- **SILLAGE Nº7** — an archival niche-fragrance e-commerce experience
- **MATERIA 01** — an avant-garde skincare atelier and e-commerce experience

The focused homepage features FOS, KINU and SILLAGE Nº7. The complete work archive preserves all six concepts, which remain complete working websites inside this repository.

Detailed case studies for FOS, KINU and SILLAGE Nº7 now live on a dedicated case-studies page, while the complete packages, optional additions, process and project terms live on a dedicated services-and-terms page.

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

- The profile identifies Safouan Aouezghar and lists English, French and Arabic.
- Project enquiries are directed to `hello@safouanaouezghar.com`.
- The verified GitHub profile is linked. Add LinkedIn once the correct public profile URL is confirmed.
- Connect the repository to GitHub Pages, Cloudflare Pages, or another static host.

## Structure

```text
.
├── index.html       # Focused acquisition homepage
├── work/            # Complete six-project archive
├── case-studies/    # Full FOS, KINU and SILLAGE dossiers and collateral
├── services-and-terms/ # Packages, additions, process and terms
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
