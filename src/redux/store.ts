import { configureStore } from '@reduxjs/toolkit';
import vertices from './slices/vertices';

export const store = configureStore({
  reducer: {
    vertices,
  },
});

export const { dispatch, getState } = store;
