// GUI setup for showing extrude button

import { adt } from '@/constants';
import { extrudePolygon } from '@/extrude';
import { selectMode } from '@/redux/slices/vertices';
import { getState, store } from '@/redux/store';
import { Button, Control, StackPanel } from '@babylonjs/gui';

// toggle button visibility based on mode
store.subscribe(() => {
  const mode = selectMode(getState());
  button.isVisible = mode === 'DRAW';
});

const panel = new StackPanel();
panel.width = '220px';
panel.top = '50px';
panel.paddingLeftInPixels = 20;
panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
adt.addControl(panel);

const button = Button.CreateSimpleButton('button', 'Extrude');
button.height = '40px';
button.color = 'white';
button.background = 'black';
button.adaptWidthToChildren = true;
panel.addControl(button);

button.onPointerClickObservable.add((pointerInfo) => {
  if (pointerInfo.buttonIndex === 0) {
    extrudePolygon();
  }
});
