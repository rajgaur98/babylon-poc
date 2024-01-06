import {
  ArcRotateCamera,
  Color3,
  CreateSphere,
  HemisphericLight,
  Vector3,
} from '@babylonjs/core';
import { Engine } from '@babylonjs/core/Engines/engine';
import { CreateGround } from '@babylonjs/core/Meshes/Builders/groundBuilder';
import { Scene } from '@babylonjs/core/scene';
import { AdvancedDynamicTexture } from '@babylonjs/gui';
import { GridMaterial } from '@babylonjs/materials';

// Get the canvas element from the DOM.
export const canvas = document.querySelector('canvas');

// Associate a Babylon Engine to it.
export const engine = new Engine(canvas);

// Create our first scene.
export const scene = new Scene(engine);

/**** Set camera and light *****/
export const camera = new ArcRotateCamera(
  'camera',
  Math.PI / 2.5,
  Math.PI / 2.5,
  40,
  new Vector3(0, 0, 0),
);
camera.attachControl(canvas, true);

export const light = new HemisphericLight('light', new Vector3(1, 1, 0));
light.intensity = 0.7;

const groundMaterial = new GridMaterial('groundMaterial', scene);
groundMaterial.mainColor = new Color3(0, 0, 0);
groundMaterial.lineColor = new Color3(0, 1.0, 1.0);
groundMaterial.backFaceCulling = false;

export const ground = CreateGround('ground1', { width: 50, height: 50 }, scene);
ground.material = groundMaterial;

const skyMaterial = new GridMaterial('skyMaterial', scene);
skyMaterial.majorUnitFrequency = 6;
skyMaterial.minorUnitVisibility = 0.43;
skyMaterial.gridRatio = 0.5;
skyMaterial.mainColor = new Color3(0, 0.05, 0.2);
skyMaterial.lineColor = new Color3(0, 1.0, 1.0);
skyMaterial.backFaceCulling = false;

const skySphere = CreateSphere('skySphere', {
  diameter: 110,
  segments: 30,
});
skySphere.material = skyMaterial;

export const polygonMaterial = new GridMaterial('polygonMaterial', scene);
polygonMaterial.majorUnitFrequency = 6;
polygonMaterial.minorUnitVisibility = 0;
polygonMaterial.gridRatio = 0.5;
polygonMaterial.mainColor = new Color3(1, 1, 1);
polygonMaterial.lineColor = new Color3(0, 0, 0);
polygonMaterial.backFaceCulling = false;

export const polygonFocusMaterial = polygonMaterial.clone(
  'polygonFocusMaterial',
);
polygonFocusMaterial.mainColor = new Color3(0.75, 0.75, 0.75);

export const pointMaterial = new GridMaterial('pointMaterial', scene);
pointMaterial.majorUnitFrequency = 0;
pointMaterial.minorUnitVisibility = 0;
pointMaterial.gridRatio = 0;
pointMaterial.mainColor = new Color3(1, 1, 1);
pointMaterial.lineColor = new Color3(0, 0, 0);
pointMaterial.backFaceCulling = false;

export const vertexMaterial = new GridMaterial('vertexMaterial', scene);
vertexMaterial.majorUnitFrequency = 0;
vertexMaterial.minorUnitVisibility = 0;
vertexMaterial.gridRatio = 0;
vertexMaterial.mainColor = new Color3(0.5, 0.5, 0.5);
vertexMaterial.lineColor = new Color3(0, 0, 0);
vertexMaterial.backFaceCulling = false;

export const adt = AdvancedDynamicTexture.CreateFullscreenUI('UI');

// Hard coded values
export const POLYGON_HEIGHT = 2.5;
