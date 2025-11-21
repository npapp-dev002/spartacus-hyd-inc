import { ApplicationConfig, mergeApplicationConfig } from '@angular/core';
import { provideServerRendering } from '@angular/platform-server';
import { provideServer } from '@spartacus/setup/ssr';
import { appConfig } from './app.config';

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    ...provideServer({
      serverRequestOrigin: 'http://localhost:4200',
    }),
  ],
};

export const config = mergeApplicationConfig(appConfig, serverConfig);
