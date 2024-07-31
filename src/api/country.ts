import _ from 'lodash';
import { Country } from '../data/country';

export interface ApiCountry {
    cca3: string;
    name: {
        common: string;
    };
    capital: string[];
}

const COUNTRIES_URL = 'https://restcountries.com/v3.1/all';
const RANDOM_COUNTRIES_COUNT = 5;

const convertFromApiCountry = (apiCountry: ApiCountry): Country => ({
    code: apiCountry.cca3,
    name: apiCountry.name.common,
    capital: apiCountry.capital[0],
});

export const getRandomCountries = async (): Promise<Country[]> => {
    const response = await fetch(`${COUNTRIES_URL}?fields=cca3,name,capital`);
    const apiCountries: ApiCountry[] = await response.json();
    const randomApiCountries: ApiCountry[] = _.sampleSize(apiCountries, RANDOM_COUNTRIES_COUNT);
    return randomApiCountries.map((apiCountry: ApiCountry) => convertFromApiCountry(apiCountry));
};
