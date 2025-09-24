// utils.ts

/**
 * Clamps a number between a minimum and maximum value.
 * @param value The number to clamp.
 * @param min The minimum value. Defaults to 0.
 * @param max The maximum value. Defaults to 1.
 * @returns The clamped number.
 */
export const clamp = (value: number, min: number = 0, max: number = 1): number => {
    return Math.max(min, Math.min(max, value));
};
