import { APOLLO_FLAGS, APOLLO_OPTIONS } from 'apollo-angular';
import { ApolloClientOptions, from, InMemoryCache } from '@apollo/client';
import { HttpLink } from 'apollo-angular/http';
import {
  EnvironmentProviders,
  inject,
  isDevMode,
  makeEnvironmentProviders,
} from '@angular/core';
import { setContext } from '@apollo/client/link/context';
import type { NormalizedCacheObject } from '@apollo/client/cache/inmemory/types';
import { API_URL_TOKEN } from './api-url-token.provider';

const basicContext = setContext((_, { headers }) => {
  return {
    headers: {
      ...headers,
      Accept: 'charset=utf-8',
      'Content-Type': 'application/json',
      // ...other necessary headers
    },
  };
});

const authLink = setContext(() => {
  const token = localStorage.getItem('token');

  if (token === null) {
    return {};
  } else {
    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  }
});

function createDefaultApollo(
  httpLink: HttpLink
): ApolloClientOptions<NormalizedCacheObject> {
  const cache = new InMemoryCache();

  // create http link based on our API URL Token
  const http = httpLink.create({
    uri: inject(API_URL_TOKEN),
  });

  return {
    connectToDevTools: isDevMode(),
    assumeImmutableResults: true,
    cache,
    link: from([basicContext, authLink, http]),
  };
}

export const provideApollo = (): EnvironmentProviders =>
  makeEnvironmentProviders([
    {
      provide: APOLLO_FLAGS,
      useValue: {
        useInitialLoading: true,
      },
    },
    {
      provide: APOLLO_OPTIONS,
      useFactory: createDefaultApollo,
      deps: [HttpLink],
    },
  ]);