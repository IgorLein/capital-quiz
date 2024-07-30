import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';

import { getRandomCountries } from './api/country';
import { Country } from './data/country';
import { ButtonData, prepareButtonsAndRelations } from './data/button';

function App() {
  const [buttons, setButtons] = useState<ButtonData[]>([]);
  const [relations, setRelations] = useState<WeakMap<ButtonData, ButtonData>>();

  const fetchCountries = async () => {
    const countries: Country[] = await getRandomCountries();
    const { buttons, relations } = prepareButtonsAndRelations(countries);

    setButtons(buttons);
    setRelations(relations);
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  return (
    <div>
      Capital Quiz
      <div>
        {buttons.map(({ code, name }: ButtonData) => (
          <Button key={code} variant="contained" color="primary" onClick={() => alert("Button Clicked!")}>
            {name}
          </Button>
        ))}
      </div>
    </div>
  );
}

export default App;
