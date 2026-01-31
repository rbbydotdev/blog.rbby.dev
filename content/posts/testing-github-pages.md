+++
date = '2026-01-30T06:40:00+07:00'
draft = false
title = 'Testing GitHub Pages Deployment'
description = 'Verifying the GitHub Pages deployment with automated builds using Hugo and GitHub Actions for continuous deployment.'
tags = ['meta', 'deployment']
+++

This is a test post to verify that the GitHub Pages deployment is working correctly!

## Deployment Setup

We just configured:
- GitHub Actions workflow for automated builds
- Hugo extended version 0.146.0
- Custom domain at blog.rbby.dev
- Automatic deployment on push to master

## How It Works

Every time code is pushed to the master branch:

1. GitHub Actions triggers the workflow
2. Hugo builds the static site
3. The built site is deployed to GitHub Pages
4. Changes go live automatically

Pretty cool!

## Next Steps

Now that the deployment pipeline is working, we can:
- Write more posts
- Customize the theme
- Add more features

The site should update automatically with each push.
