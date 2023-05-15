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

const reader = new FileReader;
export const read = (file) => {
    console.log('reading');
    reader.readAsDataURL(file);
}
reader.addEventListener("load", () => {
    const data = reader.result;
    console.log(data);
    let img = document.createElement('img');
    img.src = data;
    document.getElementById('editor').appendChild(img);
}, false);

let blobToBase64 = function(blob) {
    return new Promise(resolve => {
      let reader = new FileReader();
      reader.onload = function() {
        resolve(reader.result);
      };
      reader.readAsDataURL(blob);
    });
}

export const getCropperData = () => {
    return new Promise((res, err) => {
        console.log(cropper);
        cropper.getCroppedCanvas().toBlob((blob) => {
            res(blobToBase64(blob));
        });
    });
}

export const destroyCropper = () => {
    cropper.destroy();
}
