---
name: entity-service-action-workflow
description: Create, update, refactor, review, or delete API-backed entity services, Server Actions, client orchestration, DTOs, schemas, and related cache behavior in this Next.js project. Use for any entity flow or mutation; this skill owns the repository's EntityTag caching convention.
---

# Entity Service and Action Workflow

Keep entity work split across the established dependency flow:

```text
Component or Server Component -> client orchestration or Server Action -> entity service -> customFetcher
```

Use this skill together with `entity-layer-architecture`. When their generic cache guidance differs,
this skill owns the project-specific `EntityTag` convention.

## Inspect before editing

1. Read `AGENTS.md`, the complete affected entity, every caller, nearby tests,
   `src/lib/api/customFetcher.ts`, and `src/utils/entityCache.ts`.
2. Read the installed Next.js 16 guides for every cache, Server Action, redirect, or route API used.
3. Search for an existing DTO, schema, cache-key helper, service method, action, and client handler before
   adding another one. Preserve the entity's established filenames and exports.
4. Trace deletion and renaming through all imports, tests, action callers, and UI consumers. Do not leave
   dead layers or bypass the intended dependency direction.

## Layer ownership

- **DTO/schema:** Own wire contracts and validation. Validate all untrusted Server Action input and infer
  request types from schemas when practical.
- **Service:** Own endpoints, typed `customFetcher` calls, business outcomes, cached reads, and successful
  mutation invalidation. Keep it server-only and free of React, toast, navigation, and browser behavior.
- **Server Action:** Own the `'use server'` boundary, authorization and input validation, call service
  methods, and return only the minimal serializable result. Do not duplicate endpoint or cache logic.
- **Client layer:** Call Server Actions and own toast, field errors, pending UI orchestration, focus, and
  client navigation. Pass complete fetcher errors to `globalErrorHandler`.
- **Component:** Render and delegate. Do not call a service directly from a Client Component.

Server Components may call read services directly. Mutating services that use `EntityTag.invalidate*()`
must be invoked through a Server Action because `EntityTag` delegates to Next.js `updateTag()`.

## Required EntityTag cache convention

Create one module-level tag owner per entity service and reuse it for reads and mutations:

```ts
import { EntityTag } from '@/utils/entityCache';

const productCache = new EntityTag('products');
```

Do not scatter tag strings, construct a parallel cache-tag registry, instantiate the tag inside each
function, or call `cacheTag`/`updateTag` directly when `EntityTag` supports the scope.

### Cached reads

Cache only data reviewed as safe for the shared cache. Do not shared-cache authenticated or user-specific
data. Put `'use cache'` at the top of the cached service function and register tags before returning:

```ts
export async function getProducts(params: ProductListParams) {
  'use cache';

  productCache.registerList(createCacheKey(params));
  return customFetcher<ProductListDto, ProductListError>({
    url: '/products',
    query: params,
    cache: 'force-cache',
    next: { tags: [productCache.list] },
  });
}

export async function getProduct(id: string) {
  'use cache';

  productCache.registerDetail(id);
  return customFetcher<ProductDto, ProductError>({
    url: `/products/${id}`,
    cache: 'force-cache',
    next: { tags: [productCache.detail(id)] },
  });
}
```

Use a deterministic cache key derived only from request-driving inputs. Reuse an existing key helper; if
none exists, create an entity-owned pure helper that sorts object keys and preserves meaningful array
ordering. Never use random values, current time, locale-dependent formatting, or raw object coercion.

`registerList(queryKey)` tags the read with the entity, list, and query scope. `registerDetail(id)` tags
the read with the entity and detail scope. The broader tags intentionally allow a mutation to invalidate
all related query variants without knowing every query key.

### Mutations and invalidation

Call `customFetcher` first. Invalidate only when the mutation result is successful, then return the same
result contract:

```ts
export async function updateProduct(id: string, dto: UpdateProductDto) {
  const result = await customFetcher<ProductDto, UpdateProductError, UpdateProductDto>({
    url: `/products/${id}`,
    method: 'PATCH',
    body: dto,
    auth: true,
  });

  if (result.isSuccess) {
    productCache.invalidateDetail(id);
    productCache.invalidateList();
  }

  return result;
}
```

Choose the narrowest complete invalidation set:

- **Create:** invalidate the list. Invalidate all only if the mutation also changes unrelated detail data.
- **Update:** invalidate the changed detail and every affected list. Use `invalidateAll()` when impact is
  broad or affected identifiers cannot be determined safely.
- **Delete:** invalidate the deleted detail and affected lists.
- **Bulk/reorder/import:** invalidate known details plus the list, or use `invalidateAll()` when broad.
- **Failed mutation:** invalidate nothing.

Do not invalidate before the backend confirms success. Do not repeat invalidation in the Server Action or
client layer when the service owns it. If a mutation must run from a Route Handler, stop and reconcile the
design: Next.js does not allow `updateTag()` there, and the current `EntityTag` API has no
`revalidateTag(..., 'max')` operation.

## Actions and client use

Server Actions call service methods rather than `customFetcher`:

```ts
'use server';

export async function updateProductAction(input: unknown) {
  const { id, dto } = await updateProductSchema.validate(input);
  return updateProduct(id, dto);
}
```

The client layer calls the action, handles the returned success/error union, and owns user-visible effects.
Never import a server-only service into a Client Component or client module.

## Tests and completion

- Service tests mock `customFetcher` and `EntityTag` or `next/cache`; assert cached-read registration,
  success-only invalidation, all affected scopes, and no invalidation on backend/network failure.
- Action tests mock services and cover validation, authorization, arguments, and serialization. Do not
  duplicate service invalidation assertions in action tests.
- Client tests mock actions and cover success effects, complete error forwarding, pending behavior, and
  navigation when relevant.
- Add an adjacent-layer integration test only when it proves wiring that isolated tests cannot.

Before completion, run focused tests, typecheck, lint, applicable Cypress tests, and the production build.
Confirm cached reads are public/shared-safe, keys are deterministic, failed mutations preserve the cache,
and no service/action/client responsibility is duplicated.
