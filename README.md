<img width="2400" height="1260" alt="og-image" src="https://github.com/user-attachments/assets/8a953ad9-c7b7-497a-a91b-529e4ccd0ab8" />

# Instant Polaroid

Turn your photos into beautiful polaroid prints — instantly.

A simple, open-source one-page app built with Next.js that lets you upload or capture a photo and transforms it into a polaroid-framed image using the [Orshot API](https://orshot.com).

We use [this Orshot template](https://orshot.com/templates/shared/73du84kp/preview?view=play) for creating Polaroid effect on normal photos.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square) ![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?style=flat-square) ![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-ff69b4?style=flat-square)

## Features

- **Upload Photos** — Drag & drop or pick from your device
- **Camera Capture** — Take a photo directly from your browser
- **Preview Before Generating** — See your photo before turning it into a polaroid
- **Polaroid Framing** — Photos are transformed into polaroid-style prints via Orshot API
- **Custom Caption** — Add a caption to your polaroid with configurable text color
- **Background Color** — Choose from preset background colors or pick a custom one
- **Adaptive Layout** — Single-column form that morphs into a two-column layout once polaroids are generated
- **Inline Printing Animation** — Shimmer placeholder in the grid while your polaroid is being generated
- **Photo Grid** — All your polaroids are displayed in an animated, responsive grid
- **Lightbox** — Click any polaroid to view it full-size with download option
- **Download All as ZIP** — Download every generated polaroid in a single ZIP file
- **Decorative Polaroids** — Ambient polaroid frames on the edges of the screen for visual flair
- **Responsive** — Works on desktop, tablet, and mobile

## Tech Stack

- [Next.js 15](https://nextjs.org) — React framework (App Router + Turbopack)
- [Tailwind CSS 4](https://tailwindcss.com) — Utility-first CSS
- [Framer Motion 12](https://motion.dev) — Layout animations & transitions
- [JSZip](https://stuk.github.io/jszip/) — Client-side ZIP generation
- [Lucide Icons](https://lucide.dev) + [Phosphor Icons](https://phosphoricons.com) — Icons
- [Orshot API](https://orshot.com/docs/api-reference/render-from-studio-template) — Image generation

## Getting Started

### Prerequisites

- Node.js 18+
- [pnpm](https://pnpm.io) (or npm/yarn)
- An [Orshot](https://orshot.com) account with an API key and a Studio template

### Setup

1. **Clone the repository**

   ```bash
   git clone https://github.com/daskrad/instant-polaroid.git
   cd instant-polaroid
   ```

2. **Install dependencies**

   ```bash
   pnpm install
   ```

3. **Configure environment variables**

   ```bash
   cp .env.example .env
   ```

   Edit `.env` and add your Orshot API key and template ID:

   ```
   ORSHOT_API_KEY=your_api_key_here
   ORSHOT_TEMPLATE_ID=your_template_id_here
   ```

4. **Run the development server**

   ```bash
   pnpm dev
   ```

5. Open [http://localhost:3000](http://localhost:3000)

## How It Works

1. Upload or capture a photo — a preview appears in the upload zone
2. Optionally set a caption, text color, and background color
3. Click **Generate** to create your polaroid
4. The photo is sent to the Next.js API route (`/api/polaroid`), which calls [Orshot's Studio Render API](https://orshot.com/docs/api-reference/render-from-studio-template)
5. While generating, a shimmer placeholder appears in the grid
6. The finished polaroid drops into the grid with a smooth animation
7. Click any polaroid to open the lightbox, or download all as a ZIP

## Orshot Template Setup

You can clone the template from here: https://orshot.com/templates/shared/73du84kp/preview?view=play

The template should have:

- A parameterized image layer (e.g., `photo`) that accepts a dynamic image URL or base64
- A `caption` text layer for the polaroid caption
- A `caption.color` modification for caption text color
- A `canvasBackgroundColor` for the polaroid background

The API route sends these as `modifications` — update the keys to match your template's parameter IDs if different.

## Project Structure

```
instant-polaroid/
├── app/
│   ├── api/polaroid/route.js     # Orshot API proxy
│   ├── error.jsx                 # Error boundary
│   ├── globals.css               # Global styles
│   ├── layout.jsx                # Root layout + metadata
│   └── page.jsx                  # Main page (state + layout)
├── components/
│   ├── ui/
│   │   ├── button.jsx            # Button component
│   │   └── dialog.jsx            # Dialog/modal component
│   ├── camera-capture.jsx        # Camera capture modal
│   ├── decorative-polaroids.jsx  # Ambient polaroid frames
│   ├── header.jsx                # Page header
│   ├── photo-upload.jsx          # Upload, preview, caption & color controls
│   ├── polaroid-card.jsx         # Single polaroid card
│   └── polaroid-grid.jsx         # Grid, lightbox, download all
├── lib/
│   └── utils.js                  # Utility functions (cn)
└── public/
    └── robots.txt
```

## License

MIT

## Credits

Built with [Orshot](https://orshot.com) — Automated Image Generation API
