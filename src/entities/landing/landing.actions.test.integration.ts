// @vitest-environment node

import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  retryAllLandingPetTypesAction,
  retryLandingHomeOffersAction,
  retryLandingPopularPetsAction,
} from './landing.actions';
import {
  invalidateAllLandingPetTypes,
  invalidateLandingHomeOffers,
  invalidateLandingPopularPets,
} from './landing.service';

const { refreshMock } = vi.hoisted(() => ({ refreshMock: vi.fn() }));

vi.mock('next/cache', () => ({ refresh: refreshMock }));
vi.mock('./landing.service', () => ({
  invalidateAllLandingPetTypes: vi.fn(),
  invalidateLandingHomeOffers: vi.fn(),
  invalidateLandingPopularPets: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe('retryAllLandingPetTypesAction', () => {
  it('expires only the landing pet-type cache before refreshing the client router', async () => {
    await retryAllLandingPetTypesAction();

    expect(invalidateAllLandingPetTypes).toHaveBeenCalledOnce();
    expect(refreshMock).toHaveBeenCalledOnce();
  });

  it('refreshes only the cache scope requested by each landing retry action', async () => {
    await retryLandingHomeOffersAction();
    await retryLandingPopularPetsAction();

    expect(invalidateLandingHomeOffers).toHaveBeenCalledOnce();
    expect(invalidateLandingPopularPets).toHaveBeenCalledOnce();
    expect(refreshMock).toHaveBeenCalledTimes(2);
  });
});
