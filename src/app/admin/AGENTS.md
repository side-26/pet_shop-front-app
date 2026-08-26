# Admin route convention

All admin pages belong below `src/app/admin` and must resolve under `/admin/[page]`.
Add every new admin route to `src/configs/route.path.ts` and reference that canonical path
from navigation, redirects, and tests. Keep `page.tsx` focused on page composition; the
shared responsive navigation and header remain owned by the parent admin layout.
