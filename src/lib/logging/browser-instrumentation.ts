'use client';

import { noteClientInteraction, reportClientError } from './client-reporter';

let initialized = false;

export function initializeBrowserInstrumentation(): void {
  if (initialized) return;
  initialized = true;

  try {
    window.addEventListener('pointerdown', () => noteClientInteraction('pointer'), {
      capture: true,
      passive: true,
    });
    window.addEventListener('keydown', () => noteClientInteraction('keyboard'), {
      capture: true,
      passive: true,
    });
    window.addEventListener('submit', () => noteClientInteraction('submit'), {
      capture: true,
      passive: true,
    });
    window.addEventListener('error', (event) => {
      if (!event.error) return;
      reportClientError(event.error, {
        component: 'global',
        errorType: 'unhandled_error',
      });
    });
    window.addEventListener('unhandledrejection', (event) => {
      reportClientError(event.reason, {
        component: 'global',
        errorType: 'unhandled_rejection',
      });
    });
  } catch {
    // Instrumentation must never prevent hydration.
  }
}
