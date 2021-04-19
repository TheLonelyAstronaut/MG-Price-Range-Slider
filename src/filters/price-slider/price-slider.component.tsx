import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Animated, NativeTouchEvent, PanResponder, StyleProp, ViewStyle } from 'react-native';
import { useTheme } from 'styled-components/native';

import { useRange, useSelectedRail, useWidthLayout } from './hooks';
import { SliderWrapper, RailWrapper, TouchableController, Rail, SelectedRail, MinimumThumb, MaximumThumb, VerticalLines } from './styled/price-slider.styled';
import * as Utils from './utils';

export type PriceState = {
    minimum: number;
    maximum: number;
};

export type GestureState = {
    isLow: boolean;
    lastValue: number;
    lastPosition: number;
};

export type PriceSliderProps = PriceState & {
    onValueChange: (data: PriceState) => void;
    onValueRelease: (data: PriceState) => void;
    lowValue?: number;
    highValue?: number;
};

export const PriceSlider: React.FC<PriceSliderProps> = (props: PriceSliderProps) => {
    const truthy = useCallback(() => true, []);
    const [borderVisibility, setBorderVisibility] = useState<boolean>(false);
    const theme = useTheme();

    const {
        rangeRef,
        rangeValuesPrev,
        setLow,
        setHigh
    } = useRange(props.minimum, props.maximum, props.lowValue, props.highValue);

    const _lowThumbXRef = useRef(new Animated.Value(0));
    const _highThumbXRef = useRef(new Animated.Value(0));
    const _lowDiameter = useRef(new Animated.Value(theme.priceSlider.minimum.diameter));
    const _highDiameter = useRef(new Animated.Value(theme.priceSlider.maximum.diameter));

    const pointerX = useRef(new Animated.Value(0)).current;

    const { current: lowThumbX } = _lowThumbXRef;
    const { current: highThumbX } = _highThumbXRef;

    const _gestureStateRef = useRef<GestureState>({ isLow: true, lastValue: 0, lastPosition: 0 });

    const _containerWidthRef = useRef<number>(0);
    const lowThumbWidth = useMemo(() => theme.priceSlider.minimum.diameter, [theme]);
    const highThumbWidth = useMemo(() => theme.priceSlider.maximum.diameter, [theme]);

    const widthDelta = useMemo(() => (lowThumbWidth - highThumbWidth), [lowThumbWidth, highThumbWidth]);

    const lowStyles = useMemo(() => {
        return {
            height: _lowDiameter.current,
            width: _lowDiameter.current,
            backgroundColor: 'blue',
            borderRadius: Animated.divide(_lowDiameter.current, 2),
            transform: [{ translateX: lowThumbX }]
        };
    }, [lowThumbX]);

    const lowInternalStyles = useMemo(() => {
        return {
            height: _lowDiameter.current,
            width: _lowDiameter.current,
            borderRadius: Animated.divide(_lowDiameter.current, 2),
        };
    }, []);

    const highStyles = useMemo(() => {
        return {
            position: 'absolute',
            height: _highDiameter.current,
            width: _highDiameter.current,
            borderRadius: Animated.divide(_highDiameter.current, 2),
            transform: [{ translateX: highThumbX }]
        };
    }, [highThumbX]);

    const highInternalStyles = useMemo(() => {
        return {
            height: _highDiameter.current,
            width: _highDiameter.current,
            borderRadius: Animated.divide(_highDiameter.current, 2),
        };
    }, []);

    const {
        selectedRailStyle,
        updateSelectedRail
    } = useSelectedRail(rangeRef, _containerWidthRef, lowThumbWidth, highThumbWidth);

    const updateThumbs = useCallback(() => {
        const { current: containerWidth } = _containerWidthRef;

        if (!lowThumbWidth || !containerWidth || !highThumbWidth) {
            return;
        }

        const { low, high } = rangeRef.current;

        const { current: highThumbX } = _highThumbXRef;
        const highPosition =
            (high - props.minimum) /
            (props.maximum - props.minimum) * (containerWidth - highThumbWidth);
        highThumbX.setValue(highPosition);

        const { current: lowThumbX } = _lowThumbXRef;
        const lowPosition =
            (low - props.minimum) /
            (props.maximum - props.minimum) * (containerWidth - lowThumbWidth);
        lowThumbX.setValue(lowPosition);

        updateSelectedRail();
        props.onValueChange({
            minimum: low,
            maximum: high
        });
    }, [lowThumbWidth, highThumbWidth, rangeRef, props, updateSelectedRail]);

    useEffect(() => {
        const { low, high } = rangeValuesPrev;

        if ((props.lowValue !== undefined && props.lowValue !== low)
            || (props.highValue !== undefined && props.highValue !== high)) {
            updateThumbs();
        }
    }, [props, updateThumbs, rangeValuesPrev]);

    useEffect(() => {
        updateThumbs();
    }, [updateThumbs]);

    const handleContainerLayout = useWidthLayout(_containerWidthRef, updateThumbs);

    const isLowPressed = useCallback((nativeEvent: NativeTouchEvent) => {
        const { locationX: downX } = nativeEvent;

        const containerWidth = _containerWidthRef.current;
        const { low, high, min, max } = rangeRef.current;

        const lowPosition =
            lowThumbWidth / 2 + (low - min) / (max - min) * (containerWidth - lowThumbWidth);
        const highPosition =
            highThumbWidth / 2 + (high - min) / (max - min) * (containerWidth - highThumbWidth);

        return Utils.isLowCloser(downX, lowPosition, highPosition);
    }, [highThumbWidth, lowThumbWidth, rangeRef]);

    const { panHandlers } = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: truthy,
        onStartShouldSetPanResponderCapture: truthy,
        onMoveShouldSetPanResponder: truthy,
        onMoveShouldSetPanResponderCapture: truthy,
        onPanResponderTerminationRequest: truthy,
        onPanResponderTerminate: truthy,
        onShouldBlockNativeResponder: truthy,
        onPanResponderStart: ({ nativeEvent }): boolean => {
            const isLow = isLowPressed(nativeEvent);

            const currentDiameter = isLow ? theme.priceSlider.minimum.diameter : theme.priceSlider.maximum.diameter;

            Animated.timing(isLow ? _lowDiameter.current : _highDiameter.current, {
                toValue: currentDiameter * 1.5,
                duration: 100,
                useNativeDriver: false,
            }).start();

            return true;
        },
        onPanResponderGrant: ({ nativeEvent }, gestureState) => {
            const { numberActiveTouches } = gestureState;
            if (numberActiveTouches > 1) {
                return;
            }

            const { current: lowThumbX } = _lowThumbXRef;
            const { current: highThumbX } = _highThumbXRef;
            const { locationX: downX, pageX } = nativeEvent;

            const containerX = pageX - downX;
            const containerWidth = _containerWidthRef.current;

            const isLow = isLowPressed(nativeEvent);

            _gestureStateRef.current.isLow = isLow;

            const thumbWidth = isLow ? lowThumbWidth : highThumbWidth;

            const handlePositionChange = (positionInView: number): void => {
                const { low, high, min, max } = rangeRef.current;
                const minValue = isLow ? min : low;
                const maxValue = isLow ? high : max;

                const value = Utils.clamp(
                    Utils.getValueForPosition(
                        positionInView,
                        containerWidth,
                        thumbWidth,
                        min,
                        max
                    ),
                    minValue,
                    maxValue
                );

                if (_gestureStateRef.current.lastValue === value) {
                    return;
                }

                const availableSpace = containerWidth - thumbWidth;
                const absolutePosition = (value - min) / (max - min) * availableSpace;

                _gestureStateRef.current.lastValue = value;
                _gestureStateRef.current.lastPosition = absolutePosition + thumbWidth / 2;

                const minimum = isLow ? value : low;
                const maximum = isLow ? high : value;

                const _deltaX = props.maximum / (maximum - minimum);
                const _deltaY = (containerWidth - widthDelta) * 2 / ( lowThumbWidth + highThumbWidth );

                if((maximum - minimum) && _deltaX < _deltaY) {
                    setBorderVisibility(false);
                } else {
                    setBorderVisibility(true);
                }

                (isLow ? lowThumbX : highThumbX).setValue(absolutePosition);
                props.onValueChange({
                    minimum,
                    maximum
                });
                (isLow ? setLow : setHigh)(value);

                updateSelectedRail();
            };

            handlePositionChange(downX);
            pointerX.removeAllListeners();
            pointerX.addListener(({ value: pointerPosition }) => {
                const positionInView = pointerPosition - containerX;
                handlePositionChange(positionInView);
            });
        },

        onPanResponderMove: Animated.event([null, { moveX: pointerX }], { useNativeDriver: false }),
        onPanResponderRelease: ({ nativeEvent }) => {
            if(props.onValueRelease) {
                props.onValueRelease({
                    minimum: rangeRef.current.low,
                    maximum: rangeRef.current.high
                });
            }

            const isLow = isLowPressed(nativeEvent);

            const toDiameter = isLow ? theme.priceSlider.minimum.diameter : theme.priceSlider.maximum.diameter;

            Animated.timing(_lowDiameter.current, {
                toValue: toDiameter,
                duration: 100,
                useNativeDriver: false,
            }).start();

            Animated.timing(_highDiameter.current, {
                toValue: toDiameter,
                duration: 100,
                useNativeDriver: false,
            }).start();

        }
    }), [truthy, pointerX, isLowPressed, theme, lowThumbWidth, highThumbWidth, rangeRef, props, widthDelta, setLow, setHigh, updateSelectedRail]);

    return (
        <SliderWrapper onLayout={handleContainerLayout}>
            <RailWrapper style={{ marginRight: highThumbWidth / 2, marginLeft: lowThumbWidth / 2 }}>
                <Rail/>
                <Animated.View style={selectedRailStyle}>
                    <SelectedRail/>
                </Animated.View>
            </RailWrapper>
            <Animated.View style={lowStyles}>
                <MinimumThumb style={lowInternalStyles}>
                    <VerticalLines/>
                </MinimumThumb>
            </Animated.View>
            <Animated.View style={highStyles as unknown as StyleProp<ViewStyle>}>
                <MaximumThumb isBorderVisible={borderVisibility} style={highInternalStyles}>
                    <VerticalLines/>
                </MaximumThumb>
            </Animated.View>
            <TouchableController {...panHandlers} collapsable={false}/>
        </SliderWrapper>
    )
}
