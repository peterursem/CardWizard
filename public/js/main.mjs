/*
TODO:

- Add a feature that locks the image's original aspect when holding shift.
- Get output blob from editor (at 300dpi, check resizing / other requirements for this.)
- Load aspect ratios and cut marks for editor
- Apply one / apply to all for editor (to put on letter sheet)

*/


import { initCropper, getCropperData, destroyCropper } from './editor.mjs';
import { createDocument, getPossibleFormats } from './export.mjs';

var selectedFormat;

function formatSelected(format) {
  selectedFormat = format;
  const existingImg = document.querySelector('img');
  if (existingImg) {
    existingImg.remove();
    destroyCropper();
  }
  initCropper(format);
}

function generatePreview(format) {
  const existingObject = document.querySelector("object"),
  placeHolder = document.querySelector('#placeHolder');

  getCropperData(format)
  .then(base64Image => {
    const pdf = createDocument(base64Image, format.toLowerCase());
    let object = document.createElement('object');
    object.type = 'application/pdf';
    object.data = pdf;
    if(existingObject) {
      existingObject.remove();
    }
    if(placeHolder) {
      placeHolder.remove();
    }
    document.querySelector('content').appendChild(object);
  });
}

getPossibleFormats()
.then(formats => {
  let i = 0
  formats.forEach(format => {
    let newButton = document.createElement('button');
        newButton.innerText = format;
        newButton.onclick = function() {formatSelected(format)};
    document.getElementById('formatBar').appendChild(newButton);
    i++;
  });
  document.getElementById("formatBar").style.setProperty('--noFormats', i);
});

document.getElementById('addAll').addEventListener('click', () => {
  generatePreview(selectedFormat);
});