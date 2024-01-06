import {
  ArcRotateCamera,
  Color3,
  HemisphericLight,
  StandardMaterial,
  Vector3,
} from '@babylonjs/core';
import { Engine } from '@babylonjs/core/Engines/engine';
import { CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder';
import { Scene } from '@babylonjs/core/scene';
import { AdvancedDynamicTexture } from '@babylonjs/gui';

// Get the canvas element from the DOM.
export const canvas = document.querySelector('canvas');

// Associate a Babylon Engine to it.
export const engine = new Engine(canvas);

// Create our first scene.
export const scene = new Scene(engine);

/**** Set camera and light *****/
export const camera = new ArcRotateCamera(
  'camera',
  0,
  Math.PI / 2.5,
  10,
  new Vector3(0, 0, 0),
);
camera.attachControl(canvas, true);

export const light = new HemisphericLight('light', new Vector3(1, 1, 0));

// Our built-in 'ground' shape.
export const ground = CreateGround('ground1', { width: 50, height: 50 }, scene);

export const polygonMaterial = new StandardMaterial('yellow', scene);
polygonMaterial.diffuseColor = new Color3(1, 0, 0);

export const adt = AdvancedDynamicTexture.CreateFullscreenUI('UI');

// Hard coded values
export const POLYGON_HEIGHT = 2.5;
