# PaperQuik.com

This is the complete source for what is deployed at this domain. It generates SVG images for a page given some user selected characteristics (page size and format) and then you can print that to get the page you want.

## Development

`npm install` - Always do this after pulling down a new version of the source.

`npm run dev` - This runs esbuild to compile the JavaScript and generate a bundle.js file the page can load and a simple Node.js server which serves up the application.

If you want to do some component development with Storybook, you can run `npm run storybook` to fire that up.

## Links

![Docker Publish](https://github.com/JohnMunsch/PaperQuik.com/actions/workflows/docker-publish.yml/badge.svg)

## Packages

- [Lit](https://lit.dev)
- [page](https://github.com/visionmedia/page.js)
- [Bootstrap](https://getbootstrap.com)
