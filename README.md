# PaperQuik.com

This project is the complete source for what is deployed at [PaperQuik.com](https://PaperQuik.com). It generates SVG images for a page given some user selected characteristics (page size and format) and then you can print that to get the page you want.

Information about building and running is largely contained in the AGENTS.md so I don't have to repeat it multiple places and potentially have it get out-of-sync.

## Using Jules as an AI Assistant

I still think the jury is out on most of the AI programming assistants; whether built in to your IDE or those which act separately from you on the same repo. However, I have managed to have some limited success with Google's Jules. It falls in the latter category and tries to be an assistant who handles tasks and creates branches and/or pull requests for them.

Locally it can be run like so:

- `npx @google/jules`

I also have my own repo hooked up to Jules on the web so I can start new sessions from there: https://jules.google.com/repo/github/JohnMunsch/PaperQuik.com/overview

You should absolutely temper your expectations about what Jules can do for you though. Anything complicated risks producing a PR which will not work. Note: One good thing about Dokploy though is that it will normally kick in on any PR created by Jules and deploy it to a temporary URL (you should see both the build and the URL appear in the PR). This will give you a way to see if it can even build successfully, deploy, and has any the requested changes.

## Ops

Deployment is automatic via Dokploy now. Whenever there is a new push to the main branch on GitHub, Dokploy will build and deploy that new version.

Whenever there is a new pull request (PR) Dokploy is configured to build and deploy that to a test URL so you can see it in action before merging it.

## Links

- [GitHub repo](https://github.com/JohnMunsch/PaperQuik.com)
- [PaperQuik.com Dokploy](https://dokploy.johnmunsch.com/dashboard/project/8tsAJInSOenk3HEWx-p75/environment/env_prod_8tsAJInSOenk3HEWx-p75_1759947079.935333/services/application/dK7hRyVgy7IM-QjGLseuV)
