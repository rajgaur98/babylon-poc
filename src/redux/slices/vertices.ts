import { type Mesh, type Nullable, type Vector3 } from '@babylonjs/core';
import { createSelector, createSlice } from '@reduxjs/toolkit';

export type ReducerActions =
  | 'addVertex'
  | 'setRenderedShape'
  | 'setDragStartPoint'
  | 'setDraggedMesh';

export interface State {
  vertices: Vector3[][];
  mode: 'DRAW' | 'MOVE' | 'EDIT';
  connectors: Nullable<Mesh>;
  renderedShape: Nullable<Mesh>;
  dragStartPoint: Nullable<Vector3>;
  draggedMesh: Nullable<Mesh>;
}

const INITIAL_STATE: State = {
  vertices: [[]],
  mode: 'DRAW',
  connectors: null,
  renderedShape: null,
  dragStartPoint: null,
  draggedMesh: null,
};

const verticesSlice = createSlice({
  name: 'vertices',
  initialState: INITIAL_STATE,
  reducers: {
    setMode: (state, action) => {
      state.mode = action.payload;
    },
    addVertex: (state, action) => {
      state.vertices.push(action.payload);
    },
    addVerticesToLastVertex: (state, action) => {
      state.vertices[state.vertices.length - 1].push(action.payload);
    },
    setVertices: (state, action) => {
      state.vertices = action.payload;
    },
    setVerticesByIndex: (state, action) => {
      const { i, j, vertex } = action.payload;
      state.vertices[i][j] = vertex;
    },
    setVerticesGroupByIndex: (state, action) => {
      const { i, vertices } = action.payload;
      console.log({ prev: state.vertices[i], vertices });
      state.vertices[i] = vertices;
    },
    setRenderedShape: (state, action) => {
      state.renderedShape = action.payload;
    },
    setConnectors: (state, action) => {
      state.connectors = action.payload;
    },
    setDragStartPoint: (state, action) => {
      state.dragStartPoint = action.payload;
    },
    setDraggedMesh: (state, action) => {
      state.draggedMesh = action.payload;
    },
  },
});

export default verticesSlice.reducer;

export const {
  setMode,
  addVertex,
  addVerticesToLastVertex,
  setVertices,
  setVerticesByIndex,
  setVerticesGroupByIndex,
  setRenderedShape,
  setConnectors,
  setDragStartPoint,
  setDraggedMesh,
} = verticesSlice.actions;

export const selectMode = createSelector(
  (state: { vertices: State }) => state.vertices,
  (state) => state.mode,
);

export const selectVertices = createSelector(
  (state: { vertices: State }) => state.vertices,
  (state) => state.vertices,
);

export const selectLastVertices = createSelector(
  (state: { vertices: State }) => state.vertices,
  (state) => state.vertices[state.vertices.length - 1],
);

export const selectRenderedShape = createSelector(
  (state: { vertices: State }) => state.vertices,
  (state) => state.renderedShape,
);

export const selectConnectors = createSelector(
  (state: { vertices: State }) => state.vertices,
  (state) => state.connectors,
);

export const selectDragStartPoint = createSelector(
  (state: { vertices: State }) => state.vertices,
  (state) => state.dragStartPoint,
);

export const selectDraggedMesh = createSelector(
  (state: { vertices: State }) => state.vertices,
  (state) => state.draggedMesh,
);
