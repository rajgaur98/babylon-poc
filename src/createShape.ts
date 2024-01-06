import {
  Vector3,
  type Nullable,
  CreateSphere,
  Mesh,
  PointerEventTypes,
  CreateLines,
} from '@babylonjs/core';
import { dispatch, getState, store } from './redux/store';
import {
  addVertex,
  addVerticesToLastVertex,
  selectConnectors,
  selectLastVertices,
  selectMode,
  selectRenderedShape,
  setConnectors,
  setRenderedShape,
} from './redux/slices/vertices';
import { polygonMaterial, scene } from './constants';

// state
let vertices = selectLastVertices(getState());
let renderedShape = selectRenderedShape(getState());
let connectors = selectConnectors(getState());
let mode = selectMode(getState());

store.subscribe(() => {
  vertices = selectLastVertices(getState());
  renderedShape = selectRenderedShape(getState());
  connectors = selectConnectors(getState());
  mode = selectMode(getState());
});

const addPoints = (vertex?: Nullable<Vector3>): void => {
  if (vertex) {
    const vertex2D = new Vector3(vertex.x, 0, vertex.z);
    const sphere = CreateSphere('vertex', { diameter: 0.2 }, scene);
    sphere.position = vertex2D;
    sphere.material = polygonMaterial;

    if (vertices.length > 0) {
      const line = CreateLines('connector', {
        points: [vertices[vertices.length - 1], vertex2D],
      });
      if (connectors) {
        dispatch(setConnectors(Mesh.MergeMeshes([connectors, line])));
      } else {
        dispatch(setConnectors(line));
      }
    }

    dispatch(addVerticesToLastVertex(vertex2D));
    if (renderedShape) {
      dispatch(setRenderedShape(Mesh.MergeMeshes([renderedShape, sphere])));
    } else {
      dispatch(setRenderedShape(sphere));
    }
  }
};

const closeShape = (): void => {
  if (vertices.length <= 2) return;
  const line = CreateLines('connector', {
    points: [vertices[vertices.length - 1], vertices[0]],
  });

  if (connectors) {
    dispatch(setConnectors(Mesh.MergeMeshes([connectors, line])));
  } else {
    dispatch(setConnectors(line));
  }

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
