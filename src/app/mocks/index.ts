import mockTodos from './todos.mock';
import { EnvironmentInjector, runInInjectionContext } from '@angular/core';
import { RequestHandler } from 'msw';
import { flatMap } from 'lodash';

const mockHandlers = [mockTodos];

export function initMockHandlers(injector: EnvironmentInjector): Array<RequestHandler> {
  return flatMap(
    mockHandlers.map((fn) => runInInjectionContext(injector, () => fn()))
  );
}