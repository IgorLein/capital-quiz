import _ from 'lodash';
import { Country } from './country';

export interface ButtonData {
    code: string;
    name: string;
}

const createCountryAndCapitalBtn = (country: Country): [ButtonData, ButtonData] => {
    return [
        {
            code: country.code,
            name: country.name,
        },
        {
            code: `${country.code}_capital`,
            name: country.capital,
        },
    ];
}

export const prepareButtonsAndRelations = (
    countries: Country[]
): {
    buttons: ButtonData[];
    relations: WeakMap<ButtonData, ButtonData>;
} => {
    const buttons: ButtonData[] = [];
    const relations = new WeakMap<ButtonData, ButtonData>();

    countries.forEach((country: Country) => {
        const [countryBtn, capitalBtn] = createCountryAndCapitalBtn(country);
        buttons.push(countryBtn);
        buttons.push(capitalBtn);

        // create relations
        relations.set(countryBtn, capitalBtn);
        relations.set(capitalBtn, countryBtn);
    });

    const shuffledButtons = _.shuffle(buttons);

    return {
        buttons: shuffledButtons,
        relations,
    }
}
