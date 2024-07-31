import lodashModule from 'lodash'
import { getRandomCountries, ApiCountry } from '../country'; // Update import path as needed
import { Country } from '../../data/country';

global.fetch = jest.fn(); // Mock the fetch method

describe('country API module', () => {
    describe('getRandomCountries()', () => {
        beforeEach(() => {
            jest.spyOn(lodashModule, 'sampleSize').mockImplementation((array, n) => (array as any).slice(0, n));
        });

        afterEach(() => {
            jest.clearAllMocks(); // Clear mocks before each test
        });
    
        it('should fetch and return random countries', async () => {
            // Mock data to simulate API response
            const mockApiResponse: ApiCountry[] = [
                { cca3: 'USA', name: { common: 'United States' }, capital: ['Washington, D.C.'] },
                { cca3: 'CAN', name: { common: 'Canada' }, capital: ['Ottawa'] },
                { cca3: 'MEX', name: { common: 'Mexico' }, capital: ['Mexico City'] },
                { cca3: 'FRA', name: { common: 'France' }, capital: ['Paris'] },
                { cca3: 'GBR', name: { common: 'United Kingdom' }, capital: ['London'] },
                { cca3: 'DEU', name: { common: 'Germany' }, capital: ['Berlin'] },
            ];
    
            // Mocking Fetch response
            (fetch as jest.Mock).mockResolvedValueOnce({
                json: jest.fn().mockResolvedValueOnce(mockApiResponse),
            });
    
            // Execute the function
            const countries: Country[] = await getRandomCountries();
    
            // Assertions
            const expectedUrl = 'https://restcountries.com/v3.1/all?fields=cca3,name,capital';
            expect(fetch).toHaveBeenCalledWith(expectedUrl);

            expect(countries.length).toBe(5); // Ensure we get 5 random countries
            countries.forEach(country => {
                expect(country).toHaveProperty('code');
                expect(country).toHaveProperty('name');
                expect(country).toHaveProperty('capital');
            });
    
            // Ensure received countries are mapped correctly
            countries.forEach((country: Country, i) => {
                const apiCountry = mockApiResponse[i];
                const expectedCountry: Country = {
                    code: apiCountry.cca3,
                    name: apiCountry.name.common,
                    capital: apiCountry.capital[0],
                };
                expect(country).toEqual(expectedCountry);
            });
        });
    
        it('should throw an error if fetch fails', async () => {
            (fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed to fetch'));
    
            await expect(getRandomCountries()).rejects.toThrow('Failed to fetch');
        });
    });
});
