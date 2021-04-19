import React, { useCallback, useState } from 'react';

import { PriceSlider, PriceState } from './price-slider.component';
import { FilterContainer, TextContainer, StyledText } from './styled/price-slider.styled';

export type PriceFilterProps = PriceState & {
    onValueRelease: (data: PriceState) => void;
    lowValue?: number;
    highValue?: number;
};

export const PriceFilter: React.FC<PriceFilterProps> = (props: PriceFilterProps) => {
    const [maximum, setMaximum] = useState<number>(props.highValue ? props.highValue : props.maximum);
    const [minimum, setMinimum] = useState<number>(props.lowValue ? props.lowValue : props.minimum);

    const handleValueChange = useCallback((data: PriceState) => {
        setMinimum(data.minimum);
        setMaximum(data.maximum);
    }, []);

    return (
        <FilterContainer>
            <TextContainer>
                <StyledText>Minimum</StyledText>
                <StyledText>Maximum</StyledText>
            </TextContainer>
            <TextContainer setMargin>
                <StyledText>£{minimum}</StyledText>
                <StyledText>£{maximum}</StyledText>
            </TextContainer>
            <PriceSlider
                {...props}
                onValueChange={handleValueChange}
            />
        </FilterContainer>
    )
}
