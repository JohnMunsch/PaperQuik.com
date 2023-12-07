# PaperQuik.com

https://github.com/JohnMunsch/PaperQuik.com

This project is the complete source for what is deployed at [PaperQuik.com](https://PaperQuik.com). It generates SVG images for a page given some user selected characteristics (page size and format) and then you can print that to get the page you want.

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

- [Vite](https://vitejs.dev) - I used to use esbuild for all my building and it worked OK. Vite is equally easy to use, standardizes things more, and works well not just for development (where it still uses esbuild) but for production builds too.
- [Lit](https://lit.dev)
- [@lit-labs/router](https://www.npmjs.com/package/@lit-labs/router) - I know it's not "production ready" and I know that it requires a polyfill to be used on some browsers, but it's still better than "page" (which is what I used to use) and the poorly documented @vaadin/router. So if you know of something which works well with Lit that you can suggest instead then I'm more than happy to listen.
- [Bootstrap](https://getbootstrap.com)

### Server-Side

- https://expressjs.com
- https://github.com/expressjs/compression
