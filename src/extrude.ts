import { POLYGON_HEIGHT, polygonMaterial, scene } from '@/constants';
import { selectVertices } from '@/redux/slices/vertices';
import { getState, store } from '@/redux/store';
import { ExtrudePolygon, Mesh, type Nullable } from '@babylonjs/core';
import earcut from 'earcut';
import { arrayToVector } from './helpers/arrayToVector';

// localstate
const drawnPolygons: Nullable<Mesh>[] = [];

// state
let vertices = selectVertices(getState());

store.subscribe(() => {
  vertices = selectVertices(getState());
});

const disposeCurrentVertices = (): void => {
  scene.getMeshesById('vertex').forEach((mesh) => {
    mesh.dispose();
  });
  scene.getMeshesById('connector').forEach((mesh) => {
    mesh.dispose();
  });
};

export const extrudePolygon = (
  customVertices = vertices.map((vertices) =>
    vertices.map((vertex) => arrayToVector(vertex)),
  ),
  clearVertices = true,
): void => {
  // clear the previous screen
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
    drawnPolygons.push(polygon);
  }

  clearVertices && disposeCurrentVertices();
};
