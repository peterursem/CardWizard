import { addPhotoSilently, generatePreview, getAspectRatio, getCutSize } from "./export.mjs";
import Cropper from "./cropper.esm.js";
import { templatesBase64 } from "./templates.mjs";
import { checkRotation, autoCrop } from "./base64handler.mjs";

const editor = document.getElementById('editor');
var cropper;

export const switchCropperFormat = async (format) => {
    let image = new Image();
    image.src = await checkRotation(templatesBase64[format], format);
    document.querySelector('#editor').appendChild(image);
    drawCropper(image, format);
};

export const processImageData = async (data, format) => {
    if (cropper) {
        cropper.replace(await checkRotation(data, format));
    }
};

export const processBatch = (files, format) => {
    let index = 0;
    Array.from(files).forEach((file) => {
            const reader = new FileReader();
            reader.onload = async () => {
                    const cropImg = await autoCrop(reader.result, getAspectRatio(format));
                    addPhotoSilently(await checkRotation(cropImg));
                    index++;
                    if(index == files.length) {
                        generatePreview(format);
                    }
            }
            reader.readAsDataURL(file);
    });
}

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

export const destroyCropper = () => {
    cropper.destroy();
};

export const manualRotate = (deg) => {
    cropper.rotate(deg);
};

function drawCropper(img, format) {
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

let timer;
document.body.onresize = () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
        cropper.reset();
    }, 200);
}