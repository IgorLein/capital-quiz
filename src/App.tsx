import React, { useState, useEffect, useCallback } from 'react';
import { Container, Typography, Grid } from '@mui/material';

import { getRandomCountries } from './api/country';
import { Country } from './data/country';
import { ButtonStates, ButtonData, prepareButtonsAndRelations } from './data/button';
import CountryCapitalButton from './components/CountryCapitalButton';

const ERROR_DELAY = 3000;

function App() {
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const [buttons, setButtons] = useState<ButtonData[]>([]);
  const [relations, setRelations] = useState<WeakMap<ButtonData, ButtonData>>();
  const [clickedButtons, setClickedButtons] = useState<ButtonData[]>([]);
  const [isError, setIsError] = useState<boolean>(false);

  const fetchCountries = async () => {
    const countries: Country[] = await getRandomCountries();
    const { buttons, relations } = prepareButtonsAndRelations(countries);

    setButtons(buttons);
    setRelations(relations);
    setDataLoaded(true);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const getButtonState = useCallback((button: ButtonData) => {
    // if the error state is set and current button is in the clicked buttons list then it should turn red
    if (isError && clickedButtons.includes(button)) return ButtonStates.Error;

    // highlight clicked buttons
    if (clickedButtons.includes(button)) return ButtonStates.Clicked;

    // just return the initial state
    return ButtonStates.Initial;
  }, [clickedButtons, isError]);

  const handleClick = useCallback((newClickedButton: ButtonData) => {
    setClickedButtons((prevClickedButtons) => {
      // if no button is clicked
      if (!prevClickedButtons.length) return [newClickedButton];

      // just to make sure that we can't click more than 2 buttons
      if (prevClickedButtons.length === 2) return prevClickedButtons;

      const prevClickedButton = prevClickedButtons[0];

      // if we click the same button again we should unclick it
      if (prevClickedButton === newClickedButton) return [];

      // the first button has been clicked and we should check if the second button is related
      // if the clicked buttons are connected then we should do the following:
      // 1. filter buttons to exclude matched buttons
      // 2. clear the clickedButtons array
      if (relations?.get(prevClickedButton) === newClickedButton) {
        setButtons(buttons.filter(({ code }: ButtonData) => code !== prevClickedButton.code && code !== newClickedButton.code));
        return [];
      }

      // it means that clicked buttons are not matched then we should do the following:
      // 1. set the error state
      // 2. set the timeout with the delay
      // 3. set 2 clicked buttons which will be highlighted with the red color
      setIsError(true);
      setTimeout(() => {
        // once the time is up we should do the following:
        // 1. clear the error state
        // 2. set clicked buttons to the previous state
        setIsError(false);
        setClickedButtons([prevClickedButton]);
      }, ERROR_DELAY);

      return [prevClickedButton, newClickedButton];
    });
  }, [buttons, relations]);

  return (
    <Container style={{ marginTop: '20px', textAlign: 'center' }}>
      <Typography variant="h4" gutterBottom>
        Capital Quiz
      </Typography>
      <Grid container spacing={2} justifyContent="center">
        {buttons.map((data: ButtonData) => (
          <Grid item key={data.code}>
            <CountryCapitalButton
                disabled={isError}
                data={data}
                state={getButtonState(data)}
                onClick={handleClick}
            />
          </Grid>
        ))}
      </Grid>
      { dataLoaded && !buttons.length && (
        <Typography variant="h6" style={{ marginTop: '20px' }}>
          Congratulations!
        </Typography>
      ) }
    </Container>
  );
}

export default App;
