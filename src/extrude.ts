import { POLYGON_HEIGHT, polygonMaterial, scene } from '@/constants';
import {
  selectConnectors,
  selectRenderedShape,
  selectVertices,
  setConnectors,
  setRenderedShape,
} from '@/redux/slices/vertices';
import { dispatch, getState, store } from '@/redux/store';
import { ExtrudePolygon, Mesh, type Nullable } from '@babylonjs/core';
import earcut from 'earcut';

// localstate
let drawnPolygons: Nullable<Mesh>[] = [];

// state
let vertices = selectVertices(getState());
let renderedShape = selectRenderedShape(getState());
let connectors = selectConnectors(getState());

store.subscribe(() => {
  vertices = selectVertices(getState());
  renderedShape = selectRenderedShape(getState());
  connectors = selectConnectors(getState());
});

const disposeCurrentVertices = (): void => {
  renderedShape?.dispose();
  connectors?.dispose();
  dispatch(setRenderedShape(null));
  dispatch(setConnectors(null));
};

export const extrudePolygon = (
  customVertices = vertices,
  clearVertices = true,
): void => {
  // clear the previous screen
  drawnPolygons.forEach((polygon) => polygon?.dispose());
  drawnPolygons = [];

  for (let i = 0; i < customVertices.length; i += 1) {
    const vertex = customVertices[i];
    if (vertex.length <= 2) continue;

    const polygon = ExtrudePolygon(
      `polygon-${i}`,
      {
        shape: [...vertex, vertex[0]],
        depth: POLYGON_HEIGHT,
      },
      scene,
      earcut,
    );
    polygon.position.y = POLYGON_HEIGHT;
    polygon.material = polygonMaterial;
    drawnPolygons.push(polygon);
  }

  clearVertices && disposeCurrentVertices();
};
