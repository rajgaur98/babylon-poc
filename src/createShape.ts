import {
  Vector3,
  type Nullable,
  CreateSphere,
  PointerEventTypes,
  CreateLines,
} from '@babylonjs/core';
import { dispatch, getState, store } from './redux/store';
import {
  addVertex,
  addVerticesToLastVertex,
  selectLastVertices,
  selectMode,
} from './redux/slices/vertices';
import { pointMaterial, scene } from './constants';

// state
let vertices = selectLastVertices(getState());
let mode = selectMode(getState());

store.subscribe(() => {
  vertices = selectLastVertices(getState());
  mode = selectMode(getState());
});

const addPoints = (vertex?: Nullable<Vector3>): void => {
  if (vertex) {
    const vertex2D = new Vector3(vertex.x, 0, vertex.z);
    const sphere = CreateSphere('vertex', { diameter: 0.5 }, scene);
    sphere.position = vertex2D;
    sphere.material = pointMaterial;

    if (vertices.length > 0) {
      CreateLines('connector', {
        points: [vertices[vertices.length - 1], vertex2D],
      });
    }

    dispatch(addVerticesToLastVertex(vertex2D));
  }
};

const closeShape = (): void => {
  if (vertices.length <= 2) return;
  CreateLines('connector', {
    points: [vertices[vertices.length - 1], vertices[0]],
  });

  dispatch(addVertex([]));
};

scene.onPointerObservable.add((pointerInfo) => {
  if (mode !== 'DRAW') return;

  switch (pointerInfo.type) {
    case PointerEventTypes.POINTERTAP:
      if (pointerInfo.event.button === 0) {
        addPoints(pointerInfo.pickInfo?.pickedPoint);
      }
      break;
    case PointerEventTypes.POINTERUP:
      if (pointerInfo.event.button === 2) {
        closeShape();
      }
      break;
  }
});
