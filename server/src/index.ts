import { serve } from '@hono/node-server';
import { compress } from 'hono/compress';
import { Hono } from 'hono';
import { serveStatic } from '@hono/node-server/serve-static';

const app = new Hono();
const port = 6080;

app.use(compress());

// Serve static files from the public directory. This takes care of the UI.
app.use('/*', serveStatic({ root: './public' }));

// Finally, if we didn't find a route, we'll serve the index.html file.
// This is useful for single-page applications (SPAs) that use client-side routing.
app.use('/*', serveStatic({ path: './public/index.html' }));

serve(
  {
    fetch: app.fetch,
    port,
  },
  (info) => {
    console.log(`Server is running on http://localhost:${info.port}`);
  }
);
