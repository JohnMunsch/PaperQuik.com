# PaperQuik.com

This project is the complete source for what is deployed at [PaperQuik.com](https://PaperQuik.com). It generates SVG images for a page given some user selected characteristics (page size and format) and then you can print that to get the page you want.

Information about building and running is largely contained in the AGENTS.md so I don't have to repeat it multiple places and potentially have it get out-of-sync.

## TODOs

- Refactor to code which generates both the SVG thumbnails and the full size pages (including multiple book pages on a single piece of paper for print purposes).
- Add rendering for a month calendar block and for a single page year calendar.
- Switch to Redux for the book details.

## Ops

Deployment is automatic via Dokploy now. Whenever there is a new push to the main branch on GitHub, Dokploy will build and deploy that new version.

Whenever there is a new pull request (PR) Dokploy is configured to build and deploy that to a test URL so you can see it in action before merging it.

## Links

- [GitHub repo](https://github.com/JohnMunsch/PaperQuik.com)
- [PaperQuik.com Dokploy](https://dokploy.johnmunsch.com)
