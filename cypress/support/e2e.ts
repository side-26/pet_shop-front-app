// ResizeObserver can report this non-fatal browser notification while responsive
// layouts settle during navigation. Keep every other application error fatal.
Cypress.on('uncaught:exception', (error) => {
  if (error.message.includes('ResizeObserver loop completed with undelivered notifications')) {
    return false;
  }

  return true;
});
