import React, { useCallback, useMemo, useRef } from 'react';
import { Animated, LayoutChangeEvent, StyleProp, ViewStyle } from 'react-native';

import { clamp } from './utils';

export type RangeRefState = {
    low: number,
    high: number,
    min: number,
    max: number
};

export type RangeState = {
    rangeRef: React.MutableRefObject<RangeRefState>;
    rangeValuesPrev: RangeRefState;
    setLow: (value: number) => void;
    setHigh: (value: number) => void;
};

export const useRange = (
    min: number,
    max: number,
    lowValue?: number,
    highValue?: number
): RangeState => {

    const validLowProp = lowValue === undefined ? min : clamp(lowValue, min, max);
    const validHighProp = highValue === undefined ? max : clamp(highValue, min, max);

    const rangeRef = useRef<RangeRefState>({
        low: validLowProp,
        high: validHighProp,
        min,
        max
    });

    const rangeValuesPrev = rangeRef.current;

    // Props have higher priority.
    // If no props are passed, use internal state variables.
    const low = clamp(lowValue === undefined ? rangeValuesPrev.low : lowValue, min, max);
    const high = clamp(highValue === undefined ? rangeValuesPrev.high : highValue, min, max);

    // Always update values of refs so pan responder will have updated values
    Object.assign(rangeRef.current, { low, high, min, max });

    const setLow = (value: number) => rangeRef.current.low = value;
    const setHigh = (value: number) => rangeRef.current.high = value;

    return { rangeRef, rangeValuesPrev, setLow, setHigh };
};

export type SelectedRailState = {
    updateSelectedRail: (isLow?: boolean) => void;
    selectedRailStyle: StyleProp<ViewStyle>;
}

export const useSelectedRail = (
    rangeRef: React.MutableRefObject<RangeRefState>,
    containerWidthRef: React.MutableRefObject<number>,
    lowThumbWidth: number,
    highThumbWidth: number
): SelectedRailState => {
    const { current: left } = useRef(new Animated.Value(0));
    const { current: right } = useRef(new Animated.Value(0));

    const update = useCallback(() => {
        const { low, high, min, max } = rangeRef.current;
        const { current: containerWidth } = containerWidthRef;
        const leftFullScale = (max - min) / (containerWidth - lowThumbWidth);
        const rightFullScale = (max - min) / (containerWidth - highThumbWidth);
        const leftValue = (low - min) / leftFullScale;
        const rightValue = (max - high) / rightFullScale;

        left.setValue(leftValue);
        right.setValue(rightValue);
    }, [lowThumbWidth, highThumbWidth, rangeRef, containerWidthRef, left, right]);

    const styles = useMemo(() => ({
        position: 'absolute',
        left,
        right,
    } as unknown as StyleProp<ViewStyle>), [left, right]);

    return {
        selectedRailStyle: styles,
        updateSelectedRail: update
    };
};

export const useWidthLayout = (
    widthRef: React.MutableRefObject<number>,
    callback: () => void
): ((event: LayoutChangeEvent) => void) => {
    return useCallback(({ nativeEvent }) => {
        const { layout: { width }} = nativeEvent;
        const { current: w } = widthRef;

        if (w !== width) {
            widthRef.current = width;

            if (callback) {
                callback();
            }
        }
    }, [callback, widthRef]);
};
