/*
TODO:

- Get output blob from editor (at 300dpi, check resizing / other requirements for this.)
- Load aspect ratios and cut marks for editor
- Apply one / apply to all for editor (to put on letter sheet)

*/


import { createCanvas } from './editor.mjs';
import { createDocument, getPossibleFormats } from './export.mjs';

let cssVars = document.querySelector(":root");

let getImgBlob = function(url){
    return new Promise(async resolve => {
      const resposne = await fetch(url),
            blob = resposne.blob();

      resolve(blob);
    });
  };
  
let blobToBase64 = function(blob) {
    return new Promise(resolve => {
      let reader = new FileReader();
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}

let getTestImg = async function (size) {
  createCanvas('/imgs/'+size+'.png');
  let blob = await getImgBlob('/imgs/'+size+'.png'),
      base64 = await blobToBase64(blob);
  return base64;
}

const formatSelected = function (format) {
  const existingObject = document.querySelector("object"),
        placeHolder = document.querySelector('#placeHolder');

  getTestImg(format)
  .then(base64Image => {
    const pdf = createDocument(base64Image, format.toLowerCase());
    let object = document.createElement('object');
        object.type = 'application/pdf';
        object.data = pdf;

    if(existingObject) {existingObject.remove();}
    if(placeHolder) {placeHolder.remove();}
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
    document.getElementById('formatRow').appendChild(newButton);
    i++;
  });
  cssVars.style.setProperty('--noFormats', i);
});