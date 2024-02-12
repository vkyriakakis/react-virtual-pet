// If hunger and thrist reach the maximum, the pet dies. The same happens
// if love reaches 0.
export const MAX_HUNGER = 10;
export const MAX_LOVE = 10;
export const MAX_THIRST = 10;

// The rest of the hunger, love, and thirst constants concern the change in
// the pet's mood
export const HIGH_HUNGER = 7;
export const HIGH_THIRST = 7;
export const HIGH_LOVE = 8;

export const MID_HUNGER = 4;
export const MID_THIRST = 4;
export const MID_LOVE = 6;

export const LOW_HUNGER = 2;
export const LOW_THIRST = 2;
export const LOW_LOVE = 3;

// These values concern the min and max RGB values for the pet's color
export const MIN_COLOR = 80;
export const COLOR_INCREASE = 30;
export const MAX_COLOR = 255;

// The unit of game time (in ms)
export const TICK_DURATION = 3000;

// The *_INTERVAL constants concern the rate
// at which each stat increases as time passes
export const THIRST_INTERVAL = 1;
export const HUNGER_INTERVAL = 2;
export const LOVE_INTERVAL = 3;

// These values concern the number of ticks that must pass for the
// baby growth stage to occur
export const MAX_EGG_TICKS = 10;

// Same but for the child growth stage (the ticks are counted from t = 0)
export const MAX_BABY_TICKS = 20;

// And for the rest of the stages
export const MAX_CHILD_TICKS = 35;
export const MAX_TEEN_TICKS = 55;