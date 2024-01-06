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

// state
let mode = selectMode(getState());
let allVertices = selectVertices(getState());

// local state
let dragStartPoint: Nullable<Vector3> = null;
let draggedMesh: Nullable<AbstractMesh> = null;

// update state
store.subscribe(() => {
  mode = selectMode(getState());
  allVertices = selectVertices(getState());
});

// actions
const getGroundPosition = (): Vector3 | null => {
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

const handleStartDrag = (mesh: AbstractMesh): void => {
  if (mesh) {
    camera.detachControl();
    mesh.material = polygonFocusMaterial;
    draggedMesh = mesh;
    dragStartPoint = getGroundPosition();
  }
};

const handleMoveDrag = (): void => {
  if (draggedMesh && dragStartPoint) {
    const currentPoint = getGroundPosition();
    if (currentPoint) {
      const diff = currentPoint.subtract(dragStartPoint);
      draggedMesh.position.addInPlace(diff);
      dragStartPoint = currentPoint;
    }
  }
};

const handleEndDrag = (): void => {
  if (draggedMesh) {
    draggedMesh.material = polygonMaterial;
  }
  camera.attachControl(canvas, true);
  updateVertices();
  draggedMesh = null;
  dragStartPoint = null;
};

const updateVertices = (): void => {
  if (draggedMesh) {
    const index = Number(draggedMesh.name.split('-')[1]);
    const positions = draggedMesh.getPositionData();
    dispatch(
      setVerticesGroupByIndex({
        i: index,
        // @ts-expect-error weird type error
        vertices: positions?.slice(0, allVertices[index].length).map((_, i) => {
          return new Vector3(
            positions[i * 3] + draggedMesh!.position.x,
            positions[i * 3 + 1],
            positions[i * 3 + 2] + draggedMesh!.position.z,
          );
        }),
      }),
    );
  }
};

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
