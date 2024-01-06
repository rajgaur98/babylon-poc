// this file contains the logic for drawing on xz plane

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
import { arrayToVector } from './helpers/arrayToVector';

// state
let vertices = selectLastVertices(getState());
let mode = selectMode(getState());

// sync state
store.subscribe(() => {
  vertices = selectLastVertices(getState());
  mode = selectMode(getState());
});

// adds points on the ground
const addPoints = (vertex?: Nullable<Vector3>): void => {
  if (vertex) {
    const vertex2D = new Vector3(vertex.x, 0, vertex.z);
    const sphere = CreateSphere('vertex', { diameter: 0.5 }, scene);
    sphere.position = vertex2D;
    sphere.material = pointMaterial;

    // draw lines between vertices
    if (vertices.length > 0) {
      CreateLines('connector', {
        points: [arrayToVector(vertices[vertices.length - 1]), vertex2D],
      });
    }

    // add vertex to state
    dispatch(addVerticesToLastVertex(vertex2D.asArray()));
  }
};

// connects the last vertex to the first vertex
const closeShape = (): void => {
  if (vertices.length <= 2) return;
  CreateLines('connector', {
    points: [
      arrayToVector(vertices[vertices.length - 1]),
      arrayToVector(vertices[0]),
    ],
  });

  // add new vertex to state to start a new shape
  dispatch(addVertex([]));
};

// take action based on pointer events
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
