// this file is responsible for moving/dragging the polygon

import {
  AbstractMesh,
  PointerEventTypes,
  Vector3,
  type Nullable,
} from '@babylonjs/core';
import {
  selectMode,
  selectVertices,
  setVerticesGroupByIndex,
} from './redux/slices/vertices';
import { dispatch, getState, store } from './redux/store';
import {
  camera,
  canvas,
  polygonFocusMaterial,
  polygonMaterial,
  scene,
} from './constants';
import { getGroundPosition } from './helpers/getGroundPosition';

// state
let mode = selectMode(getState());
let allVertices = selectVertices(getState());

// local state
let dragStartPoint: Nullable<Vector3> = null;
let draggedMesh: Nullable<AbstractMesh> = null;

// sync state
store.subscribe(() => {
  mode = selectMode(getState());
  allVertices = selectVertices(getState());
});

const handleStartDrag = (mesh: AbstractMesh): void => {
  if (mesh) {
    camera.detachControl();
    // change color of the mesh when it is dragged
    mesh.material = polygonFocusMaterial;
    draggedMesh = mesh;
    dragStartPoint = getGroundPosition();
  }
};

const handleMoveDrag = (): void => {
  if (draggedMesh && dragStartPoint) {
    const currentPoint = getGroundPosition();
    if (currentPoint) {
      // add the difference between two points to the mesh position
      const diff = currentPoint.subtract(dragStartPoint);
      draggedMesh.position.addInPlace(diff);
      dragStartPoint = currentPoint;
    }
  }
};

const handleEndDrag = (): void => {
  if (draggedMesh) {
    // reset the color of the mesh
    draggedMesh.material = polygonMaterial;
  }

  // attach camera back
  camera.attachControl(canvas, true);

  // save the new vertices to state
  updateVertices();

  // reset local state
  draggedMesh = null;
  dragStartPoint = null;
};

const updateVertices = (): void => {
  if (draggedMesh) {
    // index of the polygon from the array of shapes
    const index = Number(draggedMesh.name.split('-')[1]);
    const positions = draggedMesh.getPositionData();

    // update the vertices of that specific polygon/shape
    dispatch(
      setVerticesGroupByIndex({
        i: index,
        // extract the vertices on xz plane from the positions array
        // @ts-expect-error weird type error
        vertices: positions?.slice(0, allVertices[index].length).map((_, i) => {
          return [
            positions[i * 3] + draggedMesh!.position.x,
            positions[i * 3 + 1],
            positions[i * 3 + 2] + draggedMesh!.position.z,
          ];
        }) as number[][],
      }),
    );
  }
};

// listen to pointer events
scene.onPointerObservable.add((pointerInfo) => {
  if (mode !== 'MOVE') return;

  switch (pointerInfo.type) {
    case PointerEventTypes.POINTERDOWN:
      if (
        pointerInfo.pickInfo?.hit &&
        pointerInfo.pickInfo.pickedMesh?.name.startsWith('polygon')
      ) {
        handleStartDrag(pointerInfo.pickInfo.pickedMesh);
      }
      break;
    case PointerEventTypes.POINTERMOVE:
      handleMoveDrag();
      break;
    case PointerEventTypes.POINTERUP:
      if (pointerInfo.event.button === 0) {
        handleEndDrag();
      }
      break;
  }
});
