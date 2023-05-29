import { documentFormats } from "./documentFormats.mjs";
import Cropper from "./cropper.esm.js";
import { templatesBase64 } from "./templates.mjs";
import { checkRotation, isBase64UrlImage } from "./base64handler.mjs";

const editor = document.getElementById('editor');
var cropper;

export const switchCropperFormat = async (format) => {
    let image = new Image();
    image.src = await checkRotation(templatesBase64[format], format);
    document.querySelector('#editor').appendChild(image);
    drawCropper(image, format);
};

export const processImageData = async (data, format) => {
    if (cropper && await isBase64UrlImage(data)) {
        cropper.replace(await checkRotation(data, format));
    }
};

export const getCropperData = () => {
    return new Promise((res) => {
        let reader = new FileReader();
        reader.onload = function() {
            res(reader.result);
        };
        cropper.getCroppedCanvas().toBlob((blob) => {
            reader.readAsDataURL(blob);
        });
    });
};

export const destroyCropper = () => {cropper.destroy();};

function drawCropper(img, format) {
    const formatDimensions = documentFormats[format].editor;
    editor.style.setProperty('--aspectRatio', formatDimensions.aspectRatio);
    cropper = new Cropper(img, {
        aspectRatio: formatDimensions.aspectRatio,
        ready() {
            const cutBox = document.getElementById('cutBox');
            cutBox.style.position = "absolute";
            cutBox.style.width = "calc("+formatDimensions.width+"% - 3px)";
            cutBox.style.height = "calc("+formatDimensions.height+"% - 3px)";
            cutBox.style.left = formatDimensions.x + "%";
            cutBox.style.top = formatDimensions.y + "%";
        }
    });
}

document.getElementById('rotateRight').addEventListener('click', () => {cropper.rotate(90)});
document.getElementById('rotateLeft').addEventListener('click', () => {cropper.rotate(-90)});

let timer;
document.body.onresize = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        cropper.reset();
    }, 200);
}