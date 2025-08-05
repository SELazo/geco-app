/**
 * Colors
 */

import { IBackground } from "../interfaces/components/IBackground";

export const GBlack: string = '#18191f';
export const GBlue: string = '#1947E5';
export const GGray: string = '#9FA4B4';
export const GGreen: string = '#00C6AE';
export const GRed: string = '#F95A2C';
export const GPink: string = '#FF89BB';
export const GYellow: string = '#FFBD12';
export const GLightYellow: string = '#FFF4CC';
export const GWhite: string = '#FFFFFF';

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
