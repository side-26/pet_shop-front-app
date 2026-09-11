'use server';

import { refresh } from 'next/cache';

import {
  invalidateAllLandingPetTypes,
  invalidateLandingHomeOffers,
  invalidateLandingPopularPets,
} from './landing.service';

/** Expires only the home pet-type collection, then requests updated route data. */
export async function retryAllLandingPetTypesAction() {
  invalidateAllLandingPetTypes();
  refresh();
}

export async function retryLandingHomeOffersAction() {
  invalidateLandingHomeOffers();
  refresh();
}

export async function retryLandingPopularPetsAction() {
  invalidateLandingPopularPets();
  refresh();
}
