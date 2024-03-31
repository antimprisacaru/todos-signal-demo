import { graphql } from 'msw';
import { inject } from '@angular/core';
import { API_URL_TOKEN } from './api-url-token.provider';
import { createInjectable } from 'ngxtension/create-injectable';

export const ApiMockHandler = createInjectable(() => graphql.link(inject(API_URL_TOKEN)), { providedIn: 'root' });
