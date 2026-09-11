---
name: nextjs-toploader-navigation
description: Use nextjs-toploader's router for manual client-side navigation in this Next.js project.
---

# Next.js Toploader Navigation

Use this skill when adding or changing manual client-side navigation with `useRouter`, such as after a successful form submission or an explicit user action.

Import the router from `nextjs-toploader/app` so navigation activates the shared route-progress indicator:

```ts
import { useRouter } from 'nextjs-toploader/app';
```

Do not import `useRouter` from `next/navigation` in these cases. Continue to use `next/navigation` APIs that are unrelated to manual router navigation, including `redirect`, `notFound`, `usePathname`, and `useSearchParams`.

Keep navigation ownership in the existing client orchestration layer; this skill does not authorize moving Server Component or Server Action navigation into the client.
