# Theme Switching

This blog has two themes available:
- **Tokyo Night** - Neon Tokyo colors (currently active)
- **Gruvbox** - Warm retro colors

Both support light and dark modes via the theme toggle button.

## How to Switch Themes

Hugo only includes CSS files with the `.css` extension from `assets/css/extended/`.

**To use Tokyo Night:**
```bash
mv assets/css/extended/gruvbox.css assets/css/extended/gruvbox.css.disabled
mv assets/css/extended/tokyonight.css.disabled assets/css/extended/tokyonight.css
hugo server -D
```

**To use Gruvbox:**
```bash
mv assets/css/extended/tokyonight.css assets/css/extended/tokyonight.css.disabled
mv assets/css/extended/gruvbox.css.disabled assets/css/extended/gruvbox.css
hugo server -D
```

That's it! No scripts, no plugins. Just Hugo.

## Current Status

Check which theme is active:
```bash
ls assets/css/extended/*.css
```

If you see `tokyonight.css`, Tokyo Night is active.
If you see `gruvbox.css`, Gruvbox is active.

## Both Themes Feature

- ✅ Light/Dark mode toggle (native PaperMod)
- ✅ Colored headings (h1-h6 each have unique colors)
- ✅ Colored code blocks, links, and UI elements
- ✅ IBM Plex Mono monospace font
- ✅ Proper light mode (white-ish background, dark text)
