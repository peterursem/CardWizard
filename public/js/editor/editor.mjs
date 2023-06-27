import { documentFormats } from "../export/documentFormats.mjs";
import Cropper from "../lib/cropper.esm.js";
import { templatesBase64 } from "./templates.mjs";
import { checkRotation, isBase64Image } from "../base64handler.mjs";

const editor = document.getElementById('editor');
var cropper;

export const switchCropperFormat = async format => {
        let image = new Image();
        image.src = '/imgs/templates/'+format+'.jpg';
        document.querySelector('#editor').appendChild(image);
        drawCropper(image, format);
};

export const processImageData = (data, format) => {
        if (cropper) {
                isBase64Image(data)
                .catch(err => {
                        console.warn(err);
                        return;
                })
                .then(img => checkRotation(img, format, 'dataURL'))
                .then(r => cropper.replace(r))
        }
};

export const getCropperData = () => {
        return cropper.getCroppedCanvas({ fillColor: '#fff' }).toDataURL('image/jpeg', 0.8);
};

export const destroyCropper = () => { cropper.destroy(); };

function drawCropper(img, format) {
        const formatDimensions = documentFormats[format].editor;
        editor.style.setProperty('--aspectRatio', formatDimensions.aspectRatio);
        cropper = new Cropper(img, {
                aspectRatio: formatDimensions.aspectRatio,
                ready() {
                        const cutBox = document.getElementById('cutBox');
                        cutBox.style.position = "absolute";
                        cutBox.style.width = "calc(" + formatDimensions.width + "% - 3px)";
                        cutBox.style.height = "calc(" + formatDimensions.height + "% - 3px)";
                        cutBox.style.left = formatDimensions.x + "%";
                        cutBox.style.top = formatDimensions.y + "%";
                }
        });
}

document.getElementById('rotateRight').addEventListener('click', () => { cropper.rotate(90) });
document.getElementById('rotateLeft').addEventListener('click', () => { cropper.rotate(-90) });

let timer;
document.body.onresize = () => {
        clearTimeout(timer);
        timer = setTimeout(() => {
                cropper.reset();
        }, 200);
}