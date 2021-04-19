import { DefaultTheme } from 'styled-components';

export const defaultTheme: DefaultTheme = {
    colours: {
        primary: '#000000',
        secondary: '#ffffff',
        shadow: '#babbbb'
    },
    priceSlider: {
        width: '70%',
        line: {
            height: 2
        },
        minimum: {
            diameter: 32
        },
        maximum: {
            diameter: 32
        },
        verticalLines: {
            height: 12,
            width: 2,
            containerWidth: 8
        },
        textInfo: {
            marginBottom: 12
        }
    }
};
