# rbby.dev Blog

A clean, minimal Hugo blog with PaperMod theme and Gruvbox colors.

## Setup

This blog uses:
- **Hugo** - Static site generator
- **PaperMod** - Clean, fast Hugo theme
- **Tokyo Night** - Beautiful color scheme celebrating Tokyo's neon nights (light & dark modes)
- **IBM Plex Mono** - Monospace font throughout

## Structure

```
newblog.rbby.dev/
├── hugo.toml                    # Hugo configuration
├── content/
│   └── posts/                   # Blog posts go here
├── assets/
│   └── css/
│       └── extended/
│           └── gruvbox.css      # Custom Gruvbox styling
└── themes/
    └── PaperMod/                # Theme (git submodule)
```

## Development

Start the development server:

```bash
hugo server -D
```

Visit http://localhost:1313

## Creating Posts

```bash
hugo new posts/my-post-name.md
```

Edit the post in `content/posts/my-post-name.md` and set `draft = false` when ready.

## Build for Production

```bash
hugo
```

Output will be in `public/` directory.

## Customization

### Colors

Edit `assets/css/extended/gruvbox.css` to customize colors.

### Config

Edit `hugo.toml` to change site settings, menu items, social links, etc.

## Features

### Light/Dark Mode Toggle

Click the sun/moon icon in the header to switch between light and dark Tokyo Night themes. The selection is saved to your browser's localStorage.

**Colors:**
- **Dark Mode**: Deep blues and purples with neon accents
- **Light Mode**: Clean, bright variant with the same accent colors

## Clean & Simple

This setup is intentionally minimal:
- Native PaperMod theme toggle (no custom JavaScript)
- Gruvbox colors for both light and dark modes
- No complex features
- Just a blog that works
