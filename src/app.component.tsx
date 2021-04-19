import React, { useCallback, useMemo } from 'react';
import { ThemeProvider } from 'styled-components/native';

import { PriceState } from './filters/price-slider/price-slider.component';
import { Container } from './styled/app.styled';
import { defaultTheme } from './styled/theme';
import { PriceFilter } from "./filters/price-slider";

export const App: React.FC = () => {
    const minimumValue = useMemo(() => 0, []);
    const maximumValue = useMemo(() => 100, []);

    const handleValueRelease = useCallback((data: PriceState) => {
        console.log('DISPATCHING', data);
    }, []);

    return (
        <ThemeProvider theme={defaultTheme}>
            <Container>
                <PriceFilter
                    minimum={minimumValue}
                    maximum={maximumValue}
                    onValueRelease={handleValueRelease}
                />
            </Container>
        </ThemeProvider>
    )
};
