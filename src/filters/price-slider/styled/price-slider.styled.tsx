import React from 'react';
import { Animated } from 'react-native';
import styled from 'styled-components/native';

//`

export const SliderWrapper = styled.View`
    flex-direction: row;
    align-items: center;
    width: 100%;
    height: ${props => props.theme.priceSlider.minimum.diameter}px;
`;

export const RailWrapper = styled.View`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    flex-direction: row;
    align-items: center;
`;

export const TouchableController = styled.View`
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
`;

export const Rail = styled.View`
    flex: 1;
    height: ${props => props.theme.priceSlider.line.height}px;
    border-radius: ${props => props.theme.priceSlider.line.height / 2}px;
    background-color: ${props => props.theme.colours.shadow};
`;

export const SelectedRail = styled.View`
    height: ${props => props.theme.priceSlider.line.height}px;
    border-radius: ${props => props.theme.priceSlider.line.height / 2}px;
    background-color: ${props => props.theme.colours.primary};
`;

export const MinimumThumb = styled(Animated.View)`
    height: ${props => props.theme.priceSlider.minimum.diameter}px;
    width: ${props => props.theme.priceSlider.minimum.diameter}px;
    border-radius: ${props => props.theme.priceSlider.minimum.diameter / 2}px;
    background-color: ${props => props.theme.colours.primary};
    justify-content: center;
    align-items: center;
`;

export const MaximumThumb = styled(Animated.View)<{ isBorderVisible?: boolean }>`
    height: ${props => props.theme.priceSlider.maximum.diameter}px;
    width: ${props => props.theme.priceSlider.maximum.diameter}px;
    border-radius: ${props => props.theme.priceSlider.minimum.diameter / 2}px;
    background-color: ${props => props.theme.colours.primary};
    border-width: 1px;
    border-color: ${props => props.isBorderVisible ? props.theme.colours.shadow : props.theme.colours.primary};
    justify-content: center;
    align-items: center;
`;

const VerticalLine = styled.View`
    height: ${props => props.theme.priceSlider.verticalLines.height}px;
    width: ${props => props.theme.priceSlider.verticalLines.width}px;
    background-color: ${props => props.theme.colours.secondary};
`;

const LinesWrapper = styled.View`
    height: ${props => props.theme.priceSlider.verticalLines.height}px;
    width: ${props => props.theme.priceSlider.verticalLines.containerWidth}px;
    flex-direction: row;
    justify-content: space-between;
`;

export const VerticalLines: React.FC = () => (
    <LinesWrapper>
        <VerticalLine/>
        <VerticalLine/>
    </LinesWrapper>
);

export const FilterContainer = styled.View`
    width: ${props => props.theme.priceSlider.width};
    justify-content: center;
    align-items: center;
`;

export const TextContainer = styled.View<{ setMargin?: boolean }>`
    width: 100%;
    justify-content: space-between;
    align-items: center;
    flex-direction: row;
    margin-bottom: ${props => props.setMargin ? props.theme.priceSlider.textInfo.marginBottom : 0}px;
`;

export const StyledText = styled.Text`
    font-size: 14px;
    color: black;
    font-weight: 600;
`;
