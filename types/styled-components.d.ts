import 'styled-components';

// module augmentation of styled-components types so we can define the
// structure of our theme and properly type it for components to use

declare module 'styled-components' {
    export interface DefaultTheme {
        colours: {
            primary: string;
            secondary: string;
            shadow: string;
        };
        priceSlider: {
            width: string;
            line: {
                height: number;
            };
            minimum: {
                diameter: number;
            };
            maximum: {
                diameter: number;
            };
            verticalLines: {
                height: number;
                width: number;
                containerWidth: number;
            }
            textInfo: {
                marginBottom: number;
            }
        }
    }
}
