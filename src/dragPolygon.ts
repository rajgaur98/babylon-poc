import {
  AbstractMesh,
  Color3,
  PointerEventTypes,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';
import {
  selectDragStartPoint,
  selectDraggedMesh,
  setDragStartPoint,
  setDraggedMesh,
} from './redux/slices/vertices';
import { dispatch, getState, store } from './redux/store';
import { camera, canvas, scene } from '.';

// state
let dragStartPoint = selectDragStartPoint(getState());
let draggedMesh = selectDraggedMesh(getState());

// update state
store.subscribe(() => {
  dragStartPoint = selectDragStartPoint(getState());
  draggedMesh = selectDraggedMesh(getState());
});

// materials
const polygonMaterial = new StandardMaterial('yellow', scene);
polygonMaterial.diffuseColor = new Color3(1, 0, 0);

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
    dispatch(setDraggedMesh(mesh));
    dispatch(setDragStartPoint(getGroundPosition()));
  }
};

const handleMoveDrag = (): void => {
  if (draggedMesh && dragStartPoint) {
    const currentPoint = getGroundPosition();
    if (currentPoint) {
      const diff = currentPoint.subtract(dragStartPoint);
      draggedMesh.position.addInPlace(diff);
      dispatch(setDragStartPoint(currentPoint));
    }
  }
};

const handleEndDrag = (): void => {
  camera.attachControl(canvas, true);
  dispatch(setDraggedMesh(null));
  dispatch(setDragStartPoint(null));
};

scene.onPointerObservable.add((pointerInfo) => {
  switch (pointerInfo.type) {
    case PointerEventTypes.POINTERDOWN:
      if (
        pointerInfo.pickInfo?.hit &&
        pointerInfo.pickInfo.pickedMesh?.name === 'polygon'
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
