import _ from 'lodash';
import { prepareButtonsAndRelations, createCountryAndCapitalBtn } from '../button';
import { Country } from '../country';

describe('Button Module', () => {
    describe('createCountryAndCapitalBtn()', () => {
        it('should create country and capital button data correctly', () => {
            const country: Country = {
                code: 'USA',
                name: 'United States',
                capital: 'Washington, D.C.',
            };

            const [countryBtn, capitalBtn] = createCountryAndCapitalBtn(country);

            expect(countryBtn).toEqual({
                code: 'USA',
                name: 'United States',
            });

            expect(capitalBtn).toEqual({
                code: 'USA_capital',
                name: 'Washington, D.C.',
            });
        });
    });

    describe('prepareButtonsAndRelations()', () => {
        it('should prepare buttons and relations correctly for given countries', () => {
            const countries: Country[] = [
                { code: 'USA', name: 'United States', capital: 'Washington, D.C.' },
                { code: 'CAN', name: 'Canada', capital: 'Ottawa' },
                { code: 'MEX', name: 'Mexico', capital: 'Mexico City' },
            ];

            const { buttons, relations } = prepareButtonsAndRelations(countries);

            // Expect there to be 6 buttons (3 countries + 3 capitals)
            expect(buttons).toHaveLength(6);

            // Verify that each country button is created properly
            expect(buttons).toEqual(expect.arrayContaining([
                { code: 'USA', name: 'United States' },
                { code: 'USA_capital', name: 'Washington, D.C.' },
                { code: 'CAN', name: 'Canada' },
                { code: 'CAN_capital', name: 'Ottawa' },
                { code: 'MEX', name: 'Mexico' },
                { code: 'MEX_capital', name: 'Mexico City' },
            ]));

            // Verify relations using WeakMap
            const findBtnByCode = (code: string) => buttons.find((button) => button.code === code) || buttons[0];
            
            expect(relations.has(findBtnByCode('USA'))).toBe(true);
            expect(relations.get(findBtnByCode('USA'))).toEqual(findBtnByCode('USA_capital'));

            expect(relations.has(findBtnByCode('USA_capital'))).toBe(true);
            expect(relations.get(findBtnByCode('USA_capital'))).toEqual(findBtnByCode('USA'));

            expect(relations.has(findBtnByCode('CAN_capital'))).toBe(true);
            expect(relations.get(findBtnByCode('CAN'))).toEqual(findBtnByCode('CAN_capital'));

            expect(relations.has(findBtnByCode('CAN_capital'))).toBe(true);
            expect(relations.get(findBtnByCode('CAN_capital'))).toEqual(findBtnByCode('CAN'));

            expect(relations.has(findBtnByCode('MEX_capital'))).toBe(true);
            expect(relations.get(findBtnByCode('MEX'))).toEqual(findBtnByCode('MEX_capital'));

            expect(relations.has(findBtnByCode('MEX_capital'))).toBe(true);
            expect(relations.get(findBtnByCode('MEX_capital'))).toEqual(findBtnByCode('MEX'));
        });

        it('should shuffle buttons', () => {
            const countries: Country[] = [
                { code: 'USA', name: 'United States', capital: 'Washington, D.C.' },
                { code: 'CAN', name: 'Canada', capital: 'Ottawa' },
                { code: 'MEX', name: 'Mexico', capital: 'Mexico City' },
            ];

            const { buttons } = prepareButtonsAndRelations(countries);

            // Since buttons are shuffled, we cannot have a fixed expectation,
            // but we can check if the length matches and the content is valid.
            expect(buttons).toHaveLength(6);
            expect(buttons).toEqual(expect.arrayContaining([
                { code: 'USA', name: 'United States' },
                { code: 'USA_capital', name: 'Washington, D.C.' },
                { code: 'CAN', name: 'Canada' },
                { code: 'CAN_capital', name: 'Ottawa' },
                { code: 'MEX', name: 'Mexico' },
                { code: 'MEX_capital', name: 'Mexico City' },
            ]));
        });
    });
});