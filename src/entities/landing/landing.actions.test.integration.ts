// @vitest-environment node

import { describe, expect, it, vi } from 'vitest';

import { retryAllLandingPetTypesAction } from './landing.actions';
import { invalidateAllLandingPetTypes } from './landing.service';

const { refreshMock } = vi.hoisted(() => ({ refreshMock: vi.fn() }));

vi.mock('next/cache', () => ({ refresh: refreshMock }));
vi.mock('./landing.service', () => ({ invalidateAllLandingPetTypes: vi.fn() }));

describe('retryAllLandingPetTypesAction', () => {
  it('expires only the landing pet-type cache before refreshing the client router', async () => {
    await retryAllLandingPetTypesAction();

    expect(invalidateAllLandingPetTypes).toHaveBeenCalledOnce();
    expect(refreshMock).toHaveBeenCalledOnce();
  });
});
