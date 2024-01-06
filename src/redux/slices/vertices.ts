import { type Mesh, type Nullable, type Vector3 } from '@babylonjs/core';
import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

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
    setMode: (state, action: PayloadAction<State['mode']>) => {
      state.mode = action.payload;
    },
    addVertex: (state, action: PayloadAction<Vector3[]>) => {
      state.vertices.push(action.payload);
    },
    addVerticesToLastVertex: (state, action: PayloadAction<Vector3>) => {
      state.vertices[state.vertices.length - 1].push(action.payload);
    },
    setVertices: (state, action: PayloadAction<Vector3[][]>) => {
      state.vertices = action.payload;
    },
    setVerticesByIndex: (
      state,
      action: PayloadAction<{ i: number; j: number; vertex: Vector3 }>,
    ) => {
      const { i, j, vertex } = action.payload;
      state.vertices[i][j] = vertex;
    },
    setVerticesGroupByIndex: (
      state,
      action: PayloadAction<{ i: number; vertices: Vector3[] }>,
    ) => {
      const { i, vertices } = action.payload;
      state.vertices[i] = vertices;
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
