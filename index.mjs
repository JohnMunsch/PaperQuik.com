import compression from 'compression';
import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
const port = 6080;

app.use(compression());
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.static(join(__dirname, 'dist')));

// Rather than delivering a 404, any unknown path delivers the index.html
// file. That works well with our single page app.
app.get('/*', (req, res) => {
  res.sendFile(__dirname + '/dist/index.html');
});

app.listen(port, () => console.log(`Listening on port ${port}!`));
