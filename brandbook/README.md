# Karmanto brandbook

What the Karmanto brand is made of and how to use it: name, icon, wordmark, colours, typography and the files of the
website.

## Name

- **Karmanto** — one word, capital `K`, the rest lowercase. Not `KarManto` or `KARMANTO`.
- Pronounced **kar-MAHN-toh**: Russian _karman_ («pocket») + Latin _memento_ — slips of paper with words you carry in
  your pocket.
- Tagline: **Words that are always with you**.
- Domain: `karmanto.com`, support: `support@karmanto.com`.

## Icon

The app icon — a leather pocket with flashcards and a leaf — is the brand mark. Source:
[`karmanto-icon.svg`](karmanto-icon.svg) (1024 × 1024, from the app repository, `docs/logo/`).

- Use it **as is**: don't recolour, redraw, crop or take parts of it; the beige rounded square is part of the icon.
- Keep free space around it of at least 1/8 of its size.
- Minimum size: 16 px on screen (favicon).
- Don't add shadows, outlines or frames; no busy backgrounds behind it. A soft shadow like under paper is fine on
  marketing images (`og.png`).

## Wordmark

`Karmanto` set as live text in **Noto Sans SemiBold (600)** next to the icon (site header) or in **Bold (700)** on
large images (`og.png`). The icon goes on the left, the word on the right, vertically centred.

## Colours

The palette «Sand» of the app (`lib/core/theme/app_colors.dart`), in two themes. The site follows the device theme by
default.

| Token               | Light     | Dark      | Role                                         |
| ------------------- | --------- | --------- | -------------------------------------------- |
| `background`        | `#F3ECE0` | `#1B1814` | Page background                              |
| `paper`             | `#FCF9F3` | `#27231D` | Cards, header, menus, banners                |
| `outline`           | `#E4DACB` | `#383229` | Borders, dividers                            |
| `text-primary`      | `#2B261F` | `#F1E9DC` | Main text                                    |
| `text-secondary`    | `#5A5145` | `#C8BCAA` | Secondary text                               |
| `text-muted`        | `#6E6457` | `#A09584` | Hints, captions                              |
| `primary`           | `#8A5A2E` | `#E3BC8B` | Primary buttons, links                       |
| `on-primary`        | `#FFFFFF` | `#2A1E11` | Text on `primary`                            |
| `primary-container` | `#EBDCC6` | `#4A3D2C` | Highlighted elements (text — `text-primary`) |
| `know`              | `#3F6E47` | `#9DC8A0` | «I know»                                     |
| `again`             | `#A84A33` | `#EC9E86` | «Don't know», errors                         |

Contrast on `background` (WCAG AA needs 4.5 : 1): light — text 12.8, secondary 6.6, muted 4.9, primary 5.0, white on
primary 5.9; dark — text 14.7, secondary 9.5, muted 6.0, primary 10.0, text on primary 9.2.

## Typography

[Noto Sans](https://fonts.google.com/noto/specimen/Noto+Sans) (variable), as in the app: body text 400–500, headings
600–700. SIL Open Font License. On the website it comes from `@fontsource-variable/noto-sans`, self-hosted, with the
`latin`, `latin-ext`, `cyrillic`, `greek` and `vietnamese` subsets; other scripts use the system font.

## Website files

| File (`apps/site/public/`)     | Size       | Notes                                                                      |
| ------------------------------ | ---------- | -------------------------------------------------------------------------- |
| `favicon.svg`                  | vector     | The icon as is; also the icon in the site header                           |
| `favicon.ico`                  | 16, 32     | Fallback for old browsers                                                  |
| `apple-touch-icon.png`         | 180 × 180  | iOS rounds the corners                                                     |
| `icon-192.png`, `icon-512.png` | 192, 512   | For the web manifest                                                       |
| `og.png`                       | 1200 × 630 | Icon, «Karmanto» (Noto Sans 700), the tagline (500), one for all languages |

The PNGs and `.ico` were rendered from `karmanto-icon.svg` (ImageMagick for the icons, Playwright with Noto Sans for
`og.png`). When the icon changes, regenerate all of them.
