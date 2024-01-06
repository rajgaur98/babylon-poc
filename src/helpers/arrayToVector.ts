// Helper function to convert array to vector

import { Vector3 } from '@babylonjs/core';

export const arrayToVector = (array: number[]): Vector3 => {
  return new Vector3(array[0], array[1], array[2]);
};
