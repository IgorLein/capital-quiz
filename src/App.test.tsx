import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

import App from './App';
import * as api from './api/country';
import { ButtonStates } from './data/button';

// mocking the getRandomCountries API function
jest.mock('./api/country');

// mock of Country object
const mockCountries = [
    { code: 'USA', name: 'United States', capital: 'Washington, D.C.' },
    { code: 'CAN', name: 'Canada', capital: 'Ottawa' },
    { code: 'MEX', name: 'Mexico', capital: 'Mexico City' },
    { code: 'FRA', name: 'France', capital: 'Paris' },
    { code: 'GBR', name: 'United Kingdom', capital: 'London' },
];

const rgbColorsMap = {
  [ButtonStates.Initial]: 'rgb(176, 190, 197)',
  [ButtonStates.Clicked]: 'rgb(33, 150, 243)',
  [ButtonStates.Error]: 'rgb(244, 67, 54)',
};

describe('App Component', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch and display buttons for countries', async () => {
        // mock the implementation of getRandomCountries
        (api.getRandomCountries as jest.Mock).mockResolvedValue(mockCountries);

        render(<App />);

        // wait for buttons to be rendered
        const buttons = await screen.findAllByRole('button'); // Assuming buttons have role 'button'

        // check the number of buttons rendered (2 buttons for each country: country + capital)
        expect(buttons).toHaveLength(mockCountries.length * 2);

        // check for specific button texts
        expect(screen.getByText('United States')).toBeInTheDocument();
        expect(screen.getByText('Washington, D.C.')).toBeInTheDocument();
        expect(screen.getByText('Canada')).toBeInTheDocument();
        expect(screen.getByText('Ottawa')).toBeInTheDocument();
    });

    it('should display a congratulations message when all buttons are removed', async () => {
        (api.getRandomCountries as jest.Mock).mockResolvedValue(mockCountries);

        render(<App />);

        // simulate clicking buttons to match them
        let countryButton = await screen.findByText('United States');
        fireEvent.click(countryButton);

        let capitalButton = await screen.findByText('Washington, D.C.');
        fireEvent.click(capitalButton);

        countryButton = await screen.findByText('Canada');
        fireEvent.click(countryButton);

        capitalButton = await screen.findByText('Ottawa');
        fireEvent.click(capitalButton);

        countryButton = await screen.findByText('Mexico');
        fireEvent.click(countryButton);

        capitalButton = await screen.findByText('Mexico City');
        fireEvent.click(capitalButton);

        countryButton = await screen.findByText('France');
        fireEvent.click(countryButton);

        capitalButton = await screen.findByText('Paris');
        fireEvent.click(capitalButton);

        countryButton = await screen.findByText('United Kingdom');
        fireEvent.click(countryButton);

        capitalButton = await screen.findByText('London');
        fireEvent.click(capitalButton);

        // now, since they match, we should check if congratulations message shows up
        expect(await screen.findByText('Congratulations!')).toBeInTheDocument();
    });

    it('should display an error state when buttons do not match', async () => {
        (api.getRandomCountries as jest.Mock).mockResolvedValue(mockCountries);
        
        render(<App />);

        // check if the first country button is in the initial state
        const countryButton = await screen.findByText('United States');
        expect(window.getComputedStyle(countryButton).backgroundColor).toBe(rgbColorsMap[ButtonStates.Initial]);

        // click the first country button
        fireEvent.click(countryButton);
        expect(window.getComputedStyle(countryButton).backgroundColor).toBe(rgbColorsMap[ButtonStates.Clicked]);

        // check the capital button state
        const capitalButton = await screen.findByText('Ottawa'); // Not the capital of USA
        expect(window.getComputedStyle(capitalButton).backgroundColor).toBe(rgbColorsMap[ButtonStates.Initial]);

        // click a different capital button
        fireEvent.click(capitalButton);

        // verify error state
        expect(window.getComputedStyle(countryButton).backgroundColor).toBe(rgbColorsMap[ButtonStates.Error]);
        expect(window.getComputedStyle(capitalButton).backgroundColor).toBe(rgbColorsMap[ButtonStates.Error]);
        
        await new Promise(r => setTimeout(r, 4000)); // wait for the error delay

        // the United States button was clicked first so it should return back to the clicked state
        expect(window.getComputedStyle(countryButton).backgroundColor).toBe(rgbColorsMap[ButtonStates.Clicked]);
        // the second button (Ottawa) should be returned back to the initial state
        expect(window.getComputedStyle(capitalButton).backgroundColor).toBe(rgbColorsMap[ButtonStates.Initial]);
    });
});
