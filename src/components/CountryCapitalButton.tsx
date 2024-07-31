import React, { useCallback } from 'react';
import Button from '@mui/material/Button';

import { ButtonStates, ButtonData } from '../data/button';

const stateColorMapping: Record<ButtonStates, string> = {
    [ButtonStates.Initial]: '#B0BEC5',
    [ButtonStates.Clicked]: '#2196F3',
    [ButtonStates.Error]: '#F44336',
};

interface CountryCapitalButtonProps {
    disabled: boolean;
    data: ButtonData;
    state: ButtonStates;
    onClick: (data: ButtonData) => void;
}

const CountryCapitalButton = ({
    disabled,
    data,
    state,
    onClick,
}: CountryCapitalButtonProps) => {
    const handleClick = useCallback(() => {
        onClick(data);
    }, [data, onClick]);

    return (
        <Button variant="contained" style={{ backgroundColor: stateColorMapping[state] }} disabled={disabled} onClick={handleClick}>
            {data.name}
        </Button>
    )
};

export default CountryCapitalButton;
