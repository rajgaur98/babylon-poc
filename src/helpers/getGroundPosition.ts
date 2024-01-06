// get ground position wrt xz plane

import { scene } from '@/constants';
import type { Vector3 } from '@babylonjs/core';

export const getGroundPosition = (): Vector3 | null => {
  const pickinfo = scene.pick(
    scene.pointerX,
    scene.pointerY,
    (mesh) => mesh.name === 'ground1',
  );
  if (pickinfo.hit) {
    return pickinfo.pickedPoint;
  }

  return null;
};
