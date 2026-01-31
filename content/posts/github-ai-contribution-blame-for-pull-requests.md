+++
date = '2026-01-31T17:37:25+07:00'
draft = false 
title = 'Github Browser Plugin for Ai Contribution Blame in Pull Requests'
description = 'A discussion and proof-of-concept for annotating pull requests with human vs AI contribution data using Git notes and GitHub integrations.'
tags = ["ai-assisted-development", "open-source", "git", "code-review","browser plugin"]
+++

## Quickstart, TL;DR


<p align="center">
  <img src="/github-ai-contribution-blame-for-pull-requests/roboctocat.webp" alt="refined-github-with-ai-pr" title="robotic octocat" width="200">
</p>

- [x] Learn about and add [git-ai](https://github.com/git-ai-project/git-ai) to your tooling, (git cli and editor extensions)
- [x] Build, install and authenticate [refined-github-ai-pr](https://github.com/rbbydotdev/refined-github-with-ai-pr)
- [x] Push and pull request some Ai generated code via git to Github
- [x] Navigate to your PR in Github `https://github.com/<owner>/<repo>/pull/<PR ID>/changes`
- [x] Bask in the glory of ai annotations (scroll to the end ↓ for example screenshots)

## Identifying AI Contributions 


With the proliferation of effortless code‑generating tools like Claude Code, Codex, and Cursor, slop‑slung contributions are being doled out as outright spam in hopes of getting a name tacked onto popular open‑source projects. Most are well‑intentioned — it’s just that this workflow is entirely new, and the tools and norms haven’t been established yet. Some open‑source projects have publicly banned them (see: [zig](https://ziglang.org/code-of-conduct/), [tldr](https://github.com/tldraw/tldraw/issues/7695), [ghostty](https://github.com/ghostty-org/ghostty/blob/main/CONTRIBUTING.md#ai-usage)), going so far as to vet contributors into a select trusted group.

Oftentimes, depending on the preference of the team and project, less consequential and isolated code could warrant a 100% AI contribution. Non‑user‑facing tooling, a private beta feature, or a proof‑of‑concept immediately come to mind. The ability to retroactively see which parts of the codebase were AI contributions, especially in these use cases, could be very valuable. What was tabbed in by Cursor at 3am six months ago could be a part of today’s refactor.

Projects like Zig may _never_ allow ai contributions, and I am not here to argue that they should change this stance. But in other cases, where the reaction is a heavy‑handed outright refusal, maintainers and developers could have a change of heart if they could codify an allowable percentage done by AI in each pull request. Even without a hard‑and‑fast rule, a percentage could serve as a sort of gut check — an overall score as part of a bigger picture of quality in a PR.

## Enter the Git-Ai Project

<p align="center">
  <a href="https://github.com/git-ai-project/git-ai">
    <img src="https://github.com/acunniffe/git-ai/raw/main/assets/docs/supported-agents.png" alt="git ai open graph image" width="300" title="git ai">
  </a>
</p>

The git-ai project allows you to _automatically_ track agentic ai code contributions across your team and codebase, zeroing in line-by-line, preserving code-generating prompts, all while working within common git workflows. Git-ai works by extending and enhancing your current tooling without slowdown (thanks to Rust) while 'staying out of the way' - so you can work as if it's not even there. 

git-ai stores things like per-line ai contributions, the model and prompt given for the code generated.

git-ai works by storing this ai contribution data in git notes. Git notes are simply blobs attached to commit refs. It's eloquent in that the meta data _stays with the commit_, git-ai also contains additional instrumentation to "survive a `merge --squash`, `rebase`, `reset`, `cherry-pick` etc."


**From the [README.md](https://github.com/git-ai-project/git-ai/edit/main/README.md):**

> ### Goals of `git-ai` project
>
> 🤖 **Track AI code in a Multi-Agent** world. Because developers get to choose their tools, engineering teams need a **vendor agnostic** way to track AI impact in their repos.
>
> 🎯 **Accurate attribution** from Laptop → Pull Request → Merged. Claude Code, Cursor and Copilot cannot track code after generation—Git AI follows it through the entire workflow.
>
> 🔄 **Support real-world git workflows** by making sure AI-Authorship annotations survive a `merge --squash`, `rebase`, `reset`, `cherry-pick` etc.
>
> 🔗 **Maintain link between prompts and code** - there is valuable context and requirements in team prompts—preserve them alongside code.
>
> 🚀 **Git-native + Fast** - `git-ai` is built on git plumbing commands. Negligible impact even in large repos (&lt;100ms). Tested in [Chromium](https://github.com/chromium/chromium).

**NOTE**: I have no affiliation with git-ai, but happily applaud their efforts, go check em' out! [github.com/git-ai-project/git-ai](https://github.com/git-ai-project/git-ai)

## Github PR interface Support

To experimentally work towards a developer friendly solution, I wanted to try dropping this tooling into a common point of convergence within collaborative version control workflows; _Github Pull Requests_

git-ai comes with many integrations, and even has an [RFC v3.0](https://github.com/git-ai-project/git-ai/blob/main/specs/git_ai_standard_v3.0.0.md), so other tooling providers may implement it themselves. The vscode integration works very well. AI contributed code is given a gutter highlight, and upon hover shows the model responsible for said ai generated code.

<img src="/github-ai-contribution-blame-for-pull-requests/git-ai-vscode.webp" alt="git ai vscode" title="git ai vscode" width="800">


To recreate this editor/code-view highlighting, as well as provide human-vs-ai percentage metering in the Github PR experience, I forked an existing github extended plugin [github-refined](https://github.com/refined-github/refined-github) into [refined-github-ai-pr](https://github.com/rbbydotdev/refined-github-with-ai-pr) This plugin has all the features of the prior, even allowing you to toggle this ai contribution blaming feature on and off in the options (_Be sure to check out the screenshots below_)

### More on Git-Ai Tooling...

Although there is currently no official support from git-ai (as of Jan 2026) for extending the Github PR interface with Git-ai annotations. There is an [early access feature: **Stat Bot**](https://github.com/git-ai-project/git-ai?tab=readme-ov-file#installing-the-stats-bot-early-access) - to "Aggregate git-ai data at the PR, developer, repository and organization levels" It may be worth it for you to check out and could serve as an excellent way to support the creators of git-ai


### Caveats

One **Major Caveat** with `refined-github-with-ai-pr`, is that it relies on augmenting Github's HTML via classes, which could very well change without notice, breaking this plugin. 

This plugin serves as a beta and prototype, to fuel the conversation of what working with these new tools might look like; _and I encourage community members to join the conversation._ Maybe github will work towards adding this themselves in the future. Please comment on this post in hackernews or open an issue for [refined-github-ai-pr](https://github.com/rbbydotdev/refined-github-with-ai-pr/issues) I'd love to hear what you're thinking!

## Screenshots

### Refined Github With Ai Plugin:

<img src="/github-ai-contribution-blame-for-pull-requests/light-scrn.webp" alt="light mode screenshot" title="light mode screenshot" width="800">

<img src="/github-ai-contribution-blame-for-pull-requests/dark-scrn.webp" alt="dark mode screenshot" title="dark mode screenshot" width="800">
