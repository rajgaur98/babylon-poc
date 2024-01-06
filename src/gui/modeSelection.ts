import { adt } from '@/constants';
import { setMode } from '@/redux/slices/vertices';
import { dispatch } from '@/redux/store';
import { Button, Control, StackPanel } from '@babylonjs/gui';

const panel = new StackPanel();
panel.width = '220px';
panel.top = '-50px';
panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
adt.addControl(panel);

const createBtn = Button.CreateSimpleButton('button', 'Draw');
createBtn.height = '30px';
createBtn.color = 'white';
createBtn.background = 'green';
panel.addControl(createBtn);

const moveBtn = Button.CreateSimpleButton('button', 'Move');
moveBtn.height = '30px';
moveBtn.color = 'white';
moveBtn.background = 'green';
panel.addControl(moveBtn);

const editBtn = Button.CreateSimpleButton('button', 'Edit');
editBtn.height = '30px';
editBtn.color = 'white';
editBtn.background = 'green';
panel.addControl(editBtn);

createBtn.onPointerClickObservable.add((pointerInfo) => {
  if (pointerInfo.buttonIndex === 0) {
    dispatch(setMode('DRAW'));
  }
});

moveBtn.onPointerClickObservable.add((pointerInfo) => {
  if (pointerInfo.buttonIndex === 0) {
    dispatch(setMode('MOVE'));
  }
});

editBtn.onPointerClickObservable.add((pointerInfo) => {
  if (pointerInfo.buttonIndex === 0) {
    dispatch(setMode('EDIT'));
  }
});
