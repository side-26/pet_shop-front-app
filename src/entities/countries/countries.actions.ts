'use server';

import { getCountries } from './countries.service';

export async function getCountriesAction() {
  return getCountries();
}
