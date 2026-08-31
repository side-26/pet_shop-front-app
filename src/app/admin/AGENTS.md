# Admin route convention

All admin pages belong below `src/app/admin` and must resolve under `/admin/[page]`.
Add every new admin route to `src/configs/route.path.ts` and reference that canonical path
from navigation, redirects, and tests. Keep `page.tsx` focused on page composition; the
shared responsive navigation and header remain owned by the parent admin layout.

Use plural entity names for admin route directories and URL segments (for example,
`pet-types` rather than `pet-type`).

Route-local client controllers configure temporary admin header controls through
`useAdminLayoutContext().setHeaderActions(...)` and restore the layout default with
`resetHeaderActions` on unmount. `lastVisibleOrder` is inclusive; later actions appear in overflow.
Visible action order increases from left to right in the RTL header.
