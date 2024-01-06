import { POLYGON_HEIGHT, polygonMaterial, scene } from '@/constants';
import { selectVertices } from '@/redux/slices/vertices';
import { getState, store } from '@/redux/store';
import { ExtrudePolygon } from '@babylonjs/core';
import earcut from 'earcut';
import { arrayToVector } from './helpers/arrayToVector';

// state
let vertices = selectVertices(getState()).map((vertices) =>
  vertices.map((vertex) => arrayToVector(vertex)),
);

// sync state
store.subscribe(() => {
  vertices = selectVertices(getState()).map((vertices) =>
    vertices.map((vertex) => arrayToVector(vertex)),
  );
});

// dispose the points and lines on the ground
// after extruding the polygon
const disposeCurrentVertices = (): void => {
  scene.getMeshesById('vertex').forEach((mesh) => {
    mesh.dispose();
  });
  scene.getMeshesById('connector').forEach((mesh) => {
    mesh.dispose();
  });
};

export const extrudePolygon = (
  customVertices = vertices,
  clearVertices = true,
): void => {
  // clear the previously drawn polygons
  for (let i = 0; i < customVertices.length; i += 1) {
    scene.getMeshById(`polygon-${i}`)?.dispose();
  }

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
  }

  clearVertices && disposeCurrentVertices();
};
