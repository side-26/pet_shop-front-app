import { DirectionProvider } from '@base-ui/react/direction-provider';
import { mount, type MountOptions, type MountReturn } from 'cypress/react';
import {
  AppRouterContext,
  type AppRouterInstance,
} from 'next/dist/shared/lib/app-router-context.shared-runtime';

import '../../src/app/styles/tailwind.config.css';

const appRouter: AppRouterInstance = {
  back: () => window.history.back(),
  forward: () => window.history.forward(),
  refresh: () => undefined,
  push: (href) => window.history.pushState(null, '', href),
  replace: (href) => window.history.replaceState(null, '', href),
  prefetch: () => undefined,
  bfcacheId: 'cypress-component-test',
};

declare global {
  namespace Cypress {
    interface Chainable {
      mount(component: React.ReactNode, options?: MountOptions): Chainable<MountReturn>;
    }
  }
}

Cypress.Commands.add('mount', (component, options = {}) => {
  return mount(
    <AppRouterContext.Provider value={appRouter}>
      <div dir="rtl">
        <DirectionProvider direction="rtl">{component}</DirectionProvider>
      </div>
    </AppRouterContext.Provider>,
    options,
  );
});

Cypress.on('uncaught:exception', (error) => {
  if (error.message.includes('ResizeObserver loop completed with undelivered notifications')) {
    return false;
  }

  return true;
});
