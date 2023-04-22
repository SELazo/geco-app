/**
 * Colors
 */

const GBlack: string = '#18191F';
const GBlue: string = '#1947E5';
const GGray: string = '#9FA4B4';
const GGreen: string = '#00C6AE';
const GRed: string = '#F95A2C';
const GPink: string = '#FF89BB';
const GYellow: string = '#FFBD12';
const GWhite: string = '#FFFFFF';

/**
 * Palette: Colors that are to be used together.
 */

export const BlueYelowPalette: IBackground = {
  gecoColor: GYellow,
  backgroundColor: GBlue,
};

export const RedYelowPalette: IBackground = {
  gecoColor: GYellow,
  backgroundColor: GRed,
};

export const PinkBluePalette: IBackground = {
  gecoColor: GBlue,
  backgroundColor: GPink,
};

export const YelowGreenPalette: IBackground = {
  gecoColor: GGreen,
  backgroundColor: GYellow,
};

export const GreenRedPalette: IBackground = {
  gecoColor: GRed,
  backgroundColor: GGreen,
};
