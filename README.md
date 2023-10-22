# PaperQuik.com

https://github.com/JohnMunsch/PaperQuik.com

This project is the complete source for what is deployed at PaperQuik.com. It generates SVG images for a page given some user selected characteristics (page size and format) and then you can print that to get the page you want.

## Development

I switched this project to Vite in version 2.1. Thus the commands for development, building, etc. are the standard ones for Vite.

- `npm install` - Always do this after pulling down a new version of the source.

- `npm run dev` - Run this to do development work. It will tell you the URL to use to access the site.
- `npm run build` - Run this to build the release version of the site.
- `npm run preview` - This serves up the release version after you've built it using the previous command.
- `npm run storybook` - Fires up Storybook with stories for the various components.

## Links

![Docker Publish](https://github.com/JohnMunsch/PaperQuik.com/actions/workflows/docker-publish.yml/badge.svg)

## Packages

### Client-Side

- https://vitejs.dev
- [Lit](https://lit.dev)
- [page](https://github.com/visionmedia/page.js) - Needs to be swapped out for Vaadin Router or something more current.
- [Bootstrap](https://getbootstrap.com)

### Server-Side

- https://expressjs.com
- https://github.com/expressjs/compression
