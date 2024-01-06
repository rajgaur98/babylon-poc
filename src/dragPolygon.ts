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
  selectMode,
  selectVertices,
  setDragStartPoint,
  setDraggedMesh,
  setVerticesGroupByIndex,
} from './redux/slices/vertices';
import { dispatch, getState, store } from './redux/store';
import { camera, canvas, scene } from './constants';

// state
let dragStartPoint = selectDragStartPoint(getState());
let draggedMesh = selectDraggedMesh(getState());
let mode = selectMode(getState());
let allVertices = selectVertices(getState());

// update state
store.subscribe(() => {
  dragStartPoint = selectDragStartPoint(getState());
  draggedMesh = selectDraggedMesh(getState());
  mode = selectMode(getState());
  allVertices = selectVertices(getState());
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
  updateVertices();
  dispatch(setDraggedMesh(null));
  dispatch(setDragStartPoint(null));
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
