import { adt } from '@/constants';
import { selectMode, setMode } from '@/redux/slices/vertices';
import { dispatch, getState, store } from '@/redux/store';
import { Button, Control, StackPanel } from '@babylonjs/gui';

store.subscribe(() => {
  const mode = selectMode(getState());
  createBtn.background = mode === 'DRAW' ? 'black' : 'white';
  moveBtn.background = mode === 'MOVE' ? 'black' : 'white';
  editBtn.background = mode === 'EDIT' ? 'black' : 'white';
  createBtn.color = mode === 'DRAW' ? 'white' : 'black';
  moveBtn.color = mode === 'MOVE' ? 'white' : 'black';
  editBtn.color = mode === 'EDIT' ? 'white' : 'black';
});

const panel = new StackPanel();
panel.width = '220px';
panel.top = '-50px';
panel.paddingRightInPixels = 20;
panel.paddingBottomInPixels = 20;
panel.horizontalAlignment = Control.HORIZONTAL_ALIGNMENT_RIGHT;
panel.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
adt.addControl(panel);

const createBtn = Button.CreateSimpleButton('button', 'Draw');
createBtn.height = '30px';
createBtn.color = 'white';
createBtn.background = 'black';
panel.addControl(createBtn);

const moveBtn = Button.CreateSimpleButton('button', 'Move');
moveBtn.height = '30px';
moveBtn.color = 'black';
moveBtn.background = 'white';
panel.addControl(moveBtn);

const editBtn = Button.CreateSimpleButton('button', 'Edit');
editBtn.height = '30px';
editBtn.color = 'black';
editBtn.background = 'white';
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
