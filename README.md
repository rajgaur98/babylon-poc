# Babylon POC

## Live demo

https://babylon-poc.netlify.app/

## Local Setup

### Install dependencies

```
yarn install
```

### Start the app

```
NODE_OPTIONS=--max-old-space-size=4096 yarn serve
```

## Features

### Modes

#### Draw

- By default Draw mode is active
- Use the draw mode to create shapes and extrude them
- First, define points on the ground plane using the left click
- Close/Complete the shape using a right click
- Make as much shapes as you like
- Click on the "Extrude" button on the top-left of your screen to extrude the shapes into polygons

#### Move

- Enter this mode by clicking on the "Move" button at the bottom right of the screen
- Click and drag on the objects to move the polygons around the ground

#### Edit

- Enter this mode by clicking on the "Edit" button at the bottom right of the screen
- You will be able to see vertices after clicking the Edit button
- Clicl and drag the vertices as needed to change the shape of the polygon
- Feel free to toggle around the modes and see their effects

## References

- I have used https://github.com/VD39/typescript-webpack-boilerplate/issues template repository to speed up the TypeScript and Webpack setup
- https://doc.babylonjs.com/
