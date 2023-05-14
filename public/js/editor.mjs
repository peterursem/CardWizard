import { getAspectRatio, getCutSize } from "./export.mjs";
import Cropper from "./cropper.esm.js";

const editor = document.getElementById('editor');
var image = document.createElement('img'),
cropper;

export const initCropper = (format) => {
    image.src = '/imgs/'+format+".png";
    editor.appendChild(image);
    const aspect = getAspectRatio(format);
    editor.style.setProperty('--aspectRatio', aspect);
    cropper = new Cropper(image, {
        aspectRatio: aspect,
        ready() {
            const formatDimensions = getCutSize(format),
            cutBox = document.getElementById('cutBox');
            cutBox.style.position = "absolute";
            cutBox.style.width = formatDimensions.width+"%";
            cutBox.style.height = formatDimensions.height+"%";
            cutBox.style.left = formatDimensions.x + "%";
            cutBox.style.top = formatDimensions.y + "% ";
        }
    });
}

export const getCropperData = new Promise((res, err) => {
    cropper.getCroppedCanvas().toBlob((blob) => {
        res(blob);
    });
});

export const destroyCropper = () => {
    cropper.destroy();
}
