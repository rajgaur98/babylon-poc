import {
  Vector3,
  type Nullable,
  CreateSphere,
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
  scene,
  vertexMaterial,
} from './constants';
import { extrudePolygon } from './extrude';
import { arrayToVector } from './helpers/arrayToVector';
import { getGroundPosition } from './helpers/getGroundPosition';

// local state
let isDrawn = false;
let draggedMesh: Nullable<AbstractMesh> = null;
let dragStartPoint: Nullable<Vector3> = null;

// state
let allVertices = selectVertices(getState());
let mode = selectMode(getState());

// we keep a copy of the vertices to avoid mutating the state
// this copy will be updated when the vertexes are dragged
// we will dispatch the updated vertices to the state when the drag ends
let clonedVertices: Vector3[][] = allVertices.map((vertices) =>
  vertices.map((vertex) => arrayToVector(vertex)),
);

// sync state
store.subscribe(() => {
  allVertices = selectVertices(getState());
  mode = selectMode(getState());

  clonedVertices = allVertices.map((vertices) =>
    vertices.map((vertex) => arrayToVector(vertex)),
  );

  if (mode === 'EDIT') {
    // show vertices when the mode is edit
    if (!isDrawn) {
      showVertices();
    }
    isDrawn = true;
  } else {
    // hide vertices when the mode is not edit
    isDrawn = false;
    for (let i = 0; i < allVertices.length; i += 1) {
      for (let j = 0; j < allVertices[i].length; j += 1) {
        scene.getMeshById(`vertex-${i}-${j}`)?.dispose();
      }
    }
  }
});

// helper for showing vertices
const showVertices = (): void => {
  for (let i = 0; i < allVertices.length; i += 1) {
    const vertices = allVertices[i];
    for (let j = 0; j < vertices.length; j += 1) {
      const vertex = arrayToVector(vertices[j]);
      const vertex2D = new Vector3(vertex.x, POLYGON_HEIGHT, vertex.z);
      const sphere = CreateSphere(`vertex-${i}-${j}`, { diameter: 0.5 }, scene);
      sphere.position = vertex2D;
      sphere.material = vertexMaterial;
    }
  }
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

      // get index of the dragged vertex
      const [i, j] = draggedMesh.name.split('-').slice(1).map(Number);
      // update the local copy of the vertices
      clonedVertices[i][j] = new Vector3(
        draggedMesh.position.x,
        0,
        draggedMesh.position.z,
      );

      // not worth re-rendering if the change is too small
      if (magnitude >= 0.02) {
        // re-render the polygons with the updated vertices
        extrudePolygon(clonedVertices, false);
      }
    }
  }
};

const handleEndDrag = (): void => {
  if (draggedMesh) {
    const [i, j] = draggedMesh.name.split('-').slice(1).map(Number);
    // update the state with the new vertex position
    dispatch(
      setVerticesByIndex({
        i,
        j,
        vertex: new Vector3(
          draggedMesh.position.x,
          0,
          draggedMesh.position.z,
        ).asArray(),
      }),
    );
  }

  camera.attachControl(canvas, true);
  dragStartPoint = null;
  draggedMesh = null;

  // re-render the polygons with the updated vertices
  extrudePolygon(clonedVertices, false);
};

// event listeners
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
