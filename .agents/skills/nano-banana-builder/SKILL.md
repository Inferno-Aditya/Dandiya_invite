---
name: nano-banana-builder
description: Builds complete, production-grade web projects, invitations, and applications where 100% of the visual assets are custom-generated using Google's latest Nano Banana image generation model (via the image-generator subagent). Enforces strict theme consistency, custom asset generation workflows, zero external placeholder dependencies, zero native unicode emojis, and cohesive art direction matching the project's domain.
---

# Nano Banana Theme Project Builder

Builds complete, visually breathtaking web projects, landing pages, interactive invitations, and digital experiences where **all visual assets are generated exclusively by Google's latest Nano Banana image generation model** (via the `image-generator` subagent).

---

## Core Directives

> [!IMPORTANT]
> **1. Zero Stock, Zero External Image URLs, Zero Generic Placeholders.**
> - Every photo, illustration, hero backdrop, card graphic, texture, banner, badge, and decorative motif MUST be generated using Google's latest Nano Banana image generation model via the `image-generator` subagent.
> - Never rely on Unsplash, Pexels, placehold.co, or generic external image links.
> - Every asset must strictly match the project's unique thematic identity, color scheme, and cultural or architectural vibe.

> [!WARNING]
> **2. Strict Zero Native Unicode Emoji Policy.**
> - **DO NOT USE NATIVE UNICODE EMOJIS** (e.g., 💃, 🎉, ✨, 🥺, ❤️, 🐱). Native emojis look inconsistent across operating systems and dilute the custom, premium art direction.
> - If an "emoji" or icon is needed:
>   - Use **clean, handcrafted inline SVGs** styled with the project's theme palette.
>   - OR generate **custom 3D / illustrated themed icon badges** using Nano Banana (`image-generator`).

---

## 1. Operating Principles

1. **Theme-First Synthesis**:
   Before generating any asset or writing UI code, define the **Thematic Style Guide**:
   - **Primary & Secondary Palette**: Hex codes, gradients, accents.
   - **Atmospheric Lighting**: Golden hour, cinematic night glow, studio softbox, neon cyberpunk, etc.
   - **Artistic Rendering Style**: Editorial 3D, photorealistic, festive cultural illustration, gouache, or minimalist render.
   - **Consistent Anchor Descriptors**: Repeat 3-4 style tokens across all image prompts to ensure uniform art direction.

2. **Asset Manifest Planning**:
   Determine the exact inventory of required assets:
   - **Hero Visual / Character States**: Dynamic emotional expressions (idle/peeking, happy, sad, crying, celebrating).
   - **Atmospheric Texture / Patterns**: Subtle seamless background or border motifs.
   - **Custom Vector Icons / Badges**: Inline SVGs instead of native emojis.
   - **Interactive Elements**: Ticket/Pass artwork, countdown backdrop, or modal illustration.

3. **Nano Banana Prompt Crafting Formula**:
   Structure every image prompt with deliberate intent:
   ```text
   [Subject & Scene Action], [Thematic & Cultural Context], [Environment, Lighting & Ambiance], [Art Style & Medium], [Color Palette Tokens], [Camera / Angle / Framing], [Quality & Detail Modifiers: ultra-detailed, 4k, crisp clean composition]
   ```

4. **Dedicated Subagent Delegation**:
   Invoke the `image-generator` subagent via `invoke_subagent` to produce each asset, saving clean local copies in the project's `./assets/` directory.

5. **Integrated Web Implementation**:
   - Modern, responsive, semantic HTML5, CSS3, and JavaScript (or framework).
   - Zero-config Vercel/Netlify deployment ready (`vercel.json` included).
   - Interactive features: URL query parameter personalization (`?to=...&from=...`), evasive buttons, exit-intent detection, Web Audio API sound synthesis.

---

## 2. Quality Checklist

- [ ] All visual assets are generated via Nano Banana (`image-generator`), no external image links.
- [ ] Zero native Unicode emojis used anywhere in the codebase.
- [ ] Visual style is unified across all assets (same lighting, character continuity, and art direction).
- [ ] Assets are saved in a clean, organized `assets/` directory within the project.
- [ ] High responsiveness across mobile, tablet, and desktop viewports.
- [ ] Tested and ready for 1-click Vercel deployment.
