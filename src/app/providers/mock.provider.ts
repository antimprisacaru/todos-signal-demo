import { setupWorker } from 'msw/browser';
import {
  APP_INITIALIZER,
  EnvironmentInjector,
  EnvironmentProviders,
  isDevMode,
  makeEnvironmentProviders,
} from '@angular/core';
import { initMockHandlers } from '../mocks';

function mockFactory(injector: EnvironmentInjector) {
  return () => {
    const initializedHandlers = initMockHandlers(injector);
    const worker = setupWorker(...initializedHandlers);
    return worker.start({ onUnhandledRequest: 'bypass' });
  };
}

export function provideMocks(shouldProvide = isDevMode()): EnvironmentProviders {
  return makeEnvironmentProviders(
    shouldProvide
      ? [
          {
            provide: APP_INITIALIZER,
            useFactory: mockFactory,
            multi: true,
            deps: [EnvironmentInjector],
          },
        ]
      : []
  );
}
