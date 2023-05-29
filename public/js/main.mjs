import { switchCropperFormat, destroyCropper, processImageData } from './editor/editor.mjs';
import processBatch from "./processBatch.mjs";
import { clearPages, addPage, addPhoto } from './export/export.mjs';
import { getPossibleFormats } from "./export/documentFormats.mjs";

var selectedFormat = '';
function formatSelected(format) {
  if (selectedFormat == format){
    return;
  }
  clearPages();
  const existingSelection = document.querySelector('.selected'); 
  if (existingSelection) {
    existingSelection.classList.remove('selected');
  }
  document.getElementById(format).classList.add('selected');
  const existingCropper = document.querySelector('.cropper-canvas');
  if (existingCropper) {
    destroyCropper();
    document.querySelector('#editor img').remove();
  }
  switchCropperFormat(format);

  if (selectedFormat == ''){
    document.body.addEventListener("drop", drop);
    document.getElementById('editorControls').classList.remove('hide');
    document.getElementById('exportControls').classList.remove('hide');
    document.getElementById('placeHolder').classList.remove('hide');
    document.getElementById('editor').classList.remove('hide');
  }
  selectedFormat = format;
}

getPossibleFormats()
.then(formats => {
  let i = 0
  formats.forEach(format => {
    let newButton = document.createElement('button');
    newButton.id = format.size;
    newButton.innerHTML = '<h1>' + format.size.replace('f', '') + '</h1> <a>' + format.desc + '</a> <img src="' + format.example + '">' ;
    newButton.onclick = function() {
      formatSelected(format.size);
    };
    document.getElementById('formatBar').appendChild(newButton);
    i++;
  });
  document.getElementById("formatBar").style.setProperty('--noFormats', i);
});

export const startLoading = () => {
  let elem = document.createElement('div');
  elem.innerText = 'Loading...';
  elem.id = 'placeHolder';
  elem.classList.add('highlightBorder');

  const existingObject = document.querySelector('object'),
  placeHolder = document.querySelector('#placeHolder');

  if(existingObject) {
    existingObject.remove();
  }
  if(placeHolder) {
      placeHolder.remove();
  }
  document.querySelector('main').appendChild(elem);
}

function drag(e) {
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  const dt = e.dataTransfer;
  const files = dt.files;

  if (files.length == 1) {
      const reader = new FileReader;
      reader.onload = () => {
          processImageData(reader.result , selectedFormat);
      };
      reader.readAsDataURL(files[0]);
  }
  else {
      startLoading();
      processBatch(files, selectedFormat);
  }
}

document.body.addEventListener("dragenter", drag);
document.body.addEventListener("dragover", drag);
document.body.ondrop = (e) => {
  e.stopPropagation();
  e.preventDefault();
};
document.getElementById('addAll').addEventListener('click', () => {
  startLoading();
  addPage(selectedFormat);
});
document.getElementById('addOne').addEventListener('click', () => {
  startLoading();
  addPhoto(selectedFormat);
});

document.addEventListener('readystatechange', event => { 
  if (event.target.readyState === "complete") {
      document.body.style.backgroundImage = 'url(/imgs/bg.jpg)';
  }
});