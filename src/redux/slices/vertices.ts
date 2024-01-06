// redux slice for managing vertices and mode

import {
  createSelector,
  createSlice,
  type PayloadAction,
} from '@reduxjs/toolkit';

export interface State {
  // we are using array instead of Vector3 because Vector3 is not serializable
  // we can use Vector3 in the component and convert it to array before dispatching
  vertices: number[][][];
  mode: 'DRAW' | 'MOVE' | 'EDIT';
}

const INITIAL_STATE: State = {
  vertices: [[]],
  mode: 'DRAW',
};

const verticesSlice = createSlice({
  name: 'vertices',
  initialState: INITIAL_STATE,
  reducers: {
    setMode: (state, action: PayloadAction<State['mode']>) => {
      state.mode = action.payload;
    },
    addVertex: (state, action: PayloadAction<number[][]>) => {
      state.vertices.push(action.payload);
    },
    addVerticesToLastVertex: (state, action: PayloadAction<number[]>) => {
      state.vertices[state.vertices.length - 1].push(action.payload);
    },
    setVertices: (state, action: PayloadAction<number[][][]>) => {
      state.vertices = action.payload;
    },
    setVerticesByIndex: (
      state,
      action: PayloadAction<{ i: number; j: number; vertex: number[] }>,
    ) => {
      const { i, j, vertex } = action.payload;
      state.vertices[i][j] = vertex;
    },
    setVerticesGroupByIndex: (
      state,
      action: PayloadAction<{ i: number; vertices: number[][] }>,
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

// selectors
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
