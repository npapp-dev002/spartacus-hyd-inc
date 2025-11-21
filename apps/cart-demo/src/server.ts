import { APP_BASE_HREF } from '@angular/common';
import {
  NgExpressEngineDecorator,
  defaultExpressErrorHandlers,
  ngExpressEngine as engine,
} from '@spartacus/setup/ssr';
import express from 'express';
import { readFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import bootstrap from './main.server';

const ngExpressEngine = NgExpressEngineDecorator.get(engine, {
  ssrFeatureToggles: {
    limitCacheByMemory: true,
  },
  timeout: 29000,
  concurrency: 100
});

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  const server = express();
  const serverDistFolder = dirname(fileURLToPath(import.meta.url));
  const browserDistFolder = resolve(serverDistFolder, '../browser');
  const indexHtml = join(serverDistFolder, 'index.server.html');
  const indexHtmlContent = readFileSync(indexHtml, 'utf-8');

  process.env['SERVER_REQUEST_ORIGIN'] = 'http://localhost:4200';
  server.set('trust proxy', 'loopback');

  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: bootstrap,
    })
  );

  server.set('view engine', 'html');
  server.set('views', browserDistFolder);

  server.get('/.well-known/appspecific/com.chrome.devtools.json', (req, res) => {
    res.status(404).send();
  });

  // Serve static files from /browser
  server.get(
    '*.*',
    express.static(browserDistFolder, {
      maxAge: '1y',
    })
  );


  // All regular routes use the Universal engine
  server.get('*', (req, res) => {
    res.render(indexHtml, {
      req,
      providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
    });
  });

  server.use(defaultExpressErrorHandlers(indexHtmlContent))

  return server;
}

function run() {
  const port = process.env['PORT'] || 4000;

  // Start up the Node server
  const server = app();
  server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}

run();

