/*
TODO:

- Get output blob from editor (at 300dpi, check resizing / other requirements for this.)
- Apply one / apply to all for editor (to put on letter sheet)

*/


import { initCropper, destroyCropper, read } from './editor.mjs';
import { getPossibleFormats, generatePreview } from './export.mjs';

var selectedFormat;

function formatSelected(format) {
  selectedFormat = format;
  /*
  const existingImg = document.querySelector('#editor img');
  if (existingImg) {
    existingImg.remove();
    destroyCropper();
  }
  */
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

//## Define drag + drop capability ##//
function drag(e) {
  e.stopPropagation();
  e.preventDefault();
}

function drop(e) {
  e.stopPropagation();
  e.preventDefault();

  const dt = e.dataTransfer;
  const files = dt.files;
  
  read(files[0]);
}

const dropbox = document.body;
dropbox.addEventListener("dragenter", drag, false);
dropbox.addEventListener("dragover", drag, false);
dropbox.addEventListener("drop", drop, false);