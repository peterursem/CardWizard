/*
TODO:

- Get output blob from editor (at 300dpi, check resizing / other requirements for this.)
- Apply one / apply to all for editor (to put on letter sheet)

*/


import { initCropper, destroyCropper } from './editor.mjs';
import { getPossibleFormats, generatePreview } from './export.mjs';

var selectedFormat;

function formatSelected(format) {
  selectedFormat = format;
  const existingCropper = document.querySelector('.cropper-canvas');
  if (existingCropper) {
    destroyCropper();
  }
  initCropper(format);
}

getPossibleFormats()
.then(formats => {
  let i = 0
  formats.forEach(format => {
    let newButton = document.createElement('button');
        newButton.innerHTML = '<h1>' + format.size + '</h1> <a>' + format.desc + '</a> <img src="' + format.example + '">' ;
        newButton.onclick = function() {formatSelected(format.size)};
    document.getElementById('formatBar').appendChild(newButton);
    i++;
  });
  document.getElementById("formatBar").style.setProperty('--noFormats', i);
});

document.getElementById('addAll').addEventListener('click', () => {
  generatePreview(selectedFormat);
});