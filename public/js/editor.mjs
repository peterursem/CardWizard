import { getAspectRatio, getCutSize } from "./export.mjs";
import Cropper from "./cropper.esm.js";

const editor = document.getElementById('editor');
var cropper;

export const initCropper = (format) => {
    const image = document.querySelector('#editor img');
    const aspect = getAspectRatio(format);
    editor.style.setProperty('--aspectRatio', aspect);
    cropper = new Cropper(image, {
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

document.getElementById('rotateRight').addEventListener('click', () => {
    cropper.rotate(90);
});
document.getElementById('rotateLeft').addEventListener('click', () => {
    cropper.rotate(-90);
});

export const getCropperData = () => {
    return new Promise((res, err) => {
        cropper.getCroppedCanvas().toBlob((blob) => {
            res(blobToBase64(blob));
        });
    });
}

export const destroyCropper = () => {
    cropper.destroy();
}

let blobToBase64 = function(blob) {
    return new Promise(resolve => {
      let reader = new FileReader();
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}

//## Define drag + drop capability ##//

const reader = new FileReader;
export const read = (file) => {
    reader.readAsDataURL(file);
}

reader.addEventListener("load", () => {
    const data = reader.result;
    let img = document.createElement('img');
    img.src = data;

    let editingImg = document.querySelector('.cropper-view-box img');
    let droppedImg = document.querySelector('#editor img');
    if (editingImg) {
        cropper.replace(data);
    }
    else if (droppedImg) {
        droppedImg.replaceWith(img);
    }
    else {
        document.getElementById('editor').appendChild(img);
    }
}, false);

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