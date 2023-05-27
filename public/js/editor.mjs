import { getAspectRatio, getCutSize } from "./export.mjs";
import Cropper from "./cropper.esm.js";
import { templatesBase64 } from "./templates.mjs";

const editor = document.getElementById('editor');
var cropper,
    currentFormat = '';

export const switchCropperFormat = async (format) => {
    let existingImg = document.querySelector('#editor img'),
        image = 0;
    if (existingImg) {
        image = existingImg;
    }
    if(image == 0) {
        image = document.createElement('img');
        image.src = templatesBase64[format];
        document.querySelector('#editor').appendChild(image);
    }
    if(await needsRotation(image.src, format) == true){
        image.src = await rotate(image.src);
    };
    drawCropper(format, image);

    if (currentFormat == '') {
        document.getElementById('editorControls').classList.remove('hide');
        document.getElementById('exportControls').classList.remove('hide');
        document.getElementById('placeHolder').classList.remove('hide');
        document.getElementById('editor').classList.remove('hide');
        reader.addEventListener("load", () => {
            processImageData(reader.result);
        }, false);
    }
    currentFormat = format;
}

export const getCropperData = () => {
    return new Promise((res) => {
        cropper.getCroppedCanvas().toBlob((blob) => {
            res(blobToBase64(blob));
        });
    });
}

export const destroyCropper = () => {
    cropper.destroy();
}

export const manualRotate = (deg) => {
    cropper.rotate(deg);
}

function drawCropper(format, img) {
    const aspect = getAspectRatio(format);
    editor.style.setProperty('--aspectRatio', aspect);
    cropper = new Cropper(img, {
        aspectRatio: aspect,
        ready() {
            const formatDimensions = getCutSize(format),
            cutBox = document.getElementById('cutBox');
            cutBox.style.position = "absolute";
            cutBox.style.width = "calc("+formatDimensions.width+"% - 3px)";
            cutBox.style.height = "calc("+formatDimensions.height+"% - 3px)";
            cutBox.style.left = formatDimensions.x + "%";
            cutBox.style.top = formatDimensions.y + "%";
        }
    });
}

function needsRotation(data, format) {
    return new Promise((res, rej) => {
        let img = new Image();
        img.src = data;
        img.onload = () => {
            let toRotate = false;
            if(img.width > img.height && ['3.5x5','3.5x5f','10x7f'].indexOf(format) != -1) {
                toRotate = true;
            }
            if(img.width < img.height && ['3.5x2','3.5x2.5','4x6','5x7'].indexOf(format) != -1) {
                toRotate = true;
            }
            res(toRotate);
        }
    });
}

function rotate(data) {
    return new Promise((res, rej) => {
        let img = new Image();
        img.src = data;
        img.onload = () => {
            let offScreenCanvas = document.createElement('canvas'),
            offScreenCanvasCtx = offScreenCanvas.getContext('2d');
            offScreenCanvas.height = img.width;
            offScreenCanvas.width = img.height;
            offScreenCanvasCtx.rotate(90 * Math.PI / 180);
            offScreenCanvasCtx.translate(0, -offScreenCanvas.width);
            offScreenCanvasCtx.drawImage(img, 0, 0); 

            res(offScreenCanvas.toDataURL('image/jpeg',100));
        }
    });
}

function blobToBase64(blob) {
    return new Promise(resolve => {
      let reader = new FileReader();
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}

const reader = new FileReader;
export const read = (file) => {
    reader.readAsDataURL(file);
}

async function processImageData(data) {
    let img = document.createElement('img');
    if (await needsRotation(data, currentFormat) == true) {
        img.src = await rotate(data);
    }
    else {
        img.src = data;
    }
    let editingImg = document.querySelector('.cropper-view-box img');
    let droppedImg = document.querySelector('#editor img');
    if (editingImg) {
        cropper.replace(img.src);
    }
    else if (droppedImg) {
        droppedImg.replaceWith(img);
    }
    else {
        document.getElementById('editor').appendChild(img);
    }
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
    
    read(files[0]);
}
  
const dropbox = document.body;
dropbox.addEventListener("dragenter", drag, false);
dropbox.addEventListener("dragover", drag, false);
dropbox.addEventListener("drop", drop, false);

let timer;
document.body.onresize = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        cropper.reset();
    }, 200);
}