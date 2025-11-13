# PaperQuik.com Agent Instructions

This document provides instructions for AI agents working on the PaperQuik.com codebase.

## Project Overview

This is a monorepo containing the source code for PaperQuik.com:

- `src/`: A frontend web application built with Vite, Lit, and TypeScript. There is no back-end at this time.

## Development

All of these commands are run in the "ui" directory:

- `npm install` - Always do this after pulling down a new version of the source.

- `npm run dev` - Run this to do development work. It will tell you the URL to use to access the UI.
- `npm run build` - Always run this to make sure the code builds without TypeScript errors after making changes.
- `npm run test` - Always run the unit tests to make sure the code still passes after making changes.

- `npm run preview` - You will not need to run this while working on the site.
- `npm run storybook` - You will not need to run this while working on the site.
- `npm run build-storybook` - You will not need to run this while working on the site.

## Always use the technologies already in the application if possible

- Vite
- Lit + @lit-labs/router
- Redux Toolkit

## General Workflow

When you create feature branches, just name them "feat/[short name for feature/bug/chore/etc.]" for consistency.

1.  Identify whether your task relates to the `ui`, the `server`, or both.
2.  Navigate to the appropriate directory (`ui/` or `server/`).
3.  Ensure dependencies are installed before running any other commands.
4.  Use the specified commands for development, testing, and building.

## Instructions

### Adding a new page to the UI

1. Add a new something-page.component.ts which will display when the user visits the page (use Lit).
2. Import the new component into main.ts.
3. Add an entry into the router in main.ts to display the new page when the appropriate URL is hit.
4. If the page is only allowed for signed in users, be sure to put an "enter" on the route and make sure it calls protectedPage().
