import { type Mesh, type Nullable, type Vector3 } from '@babylonjs/core';
import { createSelector, createSlice } from '@reduxjs/toolkit';

export type ReducerActions =
  | 'addVertex'
  | 'setRenderedShape'
  | 'setDragStartPoint'
  | 'setDraggedMesh';

export interface State {
  vertices: Vector3[];
  renderedShape: Nullable<Mesh>;
  dragStartPoint: Nullable<Vector3>;
  draggedMesh: Nullable<Mesh>;
}

const INITIAL_STATE: State = {
  vertices: [],
  renderedShape: null,
  dragStartPoint: null,
  draggedMesh: null,
};

const verticesSlice = createSlice({
  name: 'vertices',
  initialState: INITIAL_STATE,
  reducers: {
    addVertex: (state, action) => {
      state.vertices.push(action.payload);
    },
    setVertices: (state, action) => {
      state.vertices = action.payload;
    },
    setRenderedShape: (state, action) => {
      state.renderedShape = action.payload;
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
  addVertex,
  setVertices,
  setRenderedShape,
  setDragStartPoint,
  setDraggedMesh,
} = verticesSlice.actions;

export const selectVertices = createSelector(
  (state: { vertices: State }) => state.vertices,
  (state) => state.vertices,
);

export const selectRenderedShape = createSelector(
  (state: { vertices: State }) => state.vertices,
  (state) => state.renderedShape,
);

export const selectDragStartPoint = createSelector(
  (state: { vertices: State }) => state.vertices,
  (state) => state.dragStartPoint,
);

export const selectDraggedMesh = createSelector(
  (state: { vertices: State }) => state.vertices,
  (state) => state.draggedMesh,
);
