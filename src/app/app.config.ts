import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { appRoutes } from './app.routes';
import { API_URL_TOKEN } from './providers/api-url-token.provider';
import { provideHttpClient } from '@angular/common/http';
import { provideApollo } from './providers/apollo.provider';
import { provideMocks } from './providers/mock.provider';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: API_URL_TOKEN,
      useValue: 'http://localhost:3000/graphql',
    },
    provideMocks(),
    provideHttpClient(),
    provideApollo(),
    provideRouter(appRoutes, withComponentInputBinding()), provideAnimationsAsync(),
  ],
};
