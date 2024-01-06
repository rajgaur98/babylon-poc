import { engine, scene } from './constants';

// Render every frame
engine.runRenderLoop(() => {
  scene.render();
});
