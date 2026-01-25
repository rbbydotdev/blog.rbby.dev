# Theme Switching

This blog has three themes available:
- **Gruvbox** - Warm retro colors (currently active)
- **Tokyo Night** - Neon Tokyo colors (vibrant)
- **Tokyo Night Soft** - Softer, pastel Tokyo Night colors

All themes support light and dark modes via the theme toggle button.

## How to Switch Themes

Hugo only includes CSS files with the `.css` extension from `assets/css/extended/`.

**To use Gruvbox (currently active):**
```bash
# Already active - no changes needed
hugo server -D
```

**To use Tokyo Night (vibrant):**
```bash
mv assets/css/extended/gruvbox.css assets/css/extended/gruvbox.css.disabled
mv assets/css/extended/tokyonight.css.disabled assets/css/extended/tokyonight.css
hugo server -D
```

**To use Tokyo Night Soft (pastel):**
```bash
mv assets/css/extended/gruvbox.css assets/css/extended/gruvbox.css.disabled
mv assets/css/extended/tokyonight-soft.css.disabled assets/css/extended/tokyonight-soft.css
hugo server -D
```

That's it! No scripts, no plugins. Just Hugo.

## Current Status

Check which theme is active:
```bash
ls assets/css/extended/*.css
```

Active theme is the one **without** `.disabled` extension:
- `gruvbox.css` = Gruvbox (warm retro)
- `tokyonight.css` = Tokyo Night (vibrant neon)
- `tokyonight-soft.css` = Tokyo Night Soft (pastel)

## All Themes Feature

- ✅ Light/Dark mode toggle (native PaperMod)
- ✅ Colored headings (h1-h6 each have unique colors)
- ✅ Colored code blocks, links, and UI elements
- ✅ IBM Plex Mono monospace font
- ✅ Proper light mode (white background, dark text)

## Theme Comparison

**Gruvbox** - Warm, retro palette
- Colors: Earthy oranges, yellows, browns
- Feel: Cozy, vintage, easy on the eyes
- Best for: Long reading sessions, retro aesthetic fans

**Tokyo Night** - Vibrant neon palette
- Colors: Bright blues, purples, cyans
- Feel: Modern, energetic, high contrast
- Best for: When you want vibrant, eye-catching colors

**Tokyo Night Soft** - Pastel palette
- Colors: Desaturated blues, purples, cyans (softer than original)
- Feel: Gentle, calm, similar softness to Gruvbox but with Tokyo Night hues
- Best for: Tokyo Night aesthetic but easier on the eyes
