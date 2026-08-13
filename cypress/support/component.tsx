import { DirectionProvider } from '@base-ui/react/direction-provider';
import { mount, type MountOptions, type MountReturn } from 'cypress/react';

import '../../src/app/styles/tailwind.config.css';

declare global {
  namespace Cypress {
    interface Chainable {
      mount(component: React.ReactNode, options?: MountOptions): Chainable<MountReturn>;
    }
  }
}

Cypress.Commands.add('mount', (component, options = {}) => {
  return mount(
    <div dir="rtl">
      <DirectionProvider direction="rtl">{component}</DirectionProvider>
    </div>,
    options,
  );
});
