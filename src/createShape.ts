import {
  Vector3,
  type Nullable,
  CreateSphere,
  StandardMaterial,
  Color3,
  Mesh,
  ExtrudePolygon,
  PointerEventTypes,
} from '@babylonjs/core';
import { ground, scene } from '.';
import { dispatch, getState, store } from './redux/store';
import {
  addVertex,
  selectRenderedShape,
  selectVertices,
  setRenderedShape,
  setVertices,
} from './redux/slices/vertices';
import earcut from 'earcut';

const POLYGON_HEIGHT = 2.5;

const polygonMaterial = new StandardMaterial('yellow', scene);
polygonMaterial.diffuseColor = new Color3(1, 0, 0);

// state
let vertices = selectVertices(getState());
let renderedShape = selectRenderedShape(getState());

store.subscribe(() => {
  vertices = selectVertices(getState());
  renderedShape = selectRenderedShape(getState());
});

const addPoints = (vertex?: Nullable<Vector3>): void => {
  if (vertex) {
    const vertex2D = new Vector3(vertex.x, 0, vertex.z);
    const sphere = CreateSphere('vertex', { diameter: 0.2 }, scene);
    sphere.position = vertex2D;
    sphere.material = polygonMaterial;
    dispatch(addVertex(vertex2D));
    if (renderedShape) {
      dispatch(setRenderedShape(Mesh.MergeMeshes([renderedShape, sphere])));
    } else {
      dispatch(setRenderedShape(sphere));
    }
  }
};

const disposeCurrentVertices = (): void => {
  renderedShape?.dispose();
  dispatch(setRenderedShape(null));
};

const extrudePolygon = (): void => {
  if (vertices.length <= 2) return;
  const polygon = ExtrudePolygon(
    'polygon',
    {
      shape: [...vertices, vertices[0]],
      depth: POLYGON_HEIGHT,
    },
    scene,
    earcut,
  );
  polygon.parent = ground;
  polygon.position.y = POLYGON_HEIGHT;
  polygon.material = polygonMaterial;

  dispatch(setVertices([]));
  disposeCurrentVertices();
};

scene.onPointerObservable.add((pointerInfo) => {
  switch (pointerInfo.type) {
    case PointerEventTypes.POINTERTAP:
      if (pointerInfo.event.button === 0) {
        addPoints(pointerInfo.pickInfo?.pickedPoint);
      }
      break;
    case PointerEventTypes.POINTERUP:
      if (pointerInfo.event.button === 2) {
        extrudePolygon();
      }
      break;
  }
});
