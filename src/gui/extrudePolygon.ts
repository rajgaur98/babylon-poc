import { adt } from '@/constants';
import { extrudePolygon } from '@/extrude';
import { Button, Control, StackPanel } from '@babylonjs/gui';

const panel = new StackPanel();
panel.width = '220px';
panel.top = '50px';
panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_LEFT;
panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_TOP;
adt.addControl(panel);

const button = Button.CreateSimpleButton('button', 'Extrude');
button.height = '30px';
button.color = 'white';
button.background = 'green';
panel.addControl(button);

button.onPointerClickObservable.add((pointerInfo) => {
  if (pointerInfo.buttonIndex === 0) {
    console.log('button clicked');
    extrudePolygon();
  }
});
