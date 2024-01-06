import {
  Vector3,
  type Nullable,
  CreateSphere,
  Mesh,
  PointerEventTypes,
  AbstractMesh,
} from '@babylonjs/core';
import { dispatch, getState, store } from './redux/store';
import {
  selectMode,
  selectVertices,
  setVerticesByIndex,
} from './redux/slices/vertices';
import {
  POLYGON_HEIGHT,
  camera,
  canvas,
  polygonMaterial,
  scene,
} from './constants';
import { extrudePolygon } from './extrude';

// local state
let isDrawn = false;
let vertexEditClues: Nullable<Mesh>[] = [];
let draggedMesh: Nullable<AbstractMesh> = null;
let dragStartPoint: Nullable<Vector3> = null;

// state
let allVertices = selectVertices(getState());
let mode = selectMode(getState());

let clonedVertices: Vector3[][] = allVertices.map((vertices) =>
  vertices.map((vertex) => vertex.clone()),
);

store.subscribe(() => {
  allVertices = selectVertices(getState());
  mode = selectMode(getState());

  clonedVertices = allVertices.map((vertices) =>
    vertices.map((vertex) => vertex.clone()),
  );

  if (mode === 'EDIT') {
    if (!isDrawn) {
      showVertices();
    }
    isDrawn = true;
  } else {
    isDrawn = false;
    vertexEditClues?.forEach((vertex) => vertex?.dispose());
    vertexEditClues = [];
  }
});

const showVertices = (): void => {
  for (let i = 0; i < allVertices.length; i += 1) {
    const vertices = allVertices[i];
    for (let j = 0; j < vertices.length; j += 1) {
      const vertex = vertices[j];
      const vertex2D = new Vector3(vertex.x, POLYGON_HEIGHT, vertex.z);
      const sphere = CreateSphere(`vertex-${i}-${j}`, { diameter: 0.2 }, scene);
      sphere.position = vertex2D;
      sphere.material = polygonMaterial;
      vertexEditClues?.push(sphere);
    }
  }
};

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

      const magnitude = diff.length();

      const [i, j] = draggedMesh.name.split('-').slice(1).map(Number);
      clonedVertices[i][j] = new Vector3(
        draggedMesh.position.x,
        0,
        draggedMesh.position.z,
      );

      if (magnitude >= 0.02) {
        extrudePolygon(clonedVertices, false);
      }
    }
  }
};

const handleEndDrag = (): void => {
  if (draggedMesh) {
    const [i, j] = draggedMesh.name.split('-').slice(1).map(Number);
    dispatch(
      setVerticesByIndex({
        i,
        j,
        vertex: new Vector3(draggedMesh.position.x, 0, draggedMesh.position.z),
      }),
    );
  }

  camera.attachControl(canvas, true);
  dragStartPoint = null;
  draggedMesh = null;
  extrudePolygon(clonedVertices, false);
};

scene.onPointerObservable.add((pointerInfo) => {
  if (mode !== 'EDIT') return;

  switch (pointerInfo.type) {
    case PointerEventTypes.POINTERDOWN:
      if (
        pointerInfo.pickInfo?.hit &&
        pointerInfo.pickInfo.pickedMesh?.name.startsWith('vertex-')
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
